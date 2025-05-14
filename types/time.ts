export interface TimeItem {
    id: number;
    name: string;
    schedule: string[];
  }
  
  export interface FetchTimesResult {
    data: TimeItem[];
    total: number;
  }
  