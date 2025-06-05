'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

function Breadcrumb() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const segments = pathname.split('/').filter(Boolean);
    const nameParam = searchParams.get('name');
    // 👇 ตัด segment แรกออกจากการแสดงผล
    const breadcrumbItems = [...segments.slice(1)];

    // 👇 ถ้า name param มา จะใช้แทน segment สุดท้าย
    if (nameParam) {
        breadcrumbItems[breadcrumbItems.length - 1] = decodeURIComponent(nameParam);
    }

    // 👇 สร้าง href โดยอิงจาก segments เต็ม แต่เริ่มจาก index + 1 เพราะตัด segment แรกออกจาก breadcrumbItems แล้ว
    const buildHref = (index: number) => {
        const path = '/' + segments.slice(0, index + 2).join('/');
        return path;
    };

    return (
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap">
                {breadcrumbItems.map((segment, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="mx-1 text-gray-400">{'>'}</span>}
                        {index < breadcrumbItems.length - 1 ? (
                            <Link
                                href={buildHref(index)}
                                className="hover:underline"
                            >
                                {segment}
                            </Link>
                        ) : (
                            <span className="text-gray-800 ">
                                {segment}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;