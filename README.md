# ComsiConnect 🎓 — A Social Media Platform for Students

ComsiConnect is a full-stack social media web application designed for students community. It allows students, faculty, and staff to connect, post content, and interact — including anonymous confessions — in a secure and user-friendly environment.

---

## 🚀 Features

- 🔐 **User Authentication** (Passport.js, session-based)
- 📰 **News Feed** with post creation, image upload, likes, reposts, and saves
- 🕵️ **Anonymous Confession System**
- 👤 **User Profiles** with edit, delete, and post management
- 🖼️ **Image Modal Viewer** with zoom/download
- 📦 Backend API built with Express.js and MongoDB
- 🌐 Full CORS-enabled frontend-backend communication
- 🎨 Responsive UI with Tailwind CSS + Framer Motion

---

## 🛠 Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS + Framer Motion
- React Router, React Icons, Day.js
- Deployment: **Vercel**

### Backend
- Node.js + Express.js
- MongoDB (via Mongoose)
- Passport.js for auth
- Multer (image upload), bcrypt.js
- Deployment: **Render**

---

## 📂 Directory Structure

```

root/
├── client/        # React frontend
│   └── src/
├── server/        # Express backend
│   ├── routes/
│   ├── models/
│   ├── auth/
│   ├── config/
│   └── app.js

````

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/comsiconnect.git
cd comsiconnect
````

### 2. Setup Backend (Render)

```bash
cd server
npm install
# Create .env file with MONGO_URI, SECRET_KEY, etc.
npm start
```

### 3. Setup Frontend (Vercel)

```bash
cd client
npm install
npm run dev
```

---


## 📦 Deployment

* **Frontend**: Vercel
* **Backend**: Render
* Configure production `.env` files and API endpoints accordingly.

---

## 🧠 Future Plans

* Mobile App (React Native or Flutter)
* Real-time Chat & Notifications
* Video Uploading Support
* Admin Dashboard for Moderation
* Integration with University Systems

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork the repo and submit improvements.

---

## 👨‍💻 Developed By

**\[Muhammad Abdullah]**

------------------------------------------

#### Let’s code, learn, and grow together! 🚀  

------------------------------------------