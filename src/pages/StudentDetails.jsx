
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowUpRight,
    GraduationCap,
    Heart,
    Mail,
    Hash,
    Building2,
} from "lucide-react";

import { useStudents } from "../context/StudentContext";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";

export default function StudentDetails() {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const {
        students = [],
        favouriteIds = [],
        addFavourite,
        removeFavourite,
    } = useStudents();

    const student = students.find(
        (item) => String(item.id) === String(studentId)
    );

    if (!student) {
        return (
            <EmptyState
                icon="users"
                title="Student not found"
                description="This student may not exist or the profile link may be incorrect."
                actionLabel="Back to students"
                onAction={() => navigate("/students")}
            />
        );
    }

    const isFavourite = favouriteIds.some(
        (id) => String(id) === String(student.id)
    );

    const name = String(student.name ?? "").trim() || "Unnamed Student";
    const rollNumber = student.rollNumber ?? student.rollNo ?? "N/A";
    const email = String(student.email ?? "").trim();
    const department = student.department || "Department not specified";
    const year = student.year ?? "N/A";

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const handleFavouriteClick = () => {
        if (isFavourite) {
            removeFavourite(student.id);
        } else {
            addFavourite(student.id);
        }
    };

    return (
        <div className="student-details-page">
            <Link to="/students" className="student-details-back">
                <ArrowLeft size={17} aria-hidden="true" />
                Back to students
            </Link>

            <section className="student-details-card">
                <div className="student-details-banner" />

                <div className="student-details-body">
                    <div className="student-details-profile">
                        <div
                            className="student-details-avatar"
                            style={{
                                backgroundColor: student.avatarColor || "#e0e7ff",
                                color: student.avatarTextColor || "#3730a3",
                            }}
                            aria-hidden="true"
                        >
                            {initials || "S"}
                        </div>

                        <div className="student-details-identity">
                            <span className="student-details-eyebrow">
                                Student profile
                            </span>

                            <h1 className="student-details-name">{name}</h1>

                            <p className="student-details-subtitle">{department}</p>
                        </div>

                        <Button
                            variant={isFavourite ? "secondary" : "primary"}
                            onClick={handleFavouriteClick}
                            aria-pressed={isFavourite}
                        >
                            <Heart
                                size={17}
                                fill={isFavourite ? "currentColor" : "none"}
                                aria-hidden="true"
                            />
                            {isFavourite ? "Remove favourite" : "Add favourite"}
                        </Button>
                    </div>

                    <div className="student-details-divider" />

                    <h2 className="student-details-section-title">
                        Student information
                    </h2>

                    <div className="student-details-info-grid">
                        <div className="student-info-item">
                            <div className="student-info-icon">
                                <Hash size={19} aria-hidden="true" />
                            </div>

                            <div>
                                <span className="student-info-label">Roll number</span>
                                <p className="student-info-value">{rollNumber}</p>
                            </div>
                        </div>

                        <div className="student-info-item">
                            <div className="student-info-icon">
                                <Mail size={19} aria-hidden="true" />
                            </div>

                            <div>
                                <span className="student-info-label">Email address</span>
                                <p className="student-info-value">
                                    {email ? (
                                        <a href={`mailto:${email}`}>{email}</a>
                                    ) : (
                                        "Not provided"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="student-info-item">
                            <div className="student-info-icon">
                                <Building2 size={19} aria-hidden="true" />
                            </div>

                            <div>
                                <span className="student-info-label">Department</span>
                                <p className="student-info-value">{department}</p>
                            </div>
                        </div>

                        <div className="student-info-item">
                            <div className="student-info-icon">
                                <GraduationCap size={19} aria-hidden="true" />
                            </div>

                            <div>
                                <span className="student-info-label">Academic year</span>
                                <p className="student-info-value">
                                    {year === "N/A" ? year : `Year ${year}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="student-details-footer">
                        <span>
                            {isFavourite
                                ? "This student is in your favourites."
                                : "Add this student to your favourites for quick access."}
                        </span>

                        <Link
                            to="/favourites"
                            className="student-details-favourites-link"
                        >
                            View favourites
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
