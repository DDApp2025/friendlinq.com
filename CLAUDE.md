# Friendlinq.com SEO Audit Report

**Audit Date:** April 3, 2026
**Auditor:** Claude Code (Session 1 - Section 1)
**Project:** C:\Projects\friendlinq.com (WEBSITE - React, GitHub Pages)
**Repository:** DDApp2025/friendlinq.com

---

## 1. Project Structure

### 1.1 Framework & Build System
- **Framework:** React 19.2.4 (Create React App via react-scripts 5.0.1)
- **Router:** react-router-dom 7.13.2 — **BrowserRouter** (path-based, NOT hash-based)
- **State Management:** Redux + Redux Persist + Redux Thunk
- **Build System:** Create React App (CRA) standard — `react-scripts build`
- **Build Output:** `/build/` directory (standard CRA output)
- **Package Manager:** npm (package-lock.json present)

### 1.2 Top-Level Directory Contents
```
build/              — Production build output (deployed to GitHub Pages)
node_modules/       — Dependencies
public/             — Static assets (CRA public folder)
src/                — Source code
package.json        — React dependencies, scripts, homepage field
package-lock.json
README.md
```
Also present: Strategy documents (.docx) and temp files (~$...)

### 1.3 Key Dependencies
- **@stripe/react-stripe-js, @stripe/stripe-js** — Stripe payments
- **agora-rtc-sdk-ng** — Agora WebRTC for video calls and live streaming
- **axios** — HTTP client for API calls
- **socket.io-client** — Real-time messaging
- **lucide-react, react-icons** — Icon libraries
- **date-fns** — Date formatting
- **gh-pages** (devDep) — GitHub Pages deployment

### 1.4 GitHub Pages Configuration
- **`homepage` in package.json:** `"https://friendlinq.com"`
- **CNAME file:** `public/CNAME` contains `friendlinq.com`
- **Deploy script:** `"deploy": "gh-pages -d build"` — deploys `/build/` folder
- **No .github/workflows/** — No CI/CD pipeline; deployment is manual via `npm run deploy`
- **Branches:** Only `main` branch exists (no separate `gh-pages` branch visible locally — gh-pages npm package creates/pushes it automatically)
- **404.html:** Present in `public/` — implements SPA routing hack for GitHub Pages (redirects all paths to `index.html` via query string encoding)

### 1.5 Source Code Structure
```
src/
  App.js            — Root component with all routes
  App.css           — Default CRA styles (unused)
  index.js          — Entry point
  index.css         — Global styles
  store.js          — Redux store configuration
  logo.svg          — Default CRA logo (unused)
  reportWebVitals.js
  setupTests.js
  actions/          — Redux action creators
  api/              — API configuration (axios instances, socket, webrtc, config)
  components/       — Shared components
    layout/         — AppLayout, TopNav, BottomNav, Sidebar
    posts/          — PostCard
    ProtectedRoute.js
    PublicRoute.js
    IncomingCallOverlay.js
  pages/            — All page components (31 files)
  reducers/         — Redux reducers
  utils/            — Utility functions (normalizeImg)
```

---

## 2. Routes & Pages — Complete Inventory

### 2.1 Public Routes (No Authentication Required)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | Login.js | Email/password login with "Remember Me" and logo |
| `/register` | SignUpCommon.js | New account registration (name, email, password) |
| `/forgot-password` | ForgotPassword.js | Request password reset OTP via email |
| `/verify-otp` | VerifyOtp.js | Enter email + OTP to verify identity |
| `/reset-password` | ResetPassword.js | Set new password after OTP verification |

**Note:** The root path `/` redirects to `/home` which requires auth, so unauthenticated users hitting `/` get redirected to `/login`.

### 2.2 Protected Routes (Authentication Required)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/register/user-type` | ChooseUserType.js | Choose between Social Media or Dating mode |
| `/home` | Home.js | Main feed — post composer, community/friends feed toggle, app store badges, infinite scroll |
| `/photos` | Portfolio.js | Photo & video library — upload, delete, select top 4 profile images |
| `/add-friend` | AddFriend.js | Search users by name, send friend requests |
| `/notifications` | Notifications.js | Notification list with type icons, mark read, delete |
| `/messages` | ChatList.js | Chat conversation list with unread counts |
| `/chat/:userId` | Chat.js | 1-on-1 messaging with Socket.IO real-time, media attachments |
| `/friends` | Friends.js | Friends list with tabs (Friends/Requests/Sent), favorite stars, unfriend |
| `/groups` | Groups.js | Group management — list, create, browse/join, group posts, members |
| `/call` | Call.js | Audio/video calling via Agora WebRTC — friends & group calls |
| `/live/:channelName` | LiveStream.js | Live streaming via Agora — host or viewer mode |
| `/favorites` | Favorites.js | View top 4 favorite friends |
| `/profile` | MyProfile.js | Own profile — banner, avatar, bio, friends count, top friends/photos |
| `/edit-profile` | EditProfile.js | Edit profile info, upload profile pic and banner |
| `/user/:userId` | UserProfile.js | View another user's profile, send/remove friend request |
| `/comments/:postId` | Comments.js | View/add/delete comments on a post |
| `/change-password` | ChangePassword.js | Change password (old + new) |
| `/portfolio` | Portfolio.js | Same as /photos (duplicate route) |
| `/private-portfolio` | PrivatePortfolio.js | Private photo portfolio (own or friend's) |
| `/private-portfolio/:friendId` | PrivatePortfolio.js | View friend's private portfolio |
| `/marketplace` | Marketplace.js | Browse marketplace items with search |
| `/marketplace/:itemId` | MarketplaceDetail.js | Marketplace item detail view |
| `/subscription` | Subscription.js | Stripe-powered subscription plans for Dating mode |
| `/settings` | Settings.js | Email toggle, auto-refresh, dating mode, wallpaper, logout, delete account |
| `/support` | Support.js | FAQ section + contact form (feedback submission) |
| `/choose-tutorial` | Tutorials.js (ChooseTutorial) | Tutorial welcome screen with "Start Tour" button |
| `/tutorials` | Tutorials.js (TutorialViewer) | Step-by-step feature tutorial walkthrough |
| `*` (catch-all) | Redirects to `/home` | Any unmatched auth'd route goes to home |

---

## 3. index.html Analysis (public/index.html)

### 3.1 What Exists
- `<html lang="en">` — Language attribute present
- `<meta charset="utf-8" />` — Character encoding
- `<meta name="viewport" content="width=device-width, initial-scale=1" />` — Responsive viewport
- `<meta name="theme-color" content="#000000" />` — Theme color (BLACK, should be brand green #1a6b3a)
- `<meta name="description" content="Web site created using create-react-app" />` — **DEFAULT CRA DESCRIPTION - CRITICAL SEO PROBLEM**
- `<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />` — Favicon
- `<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />` — Apple touch icon
- `<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />` — Web app manifest
- `<title>FriendLinq</title>` — Title exists but is branded as "FriendLinq" (should be "Friendlinq") and has no keywords
- **SPA routing script** in `<head>` — Decodes GitHub Pages redirect query strings
- **Inline CSS** — spinner animation and basic resets
- `<noscript>You need to enable JavaScript to run this app.</noscript>` — **CRITICAL: This is ALL that crawlers see if they don't execute JS**

### 3.2 What Is MISSING (SEO-Critical)
- **No Open Graph (og:) tags** — No og:title, og:description, og:image, og:url, og:type
- **No Twitter Card tags** — No twitter:card, twitter:title, twitter:description, twitter:image
- **No JSON-LD / Schema.org structured data** — No Organization, WebSite, WebApplication, or any schema
- **No canonical link** — No `<link rel="canonical" />`
- **No robots meta tag** — No `<meta name="robots" />`
- **No keywords meta tag** — Not critical for Google, but useful for other engines
- **No meaningful noscript content** — Only "enable JavaScript" message, no content for crawlers
- **No analytics scripts** — No Google Analytics, GA4, GTM, or any tracking
- **No preconnect/dns-prefetch** hints for API domains

---

## 4. Existing SEO Files

### 4.1 robots.txt (public/robots.txt)
```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
```
**Status:** Exists but is DEFAULT CRA — allows all crawlers but provides no sitemap reference, no specific directives.

### 4.2 sitemap.xml
**Status:** DOES NOT EXIST — No sitemap.xml anywhere in the project.

### 4.3 llms.txt
**Status:** DOES NOT EXIST — No llms.txt for AI/LLM discovery.

### 4.4 CNAME
**Status:** EXISTS — `public/CNAME` contains `friendlinq.com`. Correctly configured for GitHub Pages custom domain.

### 4.5 404.html (public/404.html)
**Status:** EXISTS — Implements the GitHub Pages SPA redirect hack. Converts deep-linked paths into query strings and redirects to `/index.html` so React Router can handle them. No SEO content — just a redirect script.

### 4.6 manifest.json (public/manifest.json)
**Status:** EXISTS but DEFAULT CRA values:
- `"short_name": "React App"` — **Should be "Friendlinq"**
- `"name": "Create React App Sample"` — **Should be "Friendlinq - Social Network for Seniors"**
- `"theme_color": "#000000"` — **Should be #1a6b3a (brand green)**
- Icons reference favicon.ico, logo192.png, logo512.png (these files exist)

---

## 5. App Features & Functionality Deep Dive

### 5.1 Core Features (What the App Actually Does)
1. **Social Feed** — Community (public) and Friends-only post feeds with infinite scroll
2. **Post Creation** — Text, photo, and video posts with privacy controls (Public/Friends Only)
3. **Friend System** — Search users, send/accept/reject requests, unfriend, top 4 favorites
4. **Real-Time Messaging** — 1-on-1 chat with Socket.IO, text + media attachments
5. **Groups** — Create, join, browse groups; group posts and member management
6. **Video/Audio Calls** — 1-on-1 and group calls via Agora WebRTC
7. **Live Streaming** — Host or join live video streams via Agora
8. **Photo/Video Library** — Upload, manage, select profile showcase images/videos
9. **Private Portfolio** — Private photo albums accessible to friends
10. **Marketplace** — Browse and view marketplace listings
11. **Notifications** — Real-time notifications for friend requests, messages, comments, likes, groups, live streams
12. **User Profiles** — Profile with banner, avatar, bio, location, email, top friends, photo library
13. **Dating/Flirting Mode** — Separate feed and profile mode for dating users
14. **Subscription Plans** — Stripe-powered payment for dating/premium features
15. **Tutorials** — 8-step guided tour of all features
16. **Support** — FAQ section + contact/feedback form
17. **Settings** — Email subscriptions, auto-refresh, wallpaper, dating mode toggle, account management

### 5.2 Third-Party Services
- **Agora (dd6dbba5e50d42c7880152591687410d)** — WebRTC video/audio calls and live streaming
- **Stripe (pk_live_51OeCKV...)** — Payment processing for subscriptions
- **Socket.IO** — Real-time messaging via Node.js backend
- **Two Backend APIs:**
  - Node.js API: `https://natural.friendlinq.com` — Posts, chat, portfolio, friends, notifications
  - .NET API: `https://unpokedfolks.com/api` — Auth, groups, marketplace, payments, settings

### 5.3 App Store Presence
- **Apple App Store:** `https://apps.apple.com/us/app/friendlinq/id6476931666`
- **Google Play:** `https://play.google.com/store/apps/details?id=com.app.friendlinq`
- App store badges are displayed on the Home feed page

### 5.4 Target Audience (Based on UI Content)
- The UI itself does **NOT explicitly mention seniors** anywhere visible
- The tagline on login: "Join others finding connections on FriendLinq"
- Choose User Type page describes: Social Media + Dating/Flirting
- The tutorials describe standard social network features
- **There is no landing page, about page, or marketing content describing the senior-focused mission**

### 5.5 Signup/Onboarding Flow
1. `/login` — User sees login form with logo and "Sign Up" button
2. `/register` — Name, email, password registration
3. Auto-login after signup → `/home`
4. (Optional) `/register/user-type` — Choose Social Media vs Dating mode
5. No onboarding wizard, age verification, or senior-specific flow

---

## 6. HTML Structure & Accessibility Analysis

### 6.1 Heading Hierarchy
- **Login:** `<h1>FriendLinq</h1>` — Good, has h1
- **Register:** `<h1>Create Your FriendLinq Account</h1>` — Good
- **ChooseUserType:** `<h1>Choose Your FriendLinq Experience</h1>`, `<h2>` for sections — Good hierarchy
- **ForgotPassword/VerifyOtp/ResetPassword:** `<h1>` in header — Good
- **Home:** No h1 or h2 — **BAD: Main page has no heading structure**
- **Friends/AddFriend:** `<h2>` title only — No h1
- **Groups:** `<h2>` for title — No h1
- **ChatList/Chat:** `<h2>` for title — No h1
- **Notifications:** `<h2>` for title — No h1
- **MyProfile:** `<h2>` for name, `<h3>` for sections — No h1
- **Marketplace:** `<h2>` for title — No h1
- **Subscription:** `<h2>`, `<h3>`, `<h4>` — Reasonable hierarchy but no h1
- **Settings:** `<h2>` for title — No h1
- **Support:** `<h2>`, `<h3>`, `<h4>` — Good hierarchy but no h1
- **Tutorials:** `<h1>Welcome to FriendLinq</h1>` — Good

**Summary:** Most pages lack `<h1>`. Only Login, Register, ChooseUserType, ForgotPassword, VerifyOtp, ResetPassword, and Tutorials have `<h1>` tags.

### 6.2 Semantic HTML
- **No `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` semantic tags** in page components — everything is `<div>` with inline styles
- AppLayout uses `<main>` for the content area — one positive
- BottomNav uses `<nav>` — another positive
- **No `<article>` for posts, no `<section>` for content areas**

### 6.3 ARIA Labels
- Login: Show/hide password button has `aria-label` — Good
- BottomNav: Each tab has `aria-label` and `title` — Good
- Sidebar close button has `aria-label="Close menu"` — Good
- **Most other interactive elements lack ARIA labels**

### 6.4 Images & Alt Text
| Image | Alt Text | Status |
|-------|----------|--------|
| Login logo | `alt="FriendLinq"` | OK (should be "Friendlinq") |
| Home profile pic | `alt="Profile"` | Generic |
| Home media preview | `alt="Preview"` | Generic |
| App Store badge | `alt="Download on the App Store"` | Good |
| Google Play badge | `alt="Get it on Google Play"` | Good |
| MyProfile banner | `alt="Banner"` | Generic |
| MyProfile avatar | `alt="Profile"` | Generic |
| MyProfile friends | `alt={fName}` — uses friend's name | Good |
| MyProfile portfolio | `alt="Portfolio"` | Generic |
| Friends list avatars | `alt={name}` — uses user name | Good |
| Groups images | `alt=""` — empty alt | Bad |
| Chat avatars | `alt={otherName}` | Good |
| Portfolio images | `alt="Portfolio"` / `alt="Video thumb"` | Generic |
| Marketplace images | `alt={item.ad_title \|\| 'Item'}` | OK |
| Tutorial logo | `alt="Logo"` | Generic |

---

## 7. Visual Design

### 7.1 Color Palette
- **Primary brand green:** `#1a6b3a` (used everywhere — buttons, headers, nav, icons, links)
- **Secondary green:** `#4a9e6e` (Sign Up button), `#2ecc71` (gradient)
- **Background:** `#f0f0f0`, `#f0f2f5`, `#ededed`, `#f5f5f5` (light grays)
- **Cards:** `#ffffff` (white)
- **Text:** `#222`, `#333`, `#555`, `#666`, `#888`, `#999` (gray scale)
- **Error/danger:** `#d32f2f`, `red`, `#e74c3c`
- **Dating mode:** `#e84393` (pink)
- **Accent blue:** `#87CEEB` (confirm buttons on password pages)

### 7.2 Typography
- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (system fonts)
- **No Google Fonts or custom fonts loaded**
- Font sizes range from 11px to 24px across pages

### 7.3 Layout Patterns
- **Max width:** 480px for auth pages, 600px for most app pages, 700px for portfolio/marketplace
- **Mobile-first:** Bottom navigation on mobile (<768px), top nav links on desktop (>900px)
- **Responsive breakpoints:** 768px (mobile/tablet), 900px (tablet/desktop)
- **All styling is inline JavaScript objects** — no CSS modules, no Tailwind, minimal external CSS

---

## 8. Critical SEO Issues Summary

### Severity: CRITICAL
1. **No content for non-JS crawlers** — `<noscript>` says only "You need to enable JavaScript to run this app." Search engines and AI bots that don't execute JS see ZERO content.
2. **Default CRA meta description** — "Web site created using create-react-app" is indexed as the site description.
3. **No Open Graph tags** — Social media shares show nothing meaningful.
4. **No structured data (JSON-LD)** — No schema for Organization, WebSite, WebApplication, or any entity.
5. **No sitemap.xml** — Search engines have no URL map.
6. **All pages behind authentication** — Every meaningful page requires login. Crawlers cannot access any content beyond the login screen.

### Severity: HIGH
7. **No landing page / marketing page** — There is NO public page explaining what Friendlinq is, who it's for, or why someone should sign up. The entire site is a login wall.
8. **Brand inconsistency** — "FriendLinq" is used everywhere in code (should be "Friendlinq" per brand rules).
9. **manifest.json uses CRA defaults** — "React App" and "Create React App Sample" instead of brand name.
10. **theme-color is black (#000000)** — Should be brand green (#1a6b3a).
11. **No React Helmet or per-route meta tags** — Every page has the same title "FriendLinq" regardless of route.
12. **robots.txt is bare minimum** — No sitemap directive, no bot-specific rules.

### Severity: MEDIUM
13. **Most pages lack h1 tags** — Only auth pages have proper h1 headings.
14. **No semantic HTML** — All div-based layouts, no article/section/header/footer tags.
15. **No analytics** — No Google Analytics, GA4, or any tracking installed.
16. **Many images have generic alt text** — "Profile", "Banner", "Portfolio" instead of descriptive text.
17. **No canonical URLs** — Risk of duplicate content issues.
18. **No llms.txt** — Missing for AI/LLM discoverability.
19. **No preconnect hints** — Two API domains (natural.friendlinq.com, unpokedfolks.com) could benefit from preconnect.
20. **No blog, FAQ page, or content beyond the app** — The Support page has FAQs but it's behind auth.

### Severity: LOW
21. **ARIA labels are inconsistent** — Some buttons have them, most don't.
22. **App.css contains unused CRA default styles**.
23. **Duplicate route:** `/photos` and `/portfolio` both render the Portfolio component.

---

## 9. Backend API Architecture (For Reference Only — DO NOT MODIFY)

- **Node.js API:** `https://natural.friendlinq.com` — Posts, messaging, portfolio, friends, notifications
- **.NET API:** `https://unpokedfolks.com/api` — Authentication, groups, marketplace, payments, settings
- **Socket.IO:** Connected via the Node.js API for real-time chat
- **Agora:** Used for WebRTC video/audio calls and live streaming
- **Stripe:** Live payment processing for subscription plans
- All API calls use axios with token-based authentication

---

## 10. Deployment Architecture

- **Source code** lives on `main` branch of `DDApp2025/friendlinq.com`
- **`npm run build`** creates production build in `/build/` directory
- **`npm run deploy`** runs `gh-pages -d build` which pushes `/build/` contents to a `gh-pages` branch
- **GitHub Pages** serves from the `gh-pages` branch
- **CNAME** file ensures `friendlinq.com` domain works
- **404.html** handles SPA routing for GitHub Pages (deep links → redirect to index → React Router handles)
- **All SEO files (robots.txt, sitemap.xml, etc.) must go in `/public/`** so CRA copies them to `/build/` during build

---

## Session Log — Section 2: Public Landing Page

**Date:** 2026-04-03

### What was done:
1. **Created `src/pages/LandingPage.js`** — Full landing page matching HTML mockup (topnav with login, hero with signup card, stats bar, features grid, FAQ accordion, CTA, footer). All FAQ answers always in DOM for crawlers (CSS display toggle, not conditional render).
2. **Modified `src/App.js`** — Added `/` route: `<PublicRoute><LandingPage /></PublicRoute>` (logged-in users redirect to `/home`)

### Files changed:
- `src/pages/LandingPage.js` — **NEW**
- `src/App.js` — Added LandingPage import and `/` route

### Build status: PASSES

---

## Session Log — Section 4: Meta Tags, Open Graph & Twitter Cards

**Date:** 2026-04-03

### What was done:
1. **Modified `public/index.html`** — Added all SEO meta tags, Open Graph tags, and Twitter Card tags:
   - Replaced CRA default description with keyword-rich Friendlinq description
   - Added `keywords`, `robots`, `author`, `application-name`, `apple-mobile-web-app-title` meta tags
   - Added `<link rel="canonical">` pointing to `https://friendlinq.com/`
   - Added 10 Open Graph tags (type, url, title, description, image, image dimensions, image alt, site_name, locale)
   - Added 5 Twitter Card tags (card, title, description, image, image:alt)
   - Fixed `theme-color` from `#000000` to `#1a6b3a` (brand green)
   - Fixed `<title>` from "FriendLinq" to "Friendlinq | The Social Network Built for Real Connection"

### Files changed:
- `public/index.html` — Updated with all meta/OG/Twitter tags

### Manual action item for Albert:
- **Create `og-image.jpg`** (1200x630 px) showing the Friendlinq logo and tagline, and place it in `public/` so it deploys to `https://friendlinq.com/og-image.jpg`

### Build status: PASSES

---

## Section Tracking

| Section | Description | Status |
|---------|-------------|--------|
| 0 | Context & Direction | Included |
| 1 | Deep Audit | **COMPLETE** |
| 2 | Public Landing Page | **COMPLETE** |
| 3 | Meta Tags, Open Graph, Twitter Cards | **COMPLETE** (was Section 4 in spec) |
| 4 | JSON-LD Structured Data | Not Started |
| 5 | Semantic HTML, Accessibility, Noscript Fallback | Not Started |
| 6 | React SEO: Dynamic meta tags per route | Not Started |
| 7 | GitHub Pages & Deployment Configuration | Not Started |
| 8 | Image Alt Text + OG Image + Favicon Audit | Not Started |
| 9 | Content Architecture: FAQ + Safety Pages | Not Started |
| 10 | AI Optimization (AIO), llms.txt, Entity Strategy | Not Started |
| 11 | Analytics Setup: GA4, Search Console, Bing | Not Started |
| 12 | Testing, Validation, Deployment Verification | Not Started |
