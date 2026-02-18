# 🎓 EdTech Platform

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Active-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

A modern **Full‑Stack EdTech Web Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)**. This platform provides an interactive learning environment where users can explore educational content through a clean and responsive interface.

🔗 **Repository:** [https://github.com/MAQ-1/Edtech](https://github.com/MAQ-1/Edtech)

---

## 🚀 Live Deployment

* 🌐 **Frontend:** *Coming Soon*
* ⚙️ **Backend API:** *Coming Soon*

---

## 🧰 Tech Stack

### 🎨 Frontend

* React.js
* Vite
* Axios
* Modern Component‑Based UI

### ⚙️ Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose ODM
* RESTful API Design

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

* 📚 Course catalog browsing
* ⚡ Fast and responsive React UI
* 🔐 Environment‑protected backend configuration
* 🌍 Cloud database integration (MongoDB Atlas)
* 🧩 Modular backend architecture
* 🔄 REST API communication

---

## 🖼️ Screenshots

> Add screenshots here after deployment

```
/docs/screenshots/home.png
/docs/screenshots/catalog.png
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **Backend** directory:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

⚠️ Never commit `.env` files to GitHub.

---

## 🧑‍💻 Local Development Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/MAQ-1/Edtech.git
cd Edtech
```

---

### 2️⃣ Backend Setup

```
cd Backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

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
