// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {

//     console.log("Middleware 2 is running!", request.nextUrl.pathname);

//     // if (request.nextUrl.pathname.startsWith('/about')) {
//     //     return NextResponse.rewrite(new URL('/about-2', request.url))
//     // }

//     // if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     //     return NextResponse.rewrite(new URL('/dashboard/user', request.url))
//     // }

//     import { withAuth } from "next-auth/middleware";

//     export default withAuth({
//         pages: { signIn: "/login" },
//     });

// }

import type { NextRequest } from 'next/server'

import { NextResponse } from "next/server";
import { apiGetProfile } from './api/users';
// import { verify } from "jsonwebtoken";
import axios from "axios";
import { endpoint } from './constants/api';

export async function middleware(req: NextRequest) {
    // console.log(req.url);
    // if (req.nextUrl.pathname.startsWith('/about')) {
    //     const token = req.cookies.get("token");

    //     if (!token) {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }

    //     try {
    //         // verify(token, process.env.JWT_SECRET!);
    //         return NextResponse.next();
    //     } catch (error) {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }
    // }

    const userId = req.cookies.get("authToken");
    // const userId = localStorage.getItem('authToken');
    console.log("link:", req.nextUrl.pathname);
    console.log("userId:", userId);

    const excludedPaths = ['/auth/auth1/login', '/_next/', '/sw.js', '/images'];
    if (excludedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }
    const response = await axios.get(endpoint + "/users/me", {
        headers: {
            Authorization: `Bearer ${userId?.value}`,
        },
    }).catch((res) => {
        return res;
    });
    console.log(response.status);
    if (response.status == 200) {
    } else {
        console.log("vô đây");
        return NextResponse.redirect(
            new URL("/auth/auth1/login", req.nextUrl.origin).href
        );
    }
    // if (!userId) {

    // }

    if (req.nextUrl.pathname == '/') {

    }

    return NextResponse.next();
}

// Áp dụng middleware cho tất cả các trang trừ trang login
export const config = {
    matcher: '/((?!auth/auth1/login).*)', // Áp dụng cho tất cả trang ngoại trừ /auth/auth1/login
};