import { VocabularyItem } from '@/types/vocabulary';

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private vocabularyData: VocabularyItem[] = [];

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  async fetchVocabularyData(spreadsheetId: string, range: string = 'comprehensive-vocabulary!A2:G'): Promise<VocabularyItem[]> {
    try {
      // クライアントサイドで直接Google Sheets APIを呼び出し
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
      if (!apiKey) {
        console.error('Google Sheets API key not configured');
        return [];
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
      
      const data = await response.json();
      this.vocabularyData = this.parseSheetData(data.values || []);
      return this.vocabularyData;
    } catch (error) {
      console.error('Error fetching vocabulary data:', error);
      return [];
    }
  }

  private parseSheetData(rows: string[][]): VocabularyItem[] {
    return rows.map((row, index) => {
      // 6列の場合（古いフォーマット）と7列の場合（新しいフォーマット）を判定
      const isNewFormat = row.length >= 7;
      
      if (isNewFormat) {
        return {
          id: `vocab_${index + 1}`,
          japanese: row[0] || '',
          chinese: row[1] || '',
          pinyin: row[2] || '',
          example: row[3] || '',
          examplePinyin: row[4] || '',
          exampleJapanese: row[5] || '',
          hskLevel: parseInt(row[6]) || 1,
        };
      } else {
        // 古いフォーマット（6列）
        return {
          id: `vocab_${index + 1}`,
          japanese: row[0] || '',
          chinese: row[1] || '',
          pinyin: row[2] || '',
          example: row[3] || '',
          examplePinyin: row[4] || '',
          exampleJapanese: undefined, // 和訳なし
          hskLevel: parseInt(row[5]) || 1,
        };
      }
    });
  }

  getVocabularyByHskLevel(level: number): VocabularyItem[] {
    return this.vocabularyData.filter(item => item.hskLevel === level);
  }

  getAllVocabulary(): VocabularyItem[] {
    return this.vocabularyData;
  }
}