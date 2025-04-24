import { STATUS } from "@/constants/enum"

export type RouteType = {
    id: string
    company: string
    route: string
    schedule: string
    times: string
    status: STATUS
    routeColor: string
    stations: string[]
}
