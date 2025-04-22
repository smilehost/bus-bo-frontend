import { USER_TIER, SCHEDULE, STATUS } from "@/constants/enum"

export const userData = {
    user_tier: USER_TIER.ADMIN,
    name: "TEST USER"
}

export const companyData = [
    {
        name: "Northern Bus Co."
    },
    {
        name: "Southern Express"
    },
    {
        name: "Eastern Transport"
    },
    {
        name: "Western Motors"
    },
]

export const routeData = [
    {
        company: companyData[0].name,
        route: "Northern Express",
        schedule: SCHEDULE.DAILY,
        time: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#3B82F6]"
    },
    {
        company: companyData[1].name,
        route: "Southern Route",
        schedule: SCHEDULE.WEEKDAYS,
        time: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#10B981]"
    },
    {
        company: companyData[2].name,
        route: "Eastern Circuit",
        schedule: SCHEDULE.WEEKDAYS,
        time: ["08:00", "12:00"],
        status: STATUS.INACTIVE,
        routeColor: "bg-[#F59E0B]"
    },
    {
        company: companyData[3].name,
        route: "Western Line",
        schedule: SCHEDULE.DAILY,
        time: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#8B5CF6]"
    },
]
