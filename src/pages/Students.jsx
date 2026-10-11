
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, Users, Heart } from "lucide-react";

import useStudents from "../hooks/useStudents";
import { useStudents as useStudentContext } from "../context/StudentContext";

import SearchBar from "../components/common/SearchBar";
import StudentGrid from "../components/students/StudentGrid";
import StudentFilters from "../components/students/StudentFilters";
import EmptyState from "../components/common/EmptyState";

export default function Students() {
    const [view, setView] = useState("grid");
    const navigate = useNavigate();

    const {
        filteredStudents,
        departments,
        search,
        setSearch,
        department,
        setDepartment,
        year,
        setYear,
        sortBy,
        setSortBy,
        clearFilters,
        hasActiveFilters,
    } = useStudents();

    const {
        favouriteIds,
        addFavourite,
        removeFavourite,
    } = useStudentContext();

    const handleEditStudent = (student) => {
        navigate("/student-management", {
            state: {
                editStudentId: student.id,
            },
        });
    };

    return (
        <div className="students-page">
            <section className="students-page-header">
                <div>
                    <h2 className="students-page-title">All Students</h2>

                    <p className="students-page-description">
                        Discover students, explore departments, and build your
                        favourite list.
                    </p>
                </div>

                <div className="students-total">
                    <Users size={18} />
                    <span>{filteredStudents.length} students</span>
                </div>
            </section>

            <section className="students-toolbar">
                <div className="students-search">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by name, roll number or email..."
                    />
                </div>

                <div
                    className="students-view-toggle"
                    role="group"
                    aria-label="Student display mode"
                >
                    <button
                        type="button"
                        className={`students-view-button ${view === "grid" ? "students-view-active" : ""
                            }`}
                        onClick={() => setView("grid")}
                        aria-label="Grid view"
                        aria-pressed={view === "grid"}
                    >
                        <LayoutGrid size={18} />
                    </button>

                    <button
                        type="button"
                        className={`students-view-button ${view === "list" ? "students-view-active" : ""
                            }`}
                        onClick={() => setView("list")}
                        aria-label="List view"
                        aria-pressed={view === "list"}
                    >
                        <List size={18} />
                    </button>
                </div>
            </section>

            <StudentFilters
                departments={departments}
                department={department}
                onDepartmentChange={setDepartment}
                year={year}
                onYearChange={setYear}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            <div className="students-results-heading">
                <div>
                    <h3>Student Directory</h3>
                    <p>
                        Showing {filteredStudents.length}{" "}
                        {filteredStudents.length === 1 ? "result" : "results"}
                    </p>
                </div>

                <span className="students-favourite-summary">
                    <Heart size={15} />
                    {favouriteIds.length} favourites
                </span>
            </div>

            {filteredStudents.length === 0 ? (
                <EmptyState
                    icon="search"
                    title={
                        hasActiveFilters
                            ? "No students found"
                            : "No students available"
                    }
                    description={
                        hasActiveFilters
                            ? "Try changing your search or filters to find students."
                            : "There are no student records to display."
                    }
                    actionLabel={hasActiveFilters ? "Clear filters" : undefined}
                    onAction={hasActiveFilters ? clearFilters : undefined}
                />
            ) : (
                <StudentGrid
                    students={filteredStudents}
                    view={view}
                    favouriteIds={favouriteIds}
                    onAddFavourite={addFavourite}
                    onRemoveFavourite={removeFavourite}
                    onEdit={handleEditStudent}
                />
            )}
        </div>
    );
}
