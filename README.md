# 🎓 EdTech Platform

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Active-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

A modern **Full‑Stack EdTech Web Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)**. This platform provides an interactive learning environment where users can explore educational content through a clean and responsive interface.

🔗 **Repository:** [https://github.com/MAQ-1/Edtech](https://github.com/MAQ-1/Edtech)

---

## 🚀 Live Deployment

* 🌐 **Frontend:** [https://studynotion.tanmakumar.me/](https://studynotion.tanmakumar.me/)
* ⚙️ **Backend API:** [https://edtech-nse3.onrender.com](https://edtech-nse3.onrender.com)

> **Status:** ✅ Both frontend and backend are live and fully functional!

---

## 🧰 Tech Stack

### 🎨 Frontend

* **React.js** - Component-based UI library
* **Tailwind CSS** - Utility-first CSS framework
* **Redux Toolkit** - State management
* **React Router** - Client-side routing
* **Axios** - HTTP client for API calls
* **React Hook Form** - Form handling and validation
* **React Hot Toast** - Toast notifications
* **Swiper** - Modern slider component

### ⚙️ Backend

* **Node.js** - JavaScript runtime
* **Express.js** - Web application framework
* **MongoDB Atlas** - Cloud database
* **Mongoose** - MongoDB object modeling
* **JWT** - JSON Web Token authentication
* **Bcrypt** - Password hashing
* **Nodemailer** - Email sending
* **Cloudinary** - Image and file storage
* **Multer** - File upload handling

### ☁️ DevOps & Tools

* Git & GitHub
* MongoDB Atlas (Cloud Database)
* Render (Backend Hosting)
* Vercel (Frontend Hosting)

---

## 📂 Project Structure

```
Edtech/
│
├── Backend/        # Express server, APIs, database logic
├── frontend/       # React client application
├── .gitignore
└── README.md
```

---

## ✨ Features

* 📚 **Course Catalog:** Browse and explore available courses
* 👤 **User Authentication:** Secure login and registration system
* 🎓 **Course Enrollment:** Free enrollment system for courses
* � **Email Integration:** Automated email notifications for enrollment and password reset
* 🎨 **Responsive Design:** Modern UI with Tailwind CSS
* 🔐 **Secure Backend:** Protected API endpoints with proper authentication
* 🌍 **Cloud Integration:** MongoDB Atlas database and cloud file storage
* 🔄 **Real-time Updates:** Dynamic content loading and state management
* 📱 **Mobile Friendly:** Fully responsive design for all devices
* ⚡ **Fast Performance:** Optimized React frontend with efficient API calls

---

## 🖼️ Screenshots

> Add screenshots here after deployment

```
/docs/screenshots/home.png
/docs/screenshots/catalog.png
```

---

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file inside the **Backend** directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=4000
NODE_ENV=production

# JWT
JWT_SECRET=your_jwt_secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Cloudinary (for file uploads)
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay (for payments - optional)
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

### Frontend Environment Variables

Create a `.env` file inside the **frontend** directory:

```env
# Backend API URL
REACT_APP_BASE_URL=https://edtech-nse3.onrender.com/api/v1
REACT_APP_BACKEND_URL=https://edtech-nse3.onrender.com/

# Environment
REACT_APP_ENV=production
```

⚠️ **Security Note:** Never commit `.env` files to GitHub. They are already included in `.gitignore`.

---

## 🧑‍💻 Local Development Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/MAQ-1/Edtech.git
cd Edtech
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Backend runs at: `http://localhost:4000`

**Available Scripts:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

**Available Scripts:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

---

## 🔌 API Communication

Frontend communicates with backend using REST APIs.

Example request:

```js
axios.get("/api/courses");
```

In production, API base URL is configured using environment variables.

---

## 🏗️ Architecture Overview

```
User Browser
      ↓
Frontend (React / Vercel)
      ↓ API Calls
Backend (Node + Express / Render)
      ↓
MongoDB Atlas Database
```

---

## 🔐 Security Practices

* Environment variables secured using `.env`
* Sensitive files excluded via `.gitignore`
* Database credentials never exposed
* Production CORS configuration

---

## 🚀 Deployment Guide

### Backend (Render)

* Connect GitHub repository
* Select Backend folder as root
* Add environment variables
* Deploy web service

### Frontend (Vercel)

* Import repository
* Select frontend folder
* Add API base URL variable
* Deploy

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---

## 👨‍💻 Author

**Tanmay Kumar**

---

## ⭐ Show Your Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
