
import { useLocation } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import { useStudents } from "../../context/StudentContext";

const pageTitles = {
    "/": {
        title: "Dashboard",
        description: "Welcome back! Here's your student overview.",
    },
    "/students": {
        title: "Students",
        description: "Explore and manage your student directory.",
    },
    "/student-management": {
        title: "Student Management",
        description: "Add, update, and manage student profiles.",
    },
    "/favourites": {
        title: "Favourite Students",
        description: "Manage the students you've selected.",
    },
    "/settings": {
        title: "Settings",
        description: "Personalize your StudentHub experience.",
    },
};

export default function Topbar({ onMenuClick }) {
    const location = useLocation();
    const { theme, toggleTheme } = useStudents();

    const page = pageTitles[location.pathname] ?? {
        title: location.pathname.startsWith("/students/")
            ? "Student Details"
            : "Page Not Found",
        description: location.pathname.startsWith("/students/")
            ? "View student information and details."
            : "The requested page could not be found.",
    };

    return (
        <header className="topbar">
            <div className="topbar-heading">
                <button
                    type="button"
                    className="topbar-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                    aria-controls="app-sidebar"
                >
                    <Menu size={22} />
                </button>

                <div className="topbar-page-info">
                    <h1 className="topbar-title">{page.title}</h1>
                    <p className="topbar-description">{page.description}</p>
                </div>
            </div>

            <div className="topbar-actions">
                <button
                    type="button"
                    className="btn-icon topbar-theme-button"
                    onClick={toggleTheme}
                    aria-label={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                    title={
                        theme === "light"
                            ? "Switch to dark mode"
                            : "Switch to light mode"
                    }
                >
                    {theme === "light" ? (
                        <Moon size={19} />
                    ) : (
                        <Sun size={19} />
                    )}
                </button>

                <div className="topbar-profile" aria-label="StudentHub profile">
                    <span className="topbar-profile-avatar">SH</span>
                </div>
            </div>
        </header>
    );
}
