import { useEffect } from "react";
import { useRouter } from "next/navigation"; // หรือ "next/router" ขึ้นกับเวอร์ชัน next.js

export function useAuthGuard({
    account_role,
    roleMenu,
    pathname,
    allMenu,
}: {
    account_role: number | undefined;
    roleMenu: number[];
    pathname: string;
    allMenu: any[];
}) {
    const router = useRouter();

    useEffect(() => {
        if (!account_role) {
            router.replace("/");
            return;
        }

        if (!roleMenu || roleMenu.length === 0) {
            return;
        }

        const currentPath = pathname.replace(/^\/bu\//, "").split("/")[0];
        const allowedLinks = allMenu
            .flatMap((group) => group.items)
            .filter((item) => roleMenu.includes(item.id))
            .map((item) => item.link);

        if (currentPath && !allowedLinks.includes(currentPath)) {
            if (account_role === 2) {
                router.replace("/bu/dashboard");
            } else if (account_role === 1) {
                router.replace("/bu/dashboard");
            }
        }
    }, [account_role, roleMenu, pathname, allMenu, router]);
}