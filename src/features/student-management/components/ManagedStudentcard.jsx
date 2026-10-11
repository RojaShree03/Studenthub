import {
  Mail,
  Phone,
  GraduationCap,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

function ManagedStudentCard({ student, onEdit, onDelete }) {
  if (!student) return null;

  const name = student.name?.trim() || "Unnamed Student";
  const rollNumber = student.rollNumber || student.rollNo || "";
  const email = student.email || "";
  const phone = student.phone || student.mobile || "";
  const department = student.department || "";
  const year = student.year || "";
  const image = student.image || student.profileImage || "";

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="sm-managed-student-card">
      <div className="sm-managed-card-header">
        <div className="sm-managed-avatar">
          {image ? (
            <img
              src={image}
              alt={`${name} profile`}
              className="sm-managed-avatar-image"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="sm-managed-avatar-placeholder"
              aria-label="No profile photo"
            >
              {initials || <UserRound size={30} />}
            </div>
          )}
        </div>

        <div className="sm-managed-student-identity">
          <h3 title={name}>{name}</h3>

          <span className="sm-managed-roll-number">
            {rollNumber || "No roll number"}
          </span>
        </div>
      </div>

      <div className="sm-managed-card-details">
        {department && (
          <div className="sm-managed-detail">
            <GraduationCap size={17} aria-hidden="true" />
            <span title={department}>{department}</span>
          </div>
        )}

        {year && (
          <div className="sm-managed-year">{year}</div>
        )}

        {email && (
          <div className="sm-managed-detail">
            <Mail size={16} aria-hidden="true" />
            <span title={email}>{email}</span>
          </div>
        )}

        {phone && (
          <div className="sm-managed-detail">
            <Phone size={16} aria-hidden="true" />
            <span title={phone}>{phone}</span>
          </div>
        )}
      </div>

      <div className="sm-managed-card-actions">
        <button
          type="button"
          className="sm-managed-edit-button"
          onClick={() => onEdit?.(student)}
          aria-label={`Edit ${name}`}
        >
          <Pencil size={15} aria-hidden="true" />
          Edit
        </button>

        <button
          type="button"
          className="sm-managed-delete-button"
          onClick={() => onDelete?.(student)}
          aria-label={`Delete ${name}`}
        >
          <Trash2 size={15} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}

export default ManagedStudentCard;