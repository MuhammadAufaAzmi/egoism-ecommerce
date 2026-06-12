const fs = require('fs');

const files = [
  'src/app/api/admin/promo/route.ts',
  'src/app/api/admin/shipping/route.ts',
  'src/app/api/auth/google/callback/route.ts',
  'src/app/api/auth/logout/route.ts',
  'src/app/api/cart/count/route.ts',
  'src/app/api/payment-proof/route.ts',
  'src/app/api/upload/route.ts',
  'src/app/keranjang/page.tsx',
  'src/app/wishlist/page.tsx',
  'src/lib/account.ts',
  'src/lib/admin-products.ts',
  'src/lib/admin.ts',
  'src/lib/checkout.ts',
  'src/lib/reviews.ts',
  'src/lib/wishlist.ts'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  if (content.includes('cookieStore.get("user_id")') || content.includes('cookieStore.get("user_role")') || f.includes('logout')) {
    if (!content.includes('getSession')) {
      content = 'import { getSession, clearSession, createSession } from "@/lib/session";\n' + content;
    }
    content = content.replace(/const cookieStore = await cookies\(\);\s*const userId = cookieStore\.get\("user_id"\)\?\.value;/g, 'const session = await getSession();\n  const userId = session?.userId;');
    content = content.replace(/cookieStore\.get\("user_id"\)\?\.value/g, '(await getSession())?.userId');
    content = content.replace(/cookieStore\.get\("user_role"\)\?\.value/g, '(await getSession())?.role');
    
    if (f.includes('logout/route.ts')) {
      content = content.replace(/cookieStore\.set\("user_id"[\s\S]*?\n\s*\}\);/g, '');
      content = content.replace(/cookieStore\.set\("user_role"[\s\S]*?\n\s*\}\);/g, '');
      content = content.replace(/cookieStore\.delete\("user_id"\);/g, '');
      content = content.replace(/cookieStore\.delete\("user_role"\);/g, '');
      content = content.replace(/const cookieStore = await cookies\(\);/, 'await clearSession();');
    }

    if (f.includes('google/callback/route.ts')) {
        content = content.replace(/cookieStore\.set\("user_id"[\s\S]*?\n\s*\}\);/g, '');
        content = content.replace(/cookieStore\.set\("user_role"[\s\S]*?\n\s*\}\);/g, '');
        content = content.replace(/return NextResponse\.redirect/g, 'await createSession(user.id, user.role);\n    return NextResponse.redirect');
    }

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
});
