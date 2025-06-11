export interface InsertPaymentPayload {
    payment_method_name: string,
    payment_method_url: string,
    payment_method_type: string,
    payment_method_slip: number,
    payment_method_id?: number
}

export interface getPaymentPayload extends InsertPaymentPayload {
    payment_method_id: number,
    payment_method_status: number,
    com_id: number,
}

export interface FetchPaymentQuery {
    com_id: number
}