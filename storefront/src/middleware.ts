import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Si ya tiene el canal, continuar
	if (pathname.startsWith("/default-channel")) {
		return NextResponse.next();
	}

	// Ignorar rutas de sistema y archivos
	if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
		return NextResponse.next();
	}

	// Rewrite transparente: Sirve el contenido de /default-channel pero mantiene la URL limpia
	return NextResponse.rewrite(new URL(`/default-channel${pathname}`, request.url));
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
