# PG Management Portal

A full-stack PG (Paying Guest) management web application that automates communication between **owners** and **tenants**.  
Owners can manage rooms, tenants, rent collection, and complaints, while tenants can view their room details, pay rent, and raise complaints from their own dashboard.

Deployed:
- **Frontend:** https://pg-management-portal.vercel.app  
- **Backend API:** https://pg-management-portal.onrender.com  
- **Database:** MongoDB Atlas

---

## 🔹 Core Features

### Owner Dashboard
- View PG overview: total rooms, active tenants, vacant rooms, monthly revenue.
- Room Management:
  - Add rooms with type, rent, capacity, and status (Vacant/Occupied).
  - Assign tenants to rooms and automatically update room status.
- Tenant Management:
  - Add new tenants with temporary credentials.
  - View tenant list with room, contact, and rent details.
  - Delete tenants and free up rooms.
- Complaint Management:
  - View all complaints raised by tenants.
  - Update complaint status (Pending → Resolved).

### Tenant Dashboard
- Overview with allocated room, rent, due date, and smart rent reminder banner.
- Complaint system with raise/view/delete features.
- Rent history tracking.
- "Pay Now" simulation that marks rent as paid.
- Profile update system.

### Automation & AI
- Automatic room status update when tenants join/exit.
- Automatic rent cycle management every month.
- AI-based rent reminder text (endpoint ready).
- Secure role-based APIs with JWT middleware.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Lucide Icons  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas (Mongoose)  
- **Authentication:** JWT  
- **Deployment:**  
  - Frontend (Vercel)  
  - Backend (Render)  
- **Data Fetching:** React Query  
- **Notifications:** Sonner Toasts  

---

## 📁 Folder Structure

pg-management-portal/
├── backend/
│ ├── server.js
│ ├── models/
│ ├── routes/
│ └── middleware/
└── frontend/
├── src/
├── public/
└── index.html

---

## 🔐 Environment Variables

### Backend (Render)

MONGO_URI=your_mongo_atlas_url
JWT_SECRET=your_secret
CLIENT_URL=https://pg-management-portal.vercel.app
NODE_ENV=production

shell
Copy code

### Frontend (Vercel)

VITE_API_URL=https://pg-management-portal.onrender.com/api

yaml
Copy code

---

## 🚀 Running the Project Locally

### 1. Clone repo

git clone https://github.com/sadhanakhobragade/pg-management-portal.git
cd pg-management-portal

shell
Copy code

### 2. Backend Setup

cd backend
npm install
npm start

nginx
Copy code

Backend runs on:

http://localhost:5000

shell
Copy code

### 3. Frontend Setup

cd frontend
npm install
npm run dev

nginx
Copy code

Frontend runs on:

http://localhost:5173

yaml
Copy code

---

## ☁️ Deployment Summary

### Backend – Render
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- ENV Vars:  
  - MONGO_URI  
  - JWT_SECRET  
  - CLIENT_URL=https://pg-management-portal.vercel.app  
  - NODE_ENV=production  

### Frontend – Vercel
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output: `dist`
- ENV Vars:  
  - VITE_API_URL=https://pg-management-portal.onrender.com/api

---

## 📌 Future Improvements

- Real payment gateway (Stripe/Razorpay)
- Multi-owner PG support
- Advanced analytics for revenue & occupancy
- AI complaint classification