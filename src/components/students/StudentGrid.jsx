
import StudentCard from "./StudentCard";

export default function StudentGrid({
    students,
    view,
    favouriteIds,
    onAddFavourite,
    onRemoveFavourite,
    onEdit,
}) {
    return (
        <div
            className={`student-grid ${view === "list" ? "student-grid-list" : ""
                }`}
        >
            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    isFavourite={favouriteIds.some(
                        (id) => String(id) === String(student.id)
                    )}
                    onAddFavourite={onAddFavourite}
                    onRemoveFavourite={onRemoveFavourite}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
