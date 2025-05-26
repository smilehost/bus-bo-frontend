'use client';

import React from 'react';
// import Link from 'next/link';

type BreadcrumbProps = {
    path: string; 
};

function Breadcrumb({ path }: BreadcrumbProps) {
    const segments = path
        .split('/')
        .filter(Boolean)
        .filter((segment) => segment !== 'bu');

    // const getPath = (index: number) => {
    //     const baseSegments = ['bu', ...segments.slice(0, index + 1)];
    //     return '/' + baseSegments.join('/');
    // };

    return (
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap">
                {segments.map((segment, index) => {
                    // const href = getPath(index);
                    // const isLast = index === segments.length - 1;

                    return (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="mx-1">{`>`}</span>}
                            <div
                                // href={href}
                                className={`text-gray-800 font-semibold cursor-pointer`}
                            >
                                {decodeURIComponent(segment)}
                            </div>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;