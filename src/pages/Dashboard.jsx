
import { Link, useNavigate } from "react-router-dom";
import {
    Users,
    Heart,
    Building2,
    ArrowUpRight,
    ArrowRight,
    GraduationCap,
} from "lucide-react";

import { useStudents } from "../context/StudentContext";
import EmptyState from "../components/common/EmptyState";

function StatCard({ title, value, icon: Icon, color, description }) {
    return (
        <article className="dashboard-stat-card">
            <div className={`dashboard-stat-icon ${color}`}>
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <div className="dashboard-stat-content">
                <p className="dashboard-stat-title">{title}</p>
                <h2 className="dashboard-stat-value">{value}</h2>
                <p className="dashboard-stat-description">{description}</p>
            </div>

            <ArrowUpRight
                className="dashboard-stat-arrow"
                size={18}
                aria-hidden="true"
            />
        </article>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();

    const {
        students = [],
        favouriteStudents = [],
        favouriteCount = 0,
    } = useStudents();

    const totalStudents = students.length;

    const departmentCount = new Set(
        students
            .map((student) => String(student.department ?? "").trim().toLowerCase())
            .filter(Boolean)
    ).size;

    const safeFavouriteCount = Number(favouriteCount) || 0;

    const favouriteRate =
        totalStudents > 0
            ? Math.round((safeFavouriteCount / totalStudents) * 100)
            : 0;

    const recentFavourites = [...favouriteStudents].slice(-4).reverse();

    return (
        <div className="dashboard-page">
            <section className="dashboard-welcome">
                <div>
                    <span className="dashboard-eyebrow">STUDENT OVERVIEW</span>

                    <h2 className="dashboard-welcome-title">
                        Your student workspace
                    </h2>

                    <p className="dashboard-welcome-description">
                        Keep track of your students and manage your favourite list
                        in one place.
                    </p>
                </div>

                <Link to="/students" className="dashboard-primary-link">
                    <Users size={18} aria-hidden="true" />
                    Explore students
                    <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </section>

            <section
                className="dashboard-stats"
                aria-label="Student statistics"
            >
                <StatCard
                    title="Total Students"
                    value={totalStudents}
                    icon={Users}
                    color="stat-indigo"
                    description="Students in your directory"
                />

                <StatCard
                    title="Favourite Students"
                    value={safeFavouriteCount}
                    icon={Heart}
                    color="stat-rose"
                    description="Students you've selected"
                />

                <StatCard
                    title="Departments"
                    value={departmentCount}
                    icon={Building2}
                    color="stat-teal"
                    description="Across your directory"
                />

                <StatCard
                    title="Favourite Rate"
                    value={`${favouriteRate}%`}
                    icon={GraduationCap}
                    color="stat-amber"
                    description="Of all listed students"
                />
            </section>

            <section className="dashboard-content-grid">
                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h3>Favourite Students</h3>
                            <p>Your selected students, all in one place.</p>
                        </div>

                        <Link to="/favourites" className="dashboard-text-link">
                            View all
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    {recentFavourites.length === 0 ? (
                        <EmptyState
                            icon="heart"
                            title="No favourite students yet"
                            description="Add students to your favourites and they will appear here."
                            actionLabel="Browse students"
                            onAction={() => navigate("/students")}
                        />
                    ) : (
                        <div className="dashboard-recent-list">
                            {recentFavourites.map((student) => {
                                const name = String(student.name ?? "").trim() ||
                                    "Unnamed Student";
                                const rollNumber = student.rollNumber ?? student.rollNo ?? "N/A";
                                const department = student.department || "Department not specified";

                                const initials = name
                                    .split(/\s+/)
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((part) => part[0].toUpperCase())
                                    .join("");

                                return (
                                    <div
                                        className="dashboard-student-row"
                                        key={student.id}
                                    >
                                        <div
                                            className="dashboard-student-avatar"
                                            style={{
                                                backgroundColor: student.avatarColor || "#e0e7ff",
                                                color: student.avatarTextColor || "#3730a3",
                                            }}
                                            aria-hidden="true"
                                        >
                                            {initials || "S"}
                                        </div>

                                        <div className="dashboard-student-info">
                                            <h4>{name}</h4>
                                            <p>
                                                {rollNumber} · {department}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/students/${student.id}`}
                                            className="dashboard-student-action"
                                            aria-label={`View ${name}`}
                                            title="View student"
                                        >
                                            <ArrowRight size={18} aria-hidden="true" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>

                <article className="dashboard-panel dashboard-quick-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h3>Quick Actions</h3>
                            <p>Jump straight to what you need.</p>
                        </div>
                    </div>

                    <div className="dashboard-quick-actions">
                        <Link to="/students" className="dashboard-quick-action">
                            <div className="quick-action-icon stat-indigo">
                                <Users size={20} aria-hidden="true" />
                            </div>

                            <div>
                                <h4>Student Directory</h4>
                                <p>Search and explore students</p>
                            </div>

                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>

                        <Link to="/favourites" className="dashboard-quick-action">
                            <div className="quick-action-icon stat-rose">
                                <Heart size={20} aria-hidden="true" />
                            </div>

                            <div>
                                <h4>My Favourites</h4>
                                <p>{safeFavouriteCount} students selected</p>
                            </div>

                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>

                        <Link to="/settings" className="dashboard-quick-action">
                            <div className="quick-action-icon stat-teal">
                                <GraduationCap size={20} aria-hidden="true" />
                            </div>

                            <div>
                                <h4>Preferences</h4>
                                <p>Customize your experience</p>
                            </div>

                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="dashboard-tip">
                        <Heart size={19} aria-hidden="true" />
                        <p>
                            <strong>Tip:</strong> Use search and filters to find the
                            students you want to keep close.
                        </p>
                    </div>
                </article>
            </section>
        </div>
    );
}
