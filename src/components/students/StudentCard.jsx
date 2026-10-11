
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Mail, Pencil } from "lucide-react";
import Button from "../common/Button";

export default function StudentCard({
    student,
    isFavourite,
    onAddFavourite,
    onRemoveFavourite,
    onEdit,
}) {
    const name = student.name || "Unnamed Student";

    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "ST";

    const image = student.image || student.profileImage || "";
    const rollNo = student.rollNo || student.rollNumber || "N/A";
    const email = student.email || "No email available";
    const department = student.department || "Department not specified";

    const handleFavouriteClick = () => {
        if (isFavourite) {
            onRemoveFavourite(student.id);
        } else {
            onAddFavourite(student.id);
        }
    };

    return (
        <article className="student-card">
            <div className="student-card-header">
                <div
                    className="student-card-avatar"
                    style={{
                        backgroundColor: student.avatarColor || "#eef2ff",
                        color: student.avatarTextColor || "#4f46e5",
                        overflow: "hidden",
                    }}
                    aria-label={`${name} profile`}
                >
                    {image ? (
                        <img
                            src={image}
                            alt={`${name} profile`}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "inherit",
                            }}
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        initials
                    )}
                </div>

                <button
                    type="button"
                    className={`student-favourite-button ${isFavourite ? "student-favourite-active" : ""
                        }`}
                    onClick={handleFavouriteClick}
                    aria-label={
                        isFavourite
                            ? `Remove ${name} from favourites`
                            : `Add ${name} to favourites`
                    }
                    aria-pressed={isFavourite}
                    title={
                        isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                    }
                >
                    <Heart
                        size={19}
                        fill={isFavourite ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <div className="student-card-content">
                <span className="student-card-roll">{rollNo}</span>

                <h2 className="student-card-name">
                    <Link to={`/students/${student.id}`}>{name}</Link>
                </h2>

                <p className="student-card-department">{department}</p>

                <div className="student-card-meta">
                    <span className="student-card-year">
                        Year {student.year || "N/A"}
                    </span>

                    <span className="student-card-email">
                        <Mail size={15} />
                        <span>{email}</span>
                    </span>
                </div>
            </div>

            <div className="student-card-footer">
                <Link
                    to={`/students/${student.id}`}
                    className="student-card-profile-link"
                    aria-label={`View ${name}'s profile`}
                >
                    View profile
                    <ArrowUpRight size={16} />
                </Link>

                {typeof onEdit === "function" && (
                    <Button
                        variant="secondary"
                        onClick={() => onEdit(student)}
                        aria-label={`Edit ${name}`}
                    >
                        <Pencil size={16} />
                        Edit
                    </Button>
                )}

                <Button
                    variant={isFavourite ? "secondary" : "primary"}
                    onClick={handleFavouriteClick}
                    aria-pressed={isFavourite}
                >
                    <Heart
                        size={16}
                        fill={isFavourite ? "currentColor" : "none"}
                    />
                    {isFavourite ? "Saved" : "Favourite"}
                </Button>
            </div>
        </article>
    );
}
