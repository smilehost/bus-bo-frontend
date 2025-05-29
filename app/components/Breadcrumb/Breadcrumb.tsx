'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Breadcrumb() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const segments = pathname
        .split('/')
        .filter(Boolean)
        .filter((segment) => segment !== 'bu');

    const nameParam = searchParams.get('name');

    if (nameParam) {
        segments.push(decodeURIComponent(nameParam));
    }

    return (
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap">
                {segments.map((segment, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="mx-1 text-gray-400">{'>'}</span>}
                        <div className="text-gray-800 font-semibold cursor-default">
                            {segment}
                        </div>
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;