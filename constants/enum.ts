
export enum USER_TIER {
    ADMIN = "Admin",
    SUPER_ADMIN = "Super Admin",
}

export enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    CANCELLED = "Cancelled",
}

export enum DISCOUNT_TYPE {
    BAHT = "บาท",
    PERCENT = "%"
}

export enum FILTER {
    ALL_STATUS = "All Status",
    ALL_COMPANIES = "All Companies",
    ALL_PAYMENT = "All Payments"
}

export enum TICKET_TYPE {
    FIXED = "fix",
    TIERED = "tier",
}

export const STATUS_LABELS: Record<number, STATUS> = {
  1: STATUS.ACTIVE,
  0: STATUS.INACTIVE,
  2: STATUS.CANCELLED,
};