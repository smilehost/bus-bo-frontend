import { store } from "@/stores/store";
function useLanguageContext() {
  const lang = store.Translation.use();
  const role = store.account_role.use();
  const isTH = lang === "TH";
  const isSuperAdmin = role === "1";
  return { role, isTH, isSuperAdmin };
}

export function getTextMenu({
  isTH,
  isSuperAdmin,
}: {
  isTH: boolean;
  isSuperAdmin: boolean;
}) {
  return {
    overview: isTH ? "ภาพรวม" : "OVERVIEW",
    setup: isTH ? "ตั้งค่าเส้นทาง & ตั๋ว" : "SETUP ROUTE & TICKET",
    template: isTH ? "แม่แบบข้อมูล" : "TEMPLATE",
    users: isTH ? "ผู้ใช้งาน" : "USERS",

    dashboard: isTH ? "แดชบอร์ด" : "Dashboard",
    reports: isTH ? "รายงาน" : "Reports",
    sellTicket: isTH ? "ขายตั๋ว" : "Sell Ticket",

    manageRoute: isTH ? "จัดการเส้นทาง" : "Manage Routes",
    manageTicket: isTH ? "จัดการตั๋ว" : "Manage Tickets",

    manageLocation: isTH ? "จัดการสถานที่" : "Manage Location",
    managePromo: isTH ? "จัดการโปรโมชัน" : "Manage Promotion",
    manageDate: isTH ? "จัดการวันที่" : "Manage Date",
    manageTime: isTH ? "จัดการเวลา" : "Manage Times",

    manageUser: isSuperAdmin
      ? isTH
        ? "จัดการแอดมิน"
        : "Manage Admin"
      : isTH
      ? "จัดการพนักงาน"
      : "Manage Employee",
    manageCompany: isTH ? "จัดการบริษัท" : "Manage Company",
  };
}

export function getTextFormRoute({ isTH }: { isTH: boolean }) {
  return {
    routeNameTH: isTH ? "ชื่อเส้นทาง (ไทย)" : "Route Name TH",
    routeNameEN: isTH ? "ชื่อเส้นทาง (อังกฤษ)" : "Route Name EN",
    placeholderTH: isTH ? "กรอกชื่อเส้นทางภาษาไทย" : "Enter Route Name Thai",
    placeholderEN: isTH ? "กรอกชื่อเส้นทางภาษาอังกฤษ" : "Enter Route Name Eng",
    timeLabel: isTH ? "เวลาเดินรถ" : "Times",
    scheduleLabel: isTH ? "ตารางเดินรถ" : "Schedule",
    routeColor: isTH ? "สีของเส้นทาง" : "Route Color",
    headerUrl: isTH
      ? "URL รายละเอียดสลิปส่วนหัว"
      : "URL for slip details at the header",
    footerUrl: isTH
      ? "URL รายละเอียดสลิปส่วนท้าย"
      : "URL for slip details at the footer",
    placeholderUrl: isTH ? "กรอก URL..." : "Enter URL...",
    cancel: isTH ? "ยกเลิก" : "Cancel",
    addRoute: isTH ? "เพิ่มเส้นทาง" : "Add Route",
    editRoute: isTH ? "แก้ไขเส้นทาง" : "Edit Route",
    title: isTH ? "สถานี" : "Stations",
    subtitle: isTH
      ? "เพิ่มสถานีตามลำดับจากต้นทางไปปลายทาง"
      : "Add stations in order from start to end",
  };
}

export function getTextFormTicket({ isTH }: { isTH: boolean }) {
  return {
    nameTH: isTH ? "ชื่อตั๋ว (ภาษาไทย)" : "Ticket Name (Thai)",
    nameEN: isTH ? "ชื่อตั๋ว (ภาษาอังกฤษ)" : "Ticket Name (English)",
    ticketTypeLabel: isTH ? "ประเภทตั๋ว" : "Ticket Type",
    fixedText: isTH ? "ราคาคงที่" : "Fixed Price",
    tieredText: isTH ? "ราคาตามชั้น" : "Tiered Price",
    amountLabel: isTH ? "จำนวนตั๋ว" : "Ticket Amount",
    amountPlaceholder: isTH ? "กรอกจำนวนตั๋ว" : "Enter ticket amount",
    colorLabel: isTH ? "สีของตั๋ว" : "Ticket Color",
    priceTypeLabel: isTH ? "รูปแบบราคาตั๋ว" : "Ticket Price Type",
  };
}

export function getTextRoute({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการเส้นทางรถ" : "Manage Routes",
    des: isTH ? "ดูและจัดการเส้นทางรถ" : "View and manage bus routes",
    btnText: isTH ? "เพิ่มเส้นทางรถ" : "Add Route",
    search: isTH ? "ค้นหาเส้นทาง" : "Search Route",
    tableTitle: isTH ? "เส้นทาง" : "Routes",
    schedule: isTH ? "ตารางเดินรถ" : "Schedule",
    times: isTH ? "เวลาเดินรถ" : "Departure Times",
    amount: isTH ? "ตั๋วทั้งหมดในเส้นทาง" : "Total tickets in route",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",
    addTicket: isTH ? "เพิ่มตั๋ว" : "Add Ticket",
    edit: isTH ? "แก้ไข" : "Edit",
    delete: isTH ? "ลบ" : "Delete",
  };
}

export function getTextRouteTicketBystep({ isTH }: { isTH: boolean }) {
  return {
    New: isTH ? "Ticket - Create New Ticket" : "สร้างตั๋วรถใหม่",
    Edit: isTH ? "Ticket - Edit Ticket" : "แก้ไขตั๋วรถ",
    title: isTH ? "Tickets" : "ตั๋วรถ",
    manPrice: isTH ? "Manage Price" : "จัดการราคา",
    manTicketPrice: isTH ? "Ticket - Manage Price" : "จัดการราคาตั๋ว",
  };
}

export function getTextManageUserPage({
  isTH,
  isSuperAdmin,
}: {
  isTH: boolean;
  isSuperAdmin: boolean;
}) {
  return {
    title: isSuperAdmin
      ? isTH
        ? "จัดการแอดมิน"
        : "Manage Admins"
      : isTH
      ? "จัดการพนักงาน"
      : "Manage Employees ",
    description: isSuperAdmin
      ? isTH
        ? "ดูและจัดการผู้ใช้งานระดับแอดมิน"
        : "View and manage admin-level users"
      : isTH
      ? "ดูและจัดการข้อมูลลูกค้า"
      : "View and manage customer information",
    btnText: isSuperAdmin
      ? isTH
        ? "เพิ่มแอดมิน"
        : "Add New Admin"
      : isTH
      ? "เพิ่มสมาชิก"
      : "Add New Member",
    number: isTH ? "ลำดับ" : "No.",
    name: isTH ? "ชื่อ" : "Name",
    userName: isTH ? "ชื่อผู้ใช้" : "Username",
    com: isTH ? "บริษัท" : "Company",
    role: isTH ? "บทบาท" : "Role",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",
    ChangePassword: isTH ? "เปลี่ยนรหัสผ่าน" : "Change Password",
    view: isTH ? "ดูข้อมูล" : "View Details",
  };
}

export function getTextTableMatrix({ isTH }: { isTH: boolean }) {
  return {
    rowLabel: isTH ? "จำนวนแถว" : "Row Value",
    colLabel: isTH ? "จำนวนคอลัมน์" : "Column Value",
    applyText: isTH ? "ใช้ค่า" : "Apply",
    saveText: isTH ? "บันทึกตาราง" : "Save Table",
    selectedRowsLabel: isTH ? "แถวที่เลือก:" : "Selected Rows:",
    selectedColsLabel: isTH ? "คอลัมน์ที่เลือก:" : "Selected Columns:",
    noneText: isTH ? "ไม่มี" : "None",
  };
}
export function getTextTicketPage({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการตั๋วรถ" : "Manage Tickets",
    description: isTH ? "ดูและจัดการตั๋วรถ" : "View and manage bus tickets",
    btnText: isTH ? "เพิ่มตั๋วรถ" : "Add Ticket",
    search: isTH ? "ค้นหาตั๋ว" : "Search Ticket",
    tableTitle: isTH ? "ตั๋วรถ" : "Tickets",
    route: isTH ? "เส้นทาง" : "Route",
    amount: isTH ? "จำนวนตั๋ว" : "Ticket Amount",
    type: isTH ? "ประเภทราคา" : "Ticket Type Price",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",
  };
}
export function getTextLocation({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการสถานที่" : "Manage Location",
    description: isTH ? "ดูและจัดการสถานที่" : "View and manage location",
    btnText: isTH ? "เพิ่มสถานที่" : "Add Location",
    name: isTH ? "ชื่อสถานที่" : "Location Name",
    lat: isTH ? "ละติจูด" : "Latitude",
    long: isTH ? "ลองจิจูด" : "Longitude",
    action: isTH ? "การดําเนินการ" : "Action",
    search: isTH ? "ค้นหาสถานที่" : "Search Location",
    number: isTH ? "ลำดับ" : "No.",
  };
}

export function getTextDate({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการวันที่" : "Manage Date",
    description: isTH
      ? "ดูและจัดการวันที่"
      : "View and manage date information",
    btnText: isTH ? "เพิ่มวันที่" : "Add New Date",
    name: isTH ? "ชื่อวันที่" : "Date Name",
    date: isTH ? "วันที่" : "Date",
    action: isTH ? "การดําเนินการ" : "Action",
    search: isTH ? "ค้นหาด้วยชื่อ..." : "Search by name...",
    number: isTH ? "ลำดับ" : "No.",
    status: isTH ? "สถานะ" : "Status",
    monday: isTH ? "จันทร์" : "Monday",
    tuesday: isTH ? "อังคาร" : "Tuesday",
    wednesday: isTH ? "พุธ" : "Wednesday",
    thursday: isTH ? "พฤหัส" : "Thursday",
    friday: isTH ? "ศุกร์" : "Friday",
    saturday: isTH ? "เสาร์" : "Saturday",
    sunday: isTH ? "อาทิตย์" : "Sunday",
    active: isTH ? "ใช้งาน" : "Active",
    inactive: isTH ? "ไม่ใช้งาน" : "Inactive",
    expiresOn: isTH ? "หมดอายุ" : "Expires on",
    filters: isTH ? "ตัวกรอง" : "Filters",
    allStatus: isTH ? "ทุกสถานะ" : "All Status",
  };
}

export function getTextTime({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการเวลา" : "Manage Time",
    description: isTH ? "ดูและจัดการเวลา" : "View and manage time information",
    btnText: isTH ? "เพิ่มเวลา" : "Add New Time",
    name: isTH ? "ชื่อเวลา" : "Name",
    schedule: isTH ? "ตารางเวลา" : "Schedule",
    time: isTH ? "เวลา" : "Time",
    action: isTH ? "การดําเนินการ" : "Actions",
    search: isTH ? "ค้นหาด้วยเวลา..." : "Search by time...",
    number: isTH ? "ลำดับ" : "No.",
    status: isTH ? "สถานะ" : "Status",
    active: isTH ? "ใช้งาน" : "Active",
    inactive: isTH ? "ไม่ใช้งาน" : "Inactive",
  };
}

export { useLanguageContext };
