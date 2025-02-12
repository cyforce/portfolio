import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // console.log("Token:", token); // Ajoutez ce log pour le débogage

    // Vérifie si l'utilisateur est connecté
    if (!token && req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
        console.log("Redirection vers /admin/login"); // Ajoutez ce log pour le débogage
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Applique ce middleware uniquement aux routes commençant par "/admin/"
export const config = {
    matcher: "/admin/:path*",
};
