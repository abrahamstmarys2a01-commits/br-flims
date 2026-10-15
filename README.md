# BR Films — Tamil Film Distribution Platform & Standalone Admin CMS

A production-grade, three-tier architecture built for **BR Films**, an established Tamil film distribution company based in Chennai, Tamil Nadu.

The project is split into **two independent frontend deployment packages** (`client/` for the public theatrical showcase, `admin/` for the administrative CMS portal) and a **production REST API engine** (`server/`), enabling isolated hosting on custom subdomains (e.g., `brfilms.in` and `admin.brfilms.in`) without shared bundle dependencies or cross-origin security compromises.

---

## 1. System Architecture

```
d:\MediaWaveTech\BR Films\
├── server\                       # Production Node.js + Express + TypeScript REST API
│   ├── src\
│   │   ├── config\               # DB (MongoDB Atlas / in-memory fallback), CORS origins, ENV, Swagger
│   │   ├── models\               # AdminUser, Movie, Enquiry, SiteSetting, WebsitePage, AuditLog
│   │   ├── validations\          # Zod validation schemas
│   │   ├── middlewares\          # Auth (JWT Bearer / HttpOnly Cookie), Roles, RateLimiters, Uploads
│   │   ├── services\             # Cloudinary/Local Upload, Email notification, Audit logging
│   │   ├── controllers\          # Movies, Enquiries, Settings, Pages, Auth, Admin, Uploads
│   │   ├── routes\               # Versioned REST endpoints (/api/v1)
│   │   ├── seed\                 # Idempotent DB seeder (Lenin Pandiyan, Train, Superadmin)
│   │   └── server.ts             # Express server & lifecycle
│   └── tests\                    # Automated integration test suite (Vitest + Supertest, 11/11 tests)
│
├── client\                       # Public Theatrical Website (Vite + React + TypeScript)
│   ├── public\                   # Official BR Films gold emblem logo
│   └── src\
│       ├── api\                  # Public API client (movies, enquiries, settings, pages)
│       ├── components\           # Navbar, Footer, MovieCard, Lightbox, SEO Head
│       ├── pages\public\         # Home, Movies, MovieDetails, Upcoming, Released, Services, About, Enquiry, Contact, Privacy, Terms, NotFound
│       └── App.tsx               # Public routes + automatic external redirect to Admin CMS
│
├── admin\                        # Standalone Admin CMS Portal (Vite + React + TypeScript)
│   ├── public\                   # Official logo
│   └── src\
│       ├── api\                  # Admin API client with JWT bearer & credentials
│       ├── contexts\             # AuthContext (Superadmin/Editor session lifecycle)
│       ├── components\layout\    # AdminLayout (collapsible navigation & session monitor)
│       ├── pages\                # Login, ForgotPassword, ResetPassword, Dashboard, MovieList, MovieEditor, EnquiryList, CompanyProfile, WebsiteContent, SocialMedia, SeoSettings, AdminUsers, AuditLogs
│       └── App.tsx               # Isolated CMS routes (e.g. /dashboard, /movies, /enquiries)
│
└── uploads\                      # Persistent media storage (posters, banners, certificates)
```

---

## 2. Ports & Local Development

| Service | Local URL | Port | Notes |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `http://localhost:5000` | 5000 | Swagger Docs at `/api/docs`, API Base at `/api/v1` |
| **Public Website** | `http://localhost:5173` | 5173 | Public audience, SEO meta tags, Enquiry form |
| **Admin CMS Portal** | `http://localhost:5174` | 5174 | Protected management portal, catalogue CRUD |

### Quick Start Commands

```bash
# 1. Install all dependencies across server, client, and admin
npm run install:all

# 2. Seed database with superadmin and official movies (Lenin Pandiyan & Train)
npm run seed

# 3. Run individual services
npm run dev:server    # Backend API on port 5000
npm run dev:client    # Public Website on port 5173
npm run dev:admin     # Standalone Admin CMS on port 5174

# 4. Build all three services for production
npm run build:all
```

---

## 3. Production Hosting & Deployment Guide

Each application can be deployed independently to your preferred cloud provider (Vercel, Netlify, Cloudflare Pages, Render, Railway, AWS, or VPS).

### A. Deploy Public Website (`client/`)
- **Suggested Domain**: `https://brfilms.in`
- **Hosting**: Vercel / Netlify / Cloudflare Pages
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```env
  VITE_API_BASE_URL=https://api.brfilms.in/api/v1
  VITE_ADMIN_URL=https://admin.brfilms.in
  ```

### B. Deploy Standalone Admin CMS (`admin/`)
- **Suggested Domain**: `https://admin.brfilms.in`
- **Hosting**: Separate Vercel / Netlify project
- **Root Directory**: `admin`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```env
  VITE_API_BASE_URL=https://api.brfilms.in/api/v1
  VITE_CLIENT_URL=https://brfilms.in
  ```

### C. Deploy Backend REST API (`server/`)
- **Suggested Domain**: `https://api.brfilms.in`
- **Hosting**: Render / Railway / DigitalOcean / AWS EC2
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=5000
  CLIENT_URL=https://brfilms.in
  ADMIN_URL=https://admin.brfilms.in
  ALLOWED_ORIGINS=https://brfilms.in,https://admin.brfilms.in
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/brfilms?retryWrites=true&w=majority
  JWT_SECRET=<generate_a_secure_256bit_random_key>
  JWT_EXPIRES_IN=7d
  COOKIE_SECRET=<generate_a_secure_random_key>

  # Optional Cloudinary (for persistent cloud media assets)
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=

  # Optional SMTP (for instant business enquiry emails)
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=
  NOTIFY_EMAIL=contact@brfilms.in
  ```

---

## 4. Default Administrator Credentials

- **Admin Login Portal**: `http://localhost:5174/login` (Local) or `https://admin.brfilms.in/login` (Production)
- **Email**: `admin@brfilms.in`
- **Password**: `Admin@BRFilms2026`
- **Role**: `superadmin`

To create or reset the administrator account from CLI at any time:
```bash
npm run seed:admin
```

---

## 5. Security & Cross-Origin Configuration

1. **CORS Whitelist**: `server/src/config/env.ts` and `server/src/server.ts` automatically accept requests from both `CLIENT_URL` and `ADMIN_URL`, plus comma-separated domains defined in `ALLOWED_ORIGINS`.
2. **Double-Layer Authentication**: Admin endpoints accept both standard `Authorization: Bearer <token>` HTTP headers and secure `HttpOnly` sameSite cookies, preventing XSS token hijacking while allowing cross-subdomain API calls.
3. **Draft Isolation**: Public API routes strictly query `publicationStatus: "Published"`, preventing unreleased or draft theatrical records from being visible on the public site until explicitly published in CMS.
4. **Rate Limiting**: Public enquiry forms and login endpoints are safeguarded by dedicated IP-based rate limiters.
5. **Audit Logging**: Every administrative action (login, movie creation, edit, deletion, status update, media upload) is persisted with actor email, IP address, and timestamp in the `AuditLog` collection.

---

## 6. Automated Testing

Run the full integration test suite covering public movie filtering, enquiry submission with reference code generation, draft isolation, role permissions, and site settings:
```bash
npm run test:server
```
*(All 11 tests pass with 100% success).*
