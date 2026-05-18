# EGOISM — Next.js E-Commerce Project

Luxury minimalist fashion e-commerce built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (custom design system)
- **Language**: TypeScript
- **Fonts**: Playfair Display + Inter (via `next/font/google`)
- **Icons**: Material Symbols Outlined

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Homepage
│   ├── men/page.tsx        # Men's collection
│   ├── women/page.tsx      # Women's collection
│   ├── koleksi/page.tsx    # All collections
│   ├── produk/[slug]/      # Dynamic product detail
│   ├── keranjang/page.tsx  # Shopping cart
│   ├── login/page.tsx      # Login page
│   ├── kontak/page.tsx     # Contact page
│   ├── shipping-info/      # Shipping info
│   └── return-policy/      # Return policy
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── Footer.tsx      # Site footer
│   └── ui/
│       └── ProductCard.tsx # Reusable product card
├── lib/
│   └── products.ts         # Product data + helpers
├── styles/
│   └── globals.css
└── types/
    └── index.ts
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages & Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/men` | Men's Collection |
| `/women` | Women's Collection |
| `/koleksi` | All Collections |
| `/produk/[slug]` | Product Detail |
| `/keranjang` | Shopping Cart |
| `/login` | Login |
| `/kontak` | Contact |
| `/shipping-info` | Shipping Info |
| `/return-policy` | Return Policy |

## Next Steps (Recommended)

1. **Backend/CMS** — Connect to Sanity, Contentful, or Supabase for real product data
2. **Auth** — Add NextAuth.js for login/register
3. **Cart State** — Use Zustand or Context API for global cart management
4. **Payments** — Integrate Midtrans or Xendit for Indonesian payments
5. **Search** — Add Algolia or built-in search
6. **Image Optimization** — Upload product images to Cloudinary or Supabase Storage
