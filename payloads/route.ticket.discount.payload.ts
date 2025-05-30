export interface RouteTicketDiscount {
    ticket_discount_id: number,
    ticket_discount_name: string,
    ticket_discount_type: number,
    ticket_discount_status: number,
    ticket_discount_value: number
    ticket_discount_com_id: number
}

export interface InsertTicketDiscount {
    ticket_discount_name: string,
    ticket_discount_type: number,
    ticket_discount_value: number
}