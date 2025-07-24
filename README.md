# 🌐 Tica Home Website

Welcome to my full-stack portfolio website built with the **MERN** stack and **TailwindCSS**. This project showcases my work, personal background, investor opportunities, and online shop all in a modern, responsive design.

## ✨ Features

- ⚡ Fast, responsive frontend using **React + TailwindCSS**
- 🔐 Backend API with **Express.js** and **Node.js**
- 🗃️ Connected to a **MongoDB Atlas** database
- 📱 Mobile-first UI design
- 🛒 Integrated Shop page (basic e-commerce layout)

--- --- --- --- --- --- ---
## 🔗 Pages

### 1. 🏠 Home
- Clean hero section with personal intro
- Call-to-action buttons
- Featured services or recent work

### 2. 🙋‍♀️ About Me
- Bio and skills overview
- Photo 
 
### 3.⚙️ PROJECTS
- Experience section
- Design showcase

### 4. ✉️ Contact & Investor Info
- Contact form (name, email, message)
- Investor pitch deck or business info section
- Social and business links

### 5. 🛍️ Shop
- Product listing grid (from database or mock)
- Filter/sort UI
- Add to cart or inquiry buttons (MVP friendly)

--- --- --- --- --- --- ---
## 🧱 Tech Stack

| Layer       | Tech                      |
|-------------|---------------------------|
| Frontend    | React, TailwindCSS        |
| Backend     | Node.js, Express.js       |
| Database    | MongoDB (hosted on Atlas) |
| Deployment  | Render / Vercel 
| Versioning  | Git + GitHub              |

--- --- --- --- --- --- ---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Jessi-777/myPort.git
cd myPort
````

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client or frontend
npm install
```

### 3. Configure Environment Variables

In the `server/` directory, create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run Locally

```bash
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm start
```

--- --- --- --- --- --- ---

## 📁 Project Structure

```
root/
├── client/              # React + Tailwind frontend
├── server/              # Express backend
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── index.js         # Entry point
├── .gitignore
├── README.md
```

--- --- --- --- --- --- ---

## 📸 Screenshots

 * UI screen shots
   
--- --- --- --- --- --- ---

## 🛠️ Tasks

* Add authentication for admin/investor portal
* Hook up shop with Stripe or PayPal
* Admin dashboard to manage content
* Blog or media gallery

--- --- --- --- --- --- ---

## 🙌 Acknowledgments

Thanks for checking out my work! Built with 💻, 🎨, and all my 🫀.


