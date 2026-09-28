# HeritageVR — Explore Today, Preserve Tomorrow

A full-stack web application designed for heritage preservation. HeritageVR allows users to explore endangered historical sites through immersive virtual experiences and transparently fund their real-world restoration via the "Adopt-a-Stone" program.

**Hackathon Prototype Notice:** This project was developed as a hackathon submission.

---

## 🌟 Key Features

1. **Digital Preservation Layer:** Detailed records of endangered heritage sites.
2. **Virtual Exploration:** WebXR/Three.js integrated 3D virtual viewer (with placeholder models for demo).
3. **Then vs Now Comparison:** Interactive slider demonstrating structural deterioration over time.
4. **Adopt-a-Stone Program:** Interactive component adoption system to fund specific architectural restoration (e.g., pillars, walls).
5. **Transparent Fund Tracking:** Live dashboard showing funds raised, allocated, and active projects.
6. **Payment Gateway:** Razorpay integration (Test Mode) + Demo Mode fallback.
7. **Role-based Authentication:** Secure JWT authentication with User and Admin dashboards.

---

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS (Custom Heritage Theme)
- React Router DOM
- React Three Fiber / Drei (3D & VR)
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (SQLite used for local dev by default)
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- Razorpay (Payments)

---

## 📂 Project Structure

```
heritagevr/
├── backend/                  # Node.js API Server
│   ├── prisma/               # Database schema and seed data
│   ├── src/
│   │   ├── controllers/      # Route controllers (Auth, Sites, Donations, etc.)
│   │   ├── middleware/       # Auth and Validation middleware
│   │   ├── routes/           # Express API routes
│   │   └── server.js         # Entry point
│   ├── .env                  # Backend configuration
│   └── package.json
│
├── frontend/                 # React UI
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Footer)
│   │   ├── context/          # React Context (Auth)
│   │   ├── pages/            # Page components (Home, Explore, VR, etc.)
│   │   ├── services/         # API integration
│   │   ├── App.jsx           # Routing
│   │   ├── index.css         # Tailwind & Custom Styles
│   │   └── main.jsx          # Entry point
│   ├── tailwind.config.js    # Theme configuration
│   ├── vite.config.js        # Vite config with API proxy
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd heritagevr/backend

# Install dependencies
npm install

# Setup database (creates SQLite db and runs seed data)
npm run db:setup

# Start backend development server
npm run dev
```

### 2. Frontend Setup

Open a new terminal window:

```bash
cd heritagevr/frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### 3. Environment Variables

The backend uses a `.env` file (already configured for local dev). If you want to test actual Razorpay integration, update `backend/.env`:

```
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
```
*(If Razorpay keys are left as placeholders, the app automatically uses a fully functional Demo Payment Mode).*

---

## 🔐 Demo Credentials

The database is pre-seeded with heritage sites, donations, and the following accounts:

**Admin User:**
- Email: `admin@heritagevr.com`
- Password: `Admin@123`

**Standard User:**
- Email: `user@heritagevr.com`
- Password: `User@123`

*(You can also use the auto-fill buttons on the login page).*

---

## 🔌 API Overview

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/sites` - List all heritage sites
- `GET /api/sites/:id` - Get site details
- `GET /api/sites/:id/components` - Get site components for Adopt-a-Stone
- `POST /api/donations/create-order` - Initiate payment (Razorpay/Demo)
- `POST /api/donations/verify` - Verify successful payment
- `GET /api/user/dashboard` - Get user stats and history
- `GET /api/admin/dashboard` - Get platform statistics
- `GET /api/funds/overview` - Get transparent fund tracking data

---

## ⚠️ Known Limitations (Hackathon Scope)

1. **3D Models:** The VR experience currently uses a procedural Three.js placeholder. In a production environment, this would load actual `.glb`/`.gltf` photogrammetry models via the database `modelUrl`.
2. **Database:** Configured to use SQLite for easy local setup. For production deployment, Prisma should be pointed to a PostgreSQL instance via the `.env` file.
3. **Admin Panel:** The Admin Dashboard currently displays read-only statistics and ledgers. The backend APIs for full CRUD operations on sites/components exist but require UI implementation.

---

*Built with passion for heritage preservation.* 🏛️
