"use client";

import Swal from "sweetalert2";

type ConfirmProps = {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "error" | "warning" | "info" | "question";
};

export async function Confirm({
  title = "",
  text = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "question",
}: ConfirmProps): Promise<boolean> {
  return Swal.fire({
    title,
    text,
    icon: type,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: false,
    customClass: {
      confirmButton: "swal2-confirm-btn mx-2 cursor-pointer",
      cancelButton: "swal2-cancel-btn mx-2 cursor-pointer",
    },
    buttonsStyling: false,
  }).then((result) => result.isConfirmed);
}