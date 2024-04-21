import { NextRequest, NextResponse } from "next/server";

interface cookie {
    name: string;
    value: string;
}


export function middleware(req: NextRequest) {
    const token: any = req.cookies.get('token')?.valueOf()
    // console.log(token.value)

    return NextResponse.next()
}

export const config = {
    matcher: "/profile",
}