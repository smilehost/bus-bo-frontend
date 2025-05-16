// src/app/components/Dialog/ConfirmWithInput.ts
import Swal from 'sweetalert2';

export const ConfirmWithInput = async ({
    title,
    text,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    placeholder = '',
    defaultValue = ''
}: {
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    placeholder?: string;
    defaultValue?: string;
}): Promise<string | null> => {
    const result = await Swal.fire({
        title,
        text,
        input: 'text',
        inputPlaceholder: placeholder,
        inputValue: defaultValue, // ✅ ใส่ default value ที่นี่
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            confirmButton: 'custom-btn-bg-main custom-border-gray',
            cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded ml-4',
        },
        inputValidator: (value) => {
            if (!value) return 'Please enter a value';
            return null;
        }
    });

    return result.isConfirmed ? result.value : null;
};