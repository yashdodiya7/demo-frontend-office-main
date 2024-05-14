import { getCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'

// admin route
// const isAdminRoute = (pathname: string) => {
// 	return pathname.startsWith('/admin')
// }

const protectedRoutesNotLoggedIn = [
    '/auth/choice',
    '/create-listing',
    '/interested-user-profile',
    '/interested-users',
    '/listprofile',
    '/mydeal',
    '/myinterests',
    '/prefernce',
    '/profile',
    '/subscription',
    '/updatelisting',
    '/verify'
]

const protectedRoutesNotPaid = [
	'/interested-user-profile',
	'/listprofile',
	'/mydeal',
]

const protectedRoutesConfirmedDeal = [
    '/create-listing',
    '/updatelisting',
]

const allProtectedRoutes = [...protectedRoutesNotLoggedIn, ...protectedRoutesNotPaid, ...protectedRoutesConfirmedDeal]

// user route
const isUserProfileRoute = (pathname: string) => {
	return pathname.startsWith('/profile')
}

//apply middleware
export async function middleware(req: NextRequest) {

	const res = NextResponse.next()
	//retrive user token and role
	const isLoginUser = getCookie('token', { req, res })
	const isPaidUser = getCookie('is_paid', { req, res })
	const confirmedDeal = getCookie('confirmed_deal', { req, res })

	const { pathname } = req.nextUrl

	if (!isLoginUser && protectedRoutesNotLoggedIn.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', req.url)) // Redirect to login page
    }

	if (!isPaidUser && protectedRoutesNotPaid.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/subscription', req.url)) // Redirect to login page
    }

	if (confirmedDeal && protectedRoutesConfirmedDeal.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', req.url)) // Redirect to login page
    }

	return NextResponse.next()
}

export const config = {
	matcher: allProtectedRoutes
}
