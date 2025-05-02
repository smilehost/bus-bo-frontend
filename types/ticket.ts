export interface Ticket {
    id: string;
    route: string;
    journey: string;
    date: string;
    time: string;
    status: 'Active' | 'Canceled';
    amount: number;
    price: string;
  }
  