import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === '/bu/manage-admin') {
    url.pathname = '/bu/manage-members'; // rewrite ไป path จริง
    return NextResponse.rewrite(url);
  }

  if (url.pathname === '/bu/manage-employee') {
    url.pathname = '/bu/manage-members'; // ใช้หน้าเดียวกัน
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bu/manage-admin', '/bu/manage-employee'],
};
