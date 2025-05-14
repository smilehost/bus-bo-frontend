
export enum USER_TIER {
    ADMIN = "Admin",
    SUPER_ADMIN = "Super Admin",
}

export enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    CANCELLED = "Cancelled",
}

export enum FILTER {
    ALL_STATUS = "All Status",
    ALL_COMPANIES = "All Companies"
}

export enum TICKET_TYPE {
    FIXED = "Fixed",
    TIERED = "Tiered",
}

export const STATUS_LABELS: Record<number, STATUS> = {
  1: STATUS.ACTIVE,
  0: STATUS.INACTIVE,
  2: STATUS.CANCELLED,
};