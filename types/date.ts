// src/types/date.type.ts

export interface DateItem {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    days: {
      mon: boolean;
      tue: boolean;
      wed: boolean;
      thu: boolean;
      fri: boolean;
      sat: boolean;
      sun: boolean;
    };
    status: string;
  }

export interface FetchDatesResult {
  data: DateItem[];
  total: number;
}
