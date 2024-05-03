import { getCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'

// admin route
// const isAdminRoute = (pathname: string) => {
// 	return pathname.startsWith('/admin')
// }

// user route
const isUserProfileRoute = (pathname: string) => {
	return pathname.startsWith('/profile')
}

//book view route
// const isBookRoute = (pathname: string) => {
// 	return pathname.startsWith('/book/bookid/:path*')
// }

//apply middleware
export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	//retrive user token and role
	const isLoginUser = getCookie('token', { req, res })
	// const isUserRole = getCookie('role', { req, res })

	const { pathname } = req.nextUrl
	if (!isLoginUser && isUserProfileRoute(pathname)) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	// validate user role or path name
	// if (isUserRoute(pathname) && isUserRole !== 'user') {
	// 	return NextResponse.redirect(new URL('/not-found', req.url))
	// }
	// if (isAdminRoute(pathname) && isUserRole !== 'admin') {
	// 	return NextResponse.redirect(new URL('/not-found', req.url))
	// }
}

// export const config = {
// 	matcher: ['/user/:path*', '/admin/:path*', '/book/bookid/:path*', '/cart'],
// }

export const config = {
	matcher: ['/profile/:path'],
}
