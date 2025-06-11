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
    subtitle: isTH ? "เพิ่มสถานีตามลำดับจากต้นทางไปปลายทาง" : "Add stations in order from start to end",
    stList: isTH ? "รายการสถานี" : "Station List",
    stThis: isTH ? "สถานีในเส้นทาง" : "Stations along the route",
    Drag: isTH ? "ลากสถานี" : "Drag items here to add",
    search: isTH ? "ค้นหาสถานี" : "Search Station",
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
    confirmDeleteTitle: isTH ? 'ลบเส้นทาง "${route}"?' : 'Delete "${route}"?',
    confirmDeleteText: isTH
      ? 'กรุณาพิมพ์ชื่อเส้นทางด้านล่างเพื่อยืนยันการลบ'
      : 'Please type the route name below to confirm deletion.',
    confirmDeletePlaceholder: isTH ? 'พิมพ์ชื่อเส้นทางที่นี่' : 'Type route name here',
    confirmDeleteConfirm: isTH ? 'ลบ' : 'Delete',
    confirmDeleteCancel: isTH ? 'ยกเลิก' : 'Cancel',
    successDelete: isTH ? 'ลบเส้นทางสำเร็จ!' : 'Delete route successfully!',
    errorDelete: isTH ? 'เกิดข้อผิดพลาด: ' : 'Error: ',
    mismatchTitle: isTH ? 'ชื่อไม่ตรงกัน!' : 'Name mismatch!',
    mismatchText: isTH
      ? 'ชื่อที่พิมพ์ไม่ตรงกับชื่อเส้นทาง'
      : 'The typed name does not match the route name.',
    changeStatusTitle: isTH ? 'เปลี่ยนสถานะ?' : 'Change Status?',
    changeStatusText: (statusText: string) =>
      isTH
        ? `คุณต้องการเปลี่ยนสถานะเป็น "${statusText}" หรือไม่`
        : `Do you want to change the status to "${statusText}"`,
    confirmText: isTH ? 'ยืนยัน' : 'Confirm',
    cancelText: isTH ? 'ยกเลิก' : 'Cancel',
    successChangeStatus: isTH ? 'เปลี่ยนสถานะเรียบร้อย!' : 'Change status successfully!',
    errorChangeStatus: isTH ? 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' : 'Change status error: ',
    successCreate: isTH ? 'สร้างเส้นทางเรียบร้อย!' : 'Create route successfully!',
    errorCreate: isTH ? 'เกิดข้อผิดพลาดในการสร้างเส้นทาง: ' : 'Create route error: ',
    successUpdate: isTH ? 'อัปเดตเส้นทางเรียบร้อย!' : 'Update route successfully!',
    errorUpdate: isTH ? 'เกิดข้อผิดพลาดในการอัปเดตเส้นทาง: ' : 'Update route error: ',
    titleEditRoute: isTH ? 'แก้ไขเส้นทาง' : 'Edit Route',
    titleAddRoute: isTH ? 'เพิ่มเส้นทาง' : 'Add Route',
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
      ? "เพิ่มสมาชิกพนักงาน"
      : "Add New Employee",
    number: isTH ? "ลำดับ" : "No.",
    name: isTH ? "ชื่อจริง" : "Name",
    userName: isTH ? "ชื่อผู้ใช้" : "Username",
    com: isTH ? "บริษัท" : "Company",
    role: isTH ? "บทบาท" : "Role",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",
    ChangePassword: isTH ? "เปลี่ยนรหัสผ่าน" : "Change Password",
    view: isTH ? "ดูข้อมูล" : "View Details",

    confirmCreateTitle: isTH ? "ยืนยันการสร้าง" : "Confirm Create",
    confirmUpdateTitle: isTH ? "ยืนยันการแก้ไข" : "Confirm Update",
    confirmStatusTitle: isTH ? "ยืนยันการเปลี่ยนสถานะ" : "Confirm Status Change",
    confirmPasswordTitle: isTH ? "ยืนยันการเปลี่ยนรหัสผ่าน" : "Confirm Password Change",

    confirmCreateText: isTH ? "คุณต้องการสร้างสมาชิกนี้ใช่หรือไม่?" : "Do you want to create this member?",
    confirmUpdateText: isTH ? "คุณต้องการแก้ไขสมาชิกนี้ใช่หรือไม่?" : "Do you want to update this member?",
    confirmStatusText: isTH ? "คุณต้องการเปลี่ยนสถานะใช่หรือไม่?" : "Do you want to update the status?",
    confirmPasswordText: isTH ? "คุณต้องการเปลี่ยนรหัสผ่านใช่หรือไม่?" : "Do you want to change the password?",

    confirmText: isTH ? "ยืนยัน" : "Confirm",
    cancelText: isTH ? "ยกเลิก" : "Cancel",
    createBtn: isTH ? "สร้าง" : "Create",
    updateBtn: isTH ? "อัปเดต" : "Update",

    alertCreatedTitle: isTH ? "สร้างสำเร็จ!" : "Created!",
    alertUpdatedTitle: isTH ? "อัปเดตสำเร็จ!" : "Updated!",
    alertErrorTitle: isTH ? "ผิดพลาด!" : "Error!",

    alertCreatedText: isTH ? "สร้างสมาชิกเรียบร้อยแล้ว" : "Member created.",
    alertUpdatedText: isTH ? "แก้ไขสมาชิกเรียบร้อยแล้ว" : "Member updated.",
    alertStatusText: isTH ? "สถานะถูกเปลี่ยนแล้ว" : "Status changed.",
    alertPasswordText: isTH ? "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" : "Password changed.",
    alertFailedSave: isTH ? "ไม่สามารถบันทึกสมาชิกได้" : "Failed to save member.",
    alertFailedStatus: isTH ? "ไม่สามารถเปลี่ยนสถานะได้" : "Failed to change status.",
    alertFailedPassword: isTH ? "ไม่สามารถเปลี่ยนรหัสผ่านได้" : "Failed to change password.",

    fillIn: isTH ? "กรุณากรอกข้อมูลสมาชิก" : "Fill in the member details below",
    editMem: isTH ? "แก้ไขสมาชิก" : "Edit Member",
    passWord: isTH ? "รหัสผ่าน" : "Password",
    genPassword: isTH ? "สร้างรหัสผ่าน" : "Generate Password",
    addMem: isTH ? "เพิ่มสมาชิก" : "Add Member",
    enterMem: isTH ? "กรอกชื่อจริง" : "Enter Name",
    enterUser: isTH ? "กรอกชื่อผู้ใช้" : "Enter Username",
    enterPass: isTH ? "กรอกรหัสผ่าน" : "Enter Password",
    seCom: isTH ? "เลือกบริษัท" : "Select Company",

    editStatus: isTH ? "แก้ไขสถานะ" : "Edit Status",
    btnSave: isTH ? "บันทึก" : "Save",
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
    confirmDeleteTitle: (ticketName: string) =>
      isTH ? `ลบ "${ticketName}"?` : `Delete "${ticketName}"?`,
    confirmDeleteText: isTH
      ? "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้"
      : "Are you sure you want to delete it.",
    confirmDeletePlaceholder: isTH
      ? "พิมพ์ชื่อของตั๋วที่นี่"
      : "Type ticket name here",
    confirmText: isTH ? "ลบ" : "Delete",
    cancelText: isTH ? "ยกเลิก" : "Cancel",
    confirm: isTH ? "ยืนยัน" : "Confirm",
    successDelete: isTH ? "ลบตั๋วเรียบร้อยแล้ว!" : "Delete ticket successfully!",
    errorDelete: isTH ? "เกิดข้อผิดพลาด: " : "Error: ",
    mismatchTitle: isTH ? "ชื่อไม่ตรงกัน!" : "Name mismatch!",
    holdEdit: isTH ? "แก้ไข" : "Edit",
    hildDelete: isTH ? "รอสักครู่..." : "",
    mismatchText: isTH
      ? "ชื่อที่พิมพ์ไม่ตรงกับชื่อตั๋ว"
      : "The typed name does not match the ticket name.",

    // 🔄 สำหรับการเปลี่ยนสถานะ
    changeStatusTitle: isTH ? "เปลี่ยนสถานะ?" : "Change Status?",
    changeStatusText: (statusText: string) =>
      isTH
        ? `คุณต้องการเปลี่ยนสถานะเป็น "${statusText}" หรือไม่`
        : `Do you want to change the status to "${statusText}"`,
    successChangeStatus: isTH
      ? "เปลี่ยนสถานะเรียบร้อยแล้ว!"
      : "Status changed successfully!",
    errorChangeStatus: isTH
      ? "เปลี่ยนสถานะไม่สำเร็จ: "
      : "Failed to change status: ",
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
    confirmCreateTitle: isTH ? "ยืนยันการสร้าง" : "Confirm Create",
    confirmUpdateTitle: isTH ? "ยืนยันการแก้ไข" : "Confirm Update",
    confirmCreateText: isTH
      ? "คุณต้องการสร้างตำแหน่งนี้ใช่หรือไม่?"
      : "Do you want to create this location?",
    confirmUpdateText: isTH
      ? "คุณต้องการอัปเดตตำแหน่งนี้ใช่หรือไม่?"
      : "Do you want to update this location?",
    createBtn: isTH ? "สร้าง" : "Create",
    updateBtn: isTH ? "อัปเดต" : "Update",
    cancelBtn: isTH ? "ยกเลิก" : "Cancel",
    alertCreatedTitle: isTH ? "สร้างเรียบร้อย!" : "Created!",
    alertCreatedText: isTH ? "สร้างตำแหน่งใหม่เรียบร้อยแล้ว" : "Location created.",
    alertUpdatedTitle: isTH ? "อัปเดตเรียบร้อย!" : "Updated!",
    alertUpdatedText: isTH ? "อัปเดตตำแหน่งเรียบร้อยแล้ว" : "Location updated.",
    errorTitle: isTH ? "เกิดข้อผิดพลาด!" : "Error!",
    errorText: isTH ? "บางอย่างผิดพลาด" : "Something went wrong.",

    // Delete
    confirmDeleteTitle: isTH ? "ยืนยันการลบ" : "Confirm Delete",
    confirmDeleteText: isTH
      ? "คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งนี้?"
      : "Are you sure you want to delete this location?",
    deleteBtn: isTH ? "ลบ" : "Delete",
    alertDeletedTitle: isTH ? "ลบเรียบร้อย!" : "Deleted!",
    alertDeletedText: isTH ? "ลบตำแหน่งเรียบร้อยแล้ว" : "Location deleted.",
    deleteErrorText: isTH ? "ลบไม่สำเร็จ" : "Failed to delete.",
    addLoc: isTH ? "เพิ่มตำแหน่ง" : "Add Location",
    editLoc: isTH ? "แก้ไขตำแหน่ง" : "Edit Location",
    latLong: isTH ? "ตำแหน่ง (ละติจูด, ลองจิจูด)" : "Location (Latitude, Longitude)",
    placeholderNameLoc: isTH ? "กรอกชื่อตำแหน่ง" : "Enter location name",
    fillIn: isTH ? "กรอกข้อมูลตำแหน่ง" : "Fill in the location details below",
    upDate: isTH ? "อัปเดตข้อมูลตำแหน่ง" : "Update the location details below",
    toastError: isTH ? "กรุณากรอกข้อมูลให้ถูกต้อง" : "Please fill in all fields correctly.",
  };
}
export function getTextPriceType({ isTH }: { isTH: boolean }) {
  return {
    typeTitle: isTH ? "จัดการประเภทตั๋ว" : "Manage Ticket Types",
    typeSubtitle: isTH ? "จัดการและดูข้อมูลประเภทตั๋ว" : "View and manage ticket type information",
    addType: isTH ? "เพิ่มประเภทตั๋ว" : "Add Ticket Type",
    disCountTitle: isTH ? "จัดการราคาส่วนลด" : "Manage Ticket Discount Price",
    disCountSubtitle: isTH ? "จัดการและดูข้อมูลราคาส่วนลด" : "View and manage discount price information",
    addDisCount: isTH ? "เพิ่มราคาส่วนลด" : "Add Discount Price",
    btnEdit: isTH ? "แก้ไข" : "Edit",
    btnDelete: isTH ? "ลบ" : "Delete",

    isEdit: isTH ? "แก้ไขประเภทราคา" : "Edit Price Type",
    isAdd: isTH ? "เพิ่มประเภทราคา" : "Add Price Type",
    inputText: isTH ? "กรอกรายละเอียดประเภทตั๋วด้านล่าง" : "Fill in the price type details below.",
    inputPlaceholder: isTH ? "พิมพ์ชื่อประเภทตั๋วที่นี่" : "Type route name here",
    inputEmptyError: isTH ? "ห้ามเว้นชื่อว่าง" : "Name cannot be empty",
    createdSuccess: isTH ? "สร้างเรียบร้อย!" : "Created successfully!",
    createdError: isTH ? "สร้างไม่สำเร็จ" : "Creation failed",
    updatedSuccess: isTH ? "อัปเดตเรียบร้อย!" : "Updated successfully!",
    updatedError: isTH ? "อัปเดตไม่สำเร็จ" : "Update failed",
    label: isTH ? "ชื่อเส้นทาง" : "Route Name",
    

    // ✨ Discount Dialog
    confirmCreateTitle: isTH ? "ยืนยันการสร้าง" : "Confirm Create",
    confirmUpdateTitle: isTH ? "ยืนยันการอัปเดต" : "Confirm Update",
    confirmCreateText: isTH ? "คุณต้องการสร้างส่วนลดนี้หรือไม่?" : "Do you want to create this discount?",
    confirmUpdateText: isTH ? "คุณต้องการอัปเดตส่วนลดนี้หรือไม่?" : "Do you want to update this discount?",
    createBtn: isTH ? "สร้าง" : "Create",
    updateBtn: isTH ? "อัปเดต" : "Update",
    cancelBtn: isTH ? "ยกเลิก" : "Cancel",
    saveError: isTH ? "เกิดข้อผิดพลาดขณะบันทึกส่วนลด" : "Save Discount error:",

    // ✨ Status Change
    changeStatusTitle: isTH ? "เปลี่ยนสถานะ?" : "Change Status?",
    changeStatusText: (statusText: string) =>
      isTH ? `คุณต้องการเปลี่ยนสถานะเป็น "${statusText}" หรือไม่?` : `Do you want to change the status to "${statusText}"`,
    confirmText: isTH ? "ยืนยัน" : "Confirm",
    statusChangedSuccess: isTH ? "เปลี่ยนสถานะเรียบร้อย!" : "Change status successfully!",
    statusChangedError: isTH ? "เปลี่ยนสถานะไม่สำเร็จ" : "Change status error",

    // ✨ Delete
    deleteTitle: (name: string) => isTH ? `ลบ "${name}"?` : `Delete "${name}"?`,
    deleteConfirmText: isTH ? "กรุณาพิมพ์ชื่อเพื่อลบ" : "Please type the route name below to confirm deletion.",
    deleteBtn: isTH ? "ลบ" : "Delete",
    deleteSuccess: isTH ? "ลบเรียบร้อยแล้ว!" : "Deleted successfully!",
    deleteError: isTH ? "ลบไม่สำเร็จ" : "Delete failed.",
    nameMismatchTitle: isTH ? "ชื่อไม่ตรงกัน!" : "Name mismatch!",
    nameMismatchText: isTH ? "ชื่อที่พิมพ์ไม่ตรงกับชื่อที่ต้องการลบ" : "The typed name does not match the route name.",

    //Ticket Types table
    no: isTH ? "ลำดับ" : "No.",
    priceTypeTable: isTH ? "ประเภทตั๋ว" : "Ticket Type",

    //Ticket Types table
    name: isTH ? "ชื่อ" : "Name",
    value: isTH ? "ค่าส่วนลด" : "Value",
    DiscountType: isTH ? "ประเภทส่วนลด" : "Discount Type",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",

    addDiscount: isTH ? "เพิ่มส่วนลด" : "Add Discount",
    editDiscount: isTH ? "แก้ไขส่วนลด" : "Edit Discount",
    discountFillInfo: isTH ? "กรอกรายละเอียดส่วนลดด้านล่าง" : "Fill in the Discount details below", 
    discountUpdateFill: isTH ? "อัปเดตรายละเอียดส่วนลดด้านล่าง" : "Update the Discount details below",
    enterTicket: isTH ? "กรอกชื่อส่วนลด" : "Enter Discount Name",
  };
}

export function getTextDateManagement({ isTH }: { isTH: boolean }) {
  return {
    dateTitle: isTH ? "จัดการช่วงวันที่" : "Manage Date",
    dateSubTitle: isTH ? "ดูแลและจัดการช่วงวันที่" : "View and manage date information",
    addDate: isTH ? "เพิ่มช่วงวันที่" : "Add Date",
    upDate: isTH ? "อัปเดตช่วงวันที่" : "Update Date",

    // Confirm Modal
    confirmTitleCreate: isTH ? "ยืนยันการสร้าง" : "Confirm Create",
    confirmTitleUpdate: isTH ? "ยืนยันการอัปเดต" : "Confirm Update",
    confirmTextCreate: isTH
      ? "คุณต้องการสร้างช่วงเวลานี้หรือไม่?"
      : "Do you want to create this date?",
    confirmTextUpdate: isTH
      ? "คุณต้องการอัปเดตช่วงเวลานี้หรือไม่?"
      : "Do you want to update this date?",
    confirmTextConfirm: isTH ? "ยืนยัน" : "Confirm",
    confirmTextCancel: isTH ? "ยกเลิก" : "Cancel",

    // Alert
    updateTitle: isTH ? "อัปเดต" : "Update",
    createTitle: isTH ? "สร้าง" : "Create",
    updatedTitle: isTH ? "อัปเดตสำเร็จ!" : "Updated!",
    updatedText: isTH ? "อัปเดตช่วงเวลาเรียบร้อยแล้ว" : "Date updated successfully",

    createdTitle: isTH ? "สร้างเรียบร้อย!" : "Created!",
    createdText: isTH ? "สร้างช่วงเวลาเรียบร้อยแล้ว" : "Date created successfully",

    deletedTitle: isTH ? "ลบเรียบร้อย!" : "Deleted!",
    deletedText: isTH ? "ลบช่วงเวลาเรียบร้อยแล้ว" : "Date deleted successfully",

    errorTitle: isTH ? "เกิดข้อผิดพลาด!" : "Error!",
    errorTextSave: isTH ? "เกิดข้อผิดพลาดขณะบันทึกข้อมูล" : "Something went wrong.",
    errorTextDelete: isTH ? "ไม่สามารถลบได้" : "Failed to delete.",

    // Delete Confirm
    deleteConfirmTitle: isTH ? "ยืนยันการลบ" : "Confirm Delete",
    deleteConfirmText: isTH
      ? "คุณแน่ใจหรือไม่ว่าต้องการลบช่วงเวลานี้?"
      : "Are you sure you want to delete this date?",
    deleteConfirmButton: isTH ? "ลบ" : "Delete",

    no: isTH ? "ลําดับ" : "No.",
    name: isTH ? "ชื่อ" : "Name",
    status: isTH ? "สถานะ" : "Status",
    action: isTH ? "การดําเนินการ" : "Action",
    edit: isTH ? "แก้ไข" : "Edit",
    editDate: isTH ? "แก้ไขช่วงเวลา" : "Edit Date",
    fillIn: isTH ? "กรอกข้อมูลให้ครบ" : "Fill in the date details below",
    upIn: isTH ? "อัปเดตช่วงเวลา" : "Update the date details below",
    dateName: isTH ? "ชื่อช่วงเวลา" : "Date Name",
    startDate: isTH ? "วันเริ่มต้น" : "Start Date",
    endDate: isTH ? "วันสิ้นสุด" : "End Date",
    selectDays: isTH ? "เลือกวัน" : "Select Days",
    allDay: isTH ? "ทุกวัน" : "All Day",
    enterDate: isTH ? "กรอกชื่อช่วงเวลา" : "Enter Date Name",
    search: isTH ? "ค้นหาช่วงเวลา" : "Search Date",
  };
}

export function getTextTimes({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "จัดการช่วงเวลา" : "Times",
    Subtitle: isTH ? "ดูแลและจัดการช่วงเวลา" : "View and manage time information",
    add: isTH ? "เพิ่มช่วงเวลาใหม่" : "Add New Time",
    editTime: isTH ? "แก้ไขช่วงเวลา" : "Edit Time",
    delete: isTH ? "ลบช่วงเวลา" : "Delete Time",
    btnAdd: isTH ? "เพิ่มช่วงเวลา" : "Add Time",
    btnCancle: isTH ? "ยกเลิก" : "Cancel",
    btnUp: isTH ? "อัปเดตเวลา" : "Update Time",
    btnAddSlot: isTH ? "เพิ่มในช่วงเวลา" : "Add In Slot",


    //table
    no: isTH ? "ลําดับ" : "No.",
    name: isTH ? "ชื่อช่วงเวลา" : "Time Name",
    schedule: isTH ? "ตารางเดินรถ" : "Schedule",
    action: isTH ? "การดําเนินการ" : "Action",

    fillIn: isTH ? "กรอกข้อมูลให้ครบ" : "Fill in the date details below",
    upIn: isTH ? "อัปเดตช่วงเวลา" : "Update the date details below",
    selectTime: isTH ? "เลือกเวลา" : "Select Time",
    timeSlot: isTH ? "ช่วงเวลา" : "Time Slot",
    search: isTH ? "ค้นหาช่วงเวลา" : "Search Time",
    noSlot: isTH ? "ไม่มีช่วงเวลา" : "No time slots added yet.",
    enterName: isTH ? "กรอกชื่อช่วงเวลา" : "Enter Time Name",

    confirmUpdateTitle: isTH ? "ยืนยันการแก้ไข" : "Confirm Update",
    confirmCreateTitle: isTH ? "ยืนยันการสร้าง" : "Confirm Create",
    confirmUpdateText: isTH ? "คุณต้องการแก้ไขเวลานี้ใช่หรือไม่?" : "Do you want to update this time?",
    confirmCreateText: isTH ? "คุณต้องการสร้างเวลานี้ใช่หรือไม่?" : "Do you want to create this time?",
    confirmTextUpdate: isTH ? "อัปเดต" : "Update",
    confirmTextCreate: isTH ? "สร้าง" : "Create",

    updatedTitle: isTH ? "อัปเดตแล้ว!" : "Updated!",
    updatedText: isTH ? "อัปเดตเวลาเรียบร้อยแล้ว" : "Time updated successfully",

    createdTitle: isTH ? "สร้างแล้ว!" : "Created!",
    createdText: isTH ? "สร้างเวลาเรียบร้อยแล้ว" : "Time created successfully",

    errorTitle: isTH ? "เกิดข้อผิดพลาด!" : "Error!",
    errorText: isTH ? "เกิดข้อผิดพลาดบางอย่าง" : "Something went wrong.",

    confirmDeleteTitle: isTH ? "ยืนยันการลบ" : "Confirm Delete",
    confirmDeleteText: isTH ? "คุณแน่ใจหรือไม่ว่าต้องการลบเวลา?" : "Are you sure you want to delete this time?",
    deleteConfirmText: isTH ? "ลบ" : "Delete",

    deletedTitle: isTH ? "ลบแล้ว!" : "Deleted!",
    deletedText: isTH ? "ลบเวลาเรียบร้อยแล้ว" : "Time deleted successfully",

    deleteFailText: isTH ? "ลบไม่สำเร็จ" : "Failed to delete.",
  }
}

export function getTextDashboard({ isTH }: { isTH: boolean }) {
  return {
    title: isTH ? "แดชบอร์ด" : "Dashboard",
    subtitle: isTH ? "แดชบอร์ดวันนี้ข้อมูลการโอนเงินและสถิติ" : "DashbToday's overview of transactions and statisticsoard",
    totalPassenger: isTH ? "จํานวนผู้โดยสาร" : "Total Passenger",
    totalRevenue: isTH ? "รายได้ทั้งหมด" : "Total Revenue",
    activeRoute: isTH ? "เส้นทางที่เปิดใช้งาน" : "Active Route",
    trans: isTH ? "วิธีการชำระเงิน" : "Transactions by Payment Method",
    revenueByRoute: isTH ? "รายได้ตามเส้นทาง" : "Revenue by Route",
    cash: isTH ? "เงินสด" : "Cash",
    qr: isTH ? "QR Code" : "QR Code",
    amount: isTH ? "รายได้ (฿)" : "Amount (฿)",
    passenger: isTH ? "ผู้โดยสาร" : "Passenger",  

    filters: isTH ? "ตัวกรอง:" : "Filters:",
    all: isTH ? "ทั้งหมด" : "All",
    today: isTH ? "วันนี้" : "Today",
    thisWeek: isTH ? "สัปดาห์นี้" : "This Week",
    thisMonth: isTH ? "เดือนนี้" : "This Month",
    thisYear: isTH ? "ปีนี้" : "This Year",
    custom: isTH ? "กําหนดเอง" : "Custom",
  }
}


export { useLanguageContext };
