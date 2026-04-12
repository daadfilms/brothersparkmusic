# 🎵 Music Artist Website

A professional, dark-themed website for independent musicians to **sell music** and **manage fan memberships** directly — no middleman.

---

## ✅ Completed Features

### 🏠 Hero Section
- Animated vinyl record with spinning animation
- Equalizer bars animation
- Hero stats (Fans / Albums / Tracks) — customizable
- Call-to-action buttons linking to Music Store and Memberships
- Floating particle background animation

### 🎵 Music Player Bar
- Sticky demo audio player (simulated playback)
- Play/pause, skip, volume controls
- Progress bar with click-to-seek
- "Buy Track" quick link

### 🛒 Music Store
- Products loaded dynamically from `music_products` database table
- Filter tabs: All / Albums / Singles / Bundles
- Album art placeholders with gradient designs
- Add-to-cart functionality
- Product badges (Album, Single, Bundle, Featured)

### 🛒 Shopping Cart
- Slide-out cart drawer
- Add/remove items
- Running total
- Checkout button (ready to connect to Stripe or PayPal)

### 👑 Membership Tiers (3 tiers)
- **Fan** — $4.99/mo · $49.99/yr
- **Superfan** — $9.99/mo · $99.99/yr ⭐ Most Popular
- **Inner Circle** — $24.99/mo · $249.99/yr
- Monthly/Yearly billing toggle with savings indicator
- Membership sign-up modal — saves to `subscribers` table
- Trust bar: Secure Checkout, Cancel Anytime, 30-Day Guarantee

### 👤 About Section
- Artist bio with placeholder image
- Highlight cards (Self-Produced, Fan-Funded, Global Community)
- Social media links (Instagram, X, YouTube, Spotify, TikTok)

### 💬 Testimonials
- 3 fan quote cards
- Star ratings

### 📧 Newsletter / Contact
- Email subscription form saved to `subscribers` table
- Membership interest selection
- Social media / contact links

### 🔧 Technical
- Mobile-responsive across all screen sizes
- Hamburger mobile navigation
- Smooth scroll animations (Intersection Observer)
- Toast notifications for user feedback
- ESC key closes modals/drawers

---

## 📁 Project Structure

```
index.html          # Main page (single-page)
css/
  style.css         # Full stylesheet (dark music theme)
js/
  app.js            # All JavaScript (data loading, cart, modals)
README.md
```

---

## 🗄️ Data Tables

### `music_products`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique ID |
| title | text | Album/track title |
| artist | text | Artist name |
| type | text | album / single / bundle |
| price | number | Price in USD |
| description | rich_text | Product description |
| track_count | number | Number of tracks |
| genre | text | Music genre |
| release_year | number | Year of release |
| featured | bool | Show as featured |

### `memberships`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique ID |
| name | text | Tier name |
| price_monthly | number | Monthly price |
| price_yearly | number | Yearly price |
| description | text | Short description |
| features | array | List of included features |
| is_popular | bool | Mark as most popular |
| color_accent | text | Hex color for card |

### `subscribers`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique ID |
| email | text | Email address |
| name | text | Subscriber name |
| membership_tier | text | Interested tier |
| subscribed_at | datetime | Signup date |

---

## 🔗 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `tables/music_products` | Load store products |
| GET | `tables/memberships` | Load membership tiers |
| POST | `tables/subscribers` | Save subscriber/member signup |

---

## 🎨 Customization Guide

| What to Change | Where |
|---------------|-------|
| Artist name | Search "YourArtistName" / "Your Artist Name" in `index.html` |
| Artist photo | Replace `about-img-placeholder` with `<img>` tag |
| Social links | Update `href="#"` in About and Footer sections |
| Contact email | Find `hello@yourartistname.com` in `index.html` |
| Products/prices | Edit via `music_products` table |
| Membership tiers | Edit via `memberships` table |
| Hero stats | Find `hero-stats` section in `index.html` |
| Color scheme | Edit CSS variables in `css/style.css` `:root` block |
| Real payments | Connect Stripe.js or PayPal SDK to checkout button |
| Real audio | Add `<audio>` element and wire to player controls in `js/app.js` |

---

## 🚀 Next Steps

1. **Replace placeholder content** — artist name, bio, photo, social links
2. **Upload real album art** — replace gradient placeholder cards
3. **Connect payment processor** — Stripe.js or PayPal for real checkout
4. **Add real audio previews** — connect `<audio>` to the player bar
5. **Add more pages** — Tour dates, merch store, press kit
6. **Custom domain** — publish and set your domain name
7. **Email marketing** — connect Mailchimp/ConvertKit to subscriber form
8. **Analytics** — add Google Analytics or Plausible

---

## 📦 Tech Stack

- Pure HTML5, CSS3, JavaScript (no frameworks)
- Google Fonts: Inter + Playfair Display
- Font Awesome 6.4 icons
- RESTful Table API for data storage
