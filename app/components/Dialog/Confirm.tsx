'use client'

import Swal from 'sweetalert2'

type ConfirmProps = {
    title?: string
    text?: string
    confirmText?: string
    cancelText?: string
    type?: string
}

// ใช้เป็นฟังก์ชัน async ที่ return Promise<boolean>
export async function confirmDialog({
    title = "Are you sure?",
    text = "This action cannot be undone.",
    confirmText = "Yes",
    cancelText = "Cancel",
}: ConfirmProps): Promise<boolean> {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        customClass: {
            confirmButton: 'custom-btn-bg-main custom-border-gray',
            cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded ml-4',
        },
        buttonsStyling: false, // ต้องปิด styling เดิมของ Swal ถึงจะใช้ customClass ได้
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
    })

    return result.isConfirmed
}
