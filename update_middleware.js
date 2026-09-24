const fs = require('fs');

let content = `import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isProtected = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard') || 
                      ['/orders', '/products', '/inventory', '/customers', '/brands', '/categories', '/promotions', '/reviews', '/staff', '/settings'].some(p => request.nextUrl.pathname.startsWith(p))
  const isUnauthorizedRoute = request.nextUrl.pathname === '/unauthorized'

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isProtected) {
    // 1. User is logged in, but are they an ADMIN?
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const isAdmin = roleData?.role === 'admin' || roleData?.role === 'manager';

    if (!isAdmin) {
      // Boot them to unauthorized page if they try to access the dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  // If user is an admin and tries to go to login or unauthorized page, redirect them to dashboard
  if (user && (isAuthRoute || isUnauthorizedRoute)) {
    // Verify they are an admin first
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
      
    if (roleData?.role === 'admin' || roleData?.role === 'manager') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
`;

fs.writeFileSync('admin/utils/supabase/middleware.ts', content, 'utf8');
