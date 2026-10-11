# 🎓 StudentHub Pro — Favourite Student Management App

A React-based student management application built to demonstrate **React Router, Context API, useContext, dynamic rendering, and global state management** with a clean and responsive user interface.

## 🌐 Live Demo

**Live Application:** https://studenthub-ojtt.vercel.app/

**GitHub Repository:** https://github.com/RojaShree03/Studenthub

## 📌 Project Overview

StudentHub Pro allows users to browse student records, view individual student profiles, manage favourite students, and perform student management operations through a simple web interface.

The project was initially designed as a Favourite Student List application and extended with additional student management functionality.

## ✨ Features

### 1. Student List
- Display student records dynamically.
- View individual student profiles.
- Search and browse student information.
- Navigate between pages without a full-page reload.

### 2. Favourite Students
- Add students to the favourites list.
- Prevent duplicate favourite entries.
- Remove students from favourites.
- Display an empty-state message when no favourite students are available.
- Access favourite data across pages using React Context.

### 3. Student Management
- Add new student records.
- Edit existing student details.
- Delete student records with a confirmation dialog.
- Search student records.
- Upload student profile photos.
- Validate student form inputs.
- Preserve student changes across page refreshes using browser storage.

### 4. Student Profiles
- View individual student details.
- Display available academic and contact information.
- Show student profile photos when available.

### 5. User Interface
- Responsive page layouts.
- Reusable React components.
- Consistent styling using CSS.
- Light and dark theme support.
- Search, form validation, and empty-state interfaces.

## 🛠️ Technologies Used

- **React JS** — Component-based user interface.
- **JavaScript (ES6+)** — Application logic.
- **React Router DOM** — Client-side routing and navigation.
- **Context API (`createContext`, `useContext`)** — Shared application state.
- **React Hooks** — State management and side effects.
- **CSS3** — Styling and responsive layouts.
- **Lucide React** — Icons.
- **LocalStorage** — Persistence of supported application data.
- **IndexedDB** — Browser-side storage for student profile images.
- **Vite** — Development server and build tool.
- **Vercel** — Application deployment.

## 📂 Project Structure

```text
Studenthub/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   ├── context/
│   │   └── StudentContext.jsx
│   ├── data/
│   │   └── students.js
│   ├── features/
│   │   └── student-management/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── styles/
│   │       └── utils/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

*Note: The structure above highlights the main application areas; individual filenames may vary depending on the current repository.*

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/RojaShree03/Studenthub.git
```

### 2. Navigate to the project directory

```bash
cd Studenthub
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

## ▶️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates a production build. |
| `npm run preview` | Previews the production build locally. |

## 🧠 Key React Concepts Demonstrated

### React Router
Uses client-side routing to navigate between application pages without reloading the entire document.

### Context API and useContext
Shares student and favourite-related state across components without passing props through every intermediate component.

### Dynamic Rendering
Uses JavaScript array methods, including `map()`, to render student records dynamically.

### Conditional Rendering
Displays different UI elements based on application state, including favourite status, available student details, and empty-state messages.

### State Management
Uses React state and context updates to refresh the UI when students or favourite records change.

### Browser Storage
Uses browser storage to preserve supported student information and profile images across refreshes.

## 🎯 Learning Objectives

This project demonstrates practical understanding of:

- Building functional components in React.
- Managing shared state with Context API.
- Using `createContext()` and `useContext()`.
- Implementing navigation with React Router and `<Link>`.
- Rendering arrays of objects dynamically.
- Preventing duplicate favourite entries.
- Implementing add, edit, and delete operations.
- Creating reusable components and responsive layouts.
- Persisting supported data in browser storage.

## 🚀 Deployment

The application is deployed on Vercel.

- **Live URL:** https://studenthub-ojtt.vercel.app/
- **Source Code:** https://github.com/RojaShree03/Studenthub

## 👨‍💻 Author

**StudentHub Pro Project**

Developed as a React JS project to practise routing, global state management, and student record management.

---

⭐ If you find this project useful, feel free to explore the repository and the live application.
