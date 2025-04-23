import { USER_TIER, STATUS } from "@/constants/enum"

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

export const timeData = [
    {
        name: "รอบเช้า",
        times: ["08:00", "09:00", "15:00"],
        status: STATUS.ACTIVE
    },
    {
        name: "รอบเช้า",
        times: ["08:00", "09:00"],
        status: STATUS.ACTIVE
    },
    {
        name: "รอบเช้า",
        times: ["08:00", "15:00"],
        status: STATUS.ACTIVE
    },
]

export const scheduleData = [
    {
        name: "Daily"
    },
    {
        name: "Everyday"
    },
    {
        name: "on weekends"
    },
    {
        name: "songkran"
    },
]

export const stationData = [
    {
        name: "Khon Kaen Bus Terminal",
        coordinates: ""
    },
    {
        name: "Bangkok (Mo Chit) Terminal",
        coordinates: ""
    },
    {
        name: "Nakhon Ratchasima Station",
        coordinates: ""
    },
    {
        name: "Udon Thani Terminal",
        coordinates: ""
    },
    {
        name: "Chiang Mai Arcade Terminal",
        coordinates: ""
    },
    {
        name: "Ubon Ratchathani Station",
        coordinates: ""
    },
    {
        name: "Phitsanulok Bus Station",
        coordinates: ""
    },
    {
        name: "Surat Thani Bus Terminal",
        coordinates: ""
    },
    {
        name: "Hat Yai Bus Terminal",
        coordinates: ""
    },
]

export const routeData = [
    {
        company: companyData[0].name,
        route: "Northern Express",
        schedule: "Daily",
        times: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#3B82F6]",
        stations: ["1","4","2","5"],
    },
    {
        company: companyData[1].name,
        route: "Southern Route",
        schedule: "Weekdays",
        times: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#10B981]",
        stations: ["1","4","2","5"],
    },
    {
        company: companyData[2].name,
        route: "Eastern Circuit",
        schedule: "Weekdays",
        times: ["08:00", "12:00"],
        status: STATUS.INACTIVE,
        routeColor: "bg-[#F59E0B]",
        stations: ["1","4","2","5"],
    },
    {
        company: companyData[3].name,
        route: "Western Line",
        schedule: "Daily",
        times: ["08:00", "12:00", "16:00"],
        status: STATUS.ACTIVE,
        routeColor: "bg-[#8B5CF6]",
        stations: ["1","4","2","5"],
    },
]