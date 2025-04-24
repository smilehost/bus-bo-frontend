// types/entities.ts

export interface Account {
    account_id: number;
    account_username: string;
    account_password: string;
    account_name: string;
    account_com_id: number;
    account_menu: string;
    account_status: number;
  }
  
  export interface Company {
    com_id: number;
    com_name: string;
  }
  
  export interface Member {
    member_id: number;
    member_com_id: number;
    member_phone: string;
    member_date: string;
  }
  
  export interface PaymentMethod {
    payment_method_id: number;
    payment_method_name: string;
    payment_method_status: number;
  }
  
  export interface PriceType {
    price_type_id: number;
    price_type_name: string;
  }
  
  export interface Route {
    route_id: number;
    route_name_th: string;
    route_name_en: string;
    route_color: string;
    route_status: number;
    route_com_id: number;
    date_id: number;
    time_id: number;
    route_array: string;
  }
  
  export interface RouteDate {
    route_date_id: number;
    route_date_name: string;
    route_date_start: string;
    route_date_end: string;
    route_date_mon: number;
    route_date_tue: number;
    route_date_wen: number;
    route_date_thu: number;
    route_date_fri: number;
    route_date_sat: number;
    route_date_sun: number;
    route_date_com_id: number;
  }
  
  export interface RouteLocation {
    route_location_id: number;
    route_location_name: string;
    route_location_lat: string;
    route_location_long: string;
    route_location_com_id: number;
  }
  
  export interface RouteTime {
    route_time_id: number;
    route_time_name: string;
    route_time_array: string;
    route_time_com_id: number;
  }
  
  export interface Ticket {
    ticket_id: number;
    ticket_name_th: string;
    ticket_name_en: string;
    ticket_color: string;
    ticket_status: number;
    ticket_route_id: number;
    ticket_amount: number;
  }
  
  export interface TicketPrice {
    ticket_price_id: number;
    ticket_location_start: string;
    ticket_location_stop: string;
    price: string;
    price_type_id: number;
    ticket_price_ticket_id: number;
  }
  
  export interface Transaction {
    transaction_id: number;
    transaction_datetime: string;
    transaction_lat: string;
    transaction_long: string;
    transaction_payment_method_id: number;
    transaction_amount: string;
    transaction_pax: number;
    transaction_member_id: number;
  }