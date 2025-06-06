// src/types/date.type.ts

export interface DayProps {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface DateItem {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    days: DayProps;
    status: number;
  }

export interface FetchDatesResult {
  data: DateItem[];
  total: number;
}
