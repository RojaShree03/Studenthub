
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LayoutGrid, List } from "lucide-react";

import useStudents from "../hooks/useStudents";
import { useStudents as useStudentContext } from "../context/StudentContext";
import SearchBar from "../components/common/SearchBar";
import StudentGrid from "../components/students/StudentGrid";
import StudentFilters from "../components/students/StudentFilters";
import EmptyState from "../components/common/EmptyState";

export default function Favourites() {
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
    } = useStudents({ favouritesOnly: true });

    const {
        favouriteIds,
        addFavourite,
        removeFavourite,
    } = useStudentContext();

    const handleEmptyStateAction = () => {
        if (hasActiveFilters) {
            clearFilters();
        } else {
            navigate("/students");
        }
    };

    return (
        <div className="favourites-page">
            <section className="favourites-page-header">
                <div>
                    <div className="favourites-eyebrow">
                        <Heart size={15} fill="currentColor" />
                        Your collection
                    </div>

                    <h1 className="favourites-page-title">
                        Favourite Students
                    </h1>

                    <p className="favourites-page-description">
                        Keep your favourite students together for quick access.
                    </p>
                </div>

                <div className="favourites-total">
                    <Heart size={18} />
                    <span>
                        {filteredStudents.length}{" "}
                        {filteredStudents.length === 1 ? "student" : "students"}
                    </span>
                </div>
            </section>

            <section className="favourites-toolbar">
                <div className="favourites-search">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search your favourites..."
                    />
                </div>

                <div
                    className="students-view-toggle"
                    role="group"
                    aria-label="Choose display layout"
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

            {filteredStudents.length === 0 ? (
                <EmptyState
                    icon="heart"
                    title={
                        hasActiveFilters
                            ? "No matching favourites"
                            : "No favourite students yet"
                    }
                    description={
                        hasActiveFilters
                            ? "Try changing your search or filters to find a student."
                            : "Explore the student directory and select the heart icon to save students here."
                    }
                    actionLabel={
                        hasActiveFilters
                            ? "Clear filters"
                            : "Explore students"
                    }
                    onAction={handleEmptyStateAction}
                />
            ) : (
                <>
                    <div className="favourites-results-heading">
                        Showing {filteredStudents.length}{" "}
                        {filteredStudents.length === 1 ? "result" : "results"}
                    </div>

                    <StudentGrid
                        students={filteredStudents}
                        view={view}
                        favouriteIds={favouriteIds}
                        onAddFavourite={addFavourite}
                        onRemoveFavourite={removeFavourite}
                    />
                </>
            )}
        </div>
    );
}
