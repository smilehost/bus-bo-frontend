'use client'

import Swal from "sweetalert2"

type AlertProps = {
    title?: string
    text?: string
    confirmText?: string
    type?: 'success' | 'error' | 'warning' | 'info' | 'question'
}

export async function Alert({
    title = "",
    text = "",
    confirmText = "OK",
    type = "info",
}: AlertProps): Promise<boolean> {
    return Swal.fire({
        title,
        text,
        icon: type,
        confirmButtonText: confirmText,
        customClass: {
            confirmButton: 'custom-btn-bg-main custom-border-gray'
        }
    }).then((result) => result.isConfirmed)
}
