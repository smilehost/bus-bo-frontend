export const getAccountRoleId = (): number | null => {
    if (typeof window === 'undefined') return null; // 👈 ป้องกัน SSR

    try {
        const raw = localStorage.getItem("token_bo"); // เปลี่ยนชื่อ key ตามจริง
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.state?.account_role ?? null;
    } catch (err) {
        console.error("Failed to parse account_role_id from localStorage", err);
        return null;
    }
};