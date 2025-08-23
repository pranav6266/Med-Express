# MedExpress 

A full-stack medicine delivery platform built on the **MERN stack**.  
It seamlessly connects **Users**, **Agents**, and **Admins** into one integrated ecosystem, ensuring smooth medicine ordering, tracking, and management workflows.

---

## 🚀 Features

### 🔹 Authentication & Security
- Secure **JWT-based authentication** for all roles (User, Agent, Admin).  
- **Role-based access control (RBAC)** ensuring routes are protected.  
- **Forgot/Reset password** flow with token-based reset.  
- **Change password** option inside profile settings.  

---

### 👤 User Features
- **Signup/Login** with role assignment (`user`, `agent`, `admin`).  
- **Profile management**:
  - Update name, phone, avatar, and structured address (flat, road, locality, pincode, city, state).  
  - Change password securely.  
- **Medicine browsing**:
  - Search medicines store-wise (inventory tied to specific stores).  
  - Medicine cards show **name, description, price, stock, and image**.  
- **Cart system**:
  - Add medicines with quantity validation against store inventory.  
  - Increment/decrement quantity.  
  - Remove items from cart.  
  - Cart auto-clears post successful order.  
  - **CartPanel** with smooth slide-in UI and real-time price calculation.  
- **Order management**:
  - Place orders by selecting a **fulfillment store** and **delivery address**.  
  - Payment option (COD).  
  - View complete **order history** with statuses (`Pending`, `Accepted`, `Picked Up`, `Delivered`, `Cancelled`).  
- **Checkout flow** with order summary and address confirmation.  

---

### 🚴 Agent Features
- **Dedicated agent dashboard**.  
- View **all orders assigned** to them with populated **user details** and **store details**.  
- **Update status** of orders (Picked Up, Delivered, Cancelled).  
- Restriction to update **only their assigned orders**.  

---

### 🛠️ Admin Features
- **Admin dashboard** with three core modules:  
  - **Medicine Management**:
    - Add new medicines with images.  
    - Edit medicine details (name, description, price, stock, image).  
    - Delete medicines.  
  - **Inventory Management**:
    - Store-based inventory system: update stock at a specific pharmacy.  
  - **Order Management**:
    - View all orders with populated **user**, **agent**, and **store** details.  
    - Assign orders to specific agents.  
    - Track statuses.  
- **Agent Management**:
  - Fetch list of all registered agents.  

---

### 🏪 Store Management
- Pre-seeded **Apollo Pharmacy branches** across Bangalore with geocoded addresses.  
- Each medicine carries **store-based stock levels**, preventing cross-store inconsistencies.  

---

### 🎨 UI/UX Enhancements
- Built with **React + Vite** for blazing-fast frontend.  
- **Responsive dashboards** for User, Agent, and Admin roles.  
- **Protected Routes** per role:
  - `ProtectedRoute` for User.  
  - `AgentRoute` for Agent.  
  - `AdminRoute` for Admin.  
- **Theme toggle (Dark/Light mode)** with persistence via localStorage.  
- Modern animated UI with gradient backgrounds, smooth transitions, and interactive buttons.  

---

### 🗂️ Tech Stack
- **Frontend**: React, React Router, Context API (CartContext), Vite.  
- **Backend**: Node.js, Express.js.  
- **Database**: MongoDB + Mongoose ODM.  
- **Authentication**: JWT with role-based middleware.  
- **File Uploads**: Multer (medicine images, avatars).  
- **Styling**: Custom CSS with dark/light theme variables.  
- **Utilities**:
  - Seeder script (`seeder.js`) for users, stores, medicines, and orders.  
  - Global error handler for cleaner backend responses.  

---

## ⚡ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/pranav6266/med-express.git
cd med-express

# Install dependencies
npm install

# Start backend server
npm run server

# Start frontend
npm run dev

# (Optional) Seed database
npm run data:import
```

---

## 📌 Dummy Accounts for Testing

```txt
Admin:
  email: admin@example.com
  password: admin123

User:
  email: user@example.com
  password: user123

Agent:
  email: agent@gmail.com
  password: agent123
```

---

## 🌟 Key Highlights
- Full **multi-role platform** (User, Agent, Admin).  
- **Store-based medicine inventory system**.  
- **End-to-end order lifecycle**: Browse → Cart → Checkout → Assign → Deliver.  
- **Robust authentication & authorization**.  
- Clean UI with **modern responsive design**.  
- Ready-to-use with **seeded data** (stores, medicines, users, orders).  

---

## 📄 Project By
#### PRANAV C 
#### PRESIDENCY UNIVERSITY, BANGALORE
