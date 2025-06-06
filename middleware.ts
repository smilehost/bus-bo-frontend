import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  console.log("===========================================", url.pathname);

  if (url.pathname === '/bu/manage-admin') {
    url.pathname = '/bu/manage-members'; // rewrite ไป path จริง
    console.log("===========================================2", url.pathname);
    return NextResponse.rewrite(url);
  }

  if (url.pathname === '/bu/manage-employee') {
    // แค่ log ไม่ rewrite
    console.log("===========================================3", url.pathname);
    console.log("===========================================4", url);
    return NextResponse.next(); // ให้ผ่านต่อไปที่ /bu/manage-employee ตามปกติ
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bu/manage-admin', '/bu/manage-employee'],
};
