
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Users,
    Camera,
    Building2,
    Plus,
    Search,
    X,
    UserRound,
} from "lucide-react";

import { useStudents } from "../../../context/StudentContext.jsx";
import StudentForm from "../components/studentForm.jsx";
import StudentDeleteDialog from "../components/StudentDeleteDialog.jsx";
import ManagedStudentCard from "../components/ManagedStudentcard.jsx";
import "../styles/student-management.css";

export default function StudentManagementPage() {
    const {
        students = [],
        addStudent,
        updateStudent,
        deleteStudent,
    } = useStudents();

    const location = useLocation();
    const navigate = useNavigate();

    const formSectionRef = useRef(null);

    const [search, setSearch] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [formError, setFormError] = useState("");

    // Display all students from StudentContext.
    const managedStudents = useMemo(() => {
        return students;
    }, [students]);

    // Search students.
    const filteredStudents = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return managedStudents;

        return managedStudents.filter((student) =>
            [
                student.name,
                student.rollNumber,
                student.rollNo,
                student.department,
                student.email,
                student.phone,
                student.mobile,
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(keyword)
            )
        );
    }, [managedStudents, search]);

    // Dashboard summary values.
    const studentsWithPhotos = managedStudents.filter(
        (student) => Boolean(student.image || student.profileImage)
    ).length;

    const totalDepartments = new Set(
        managedStudents
            .map((student) => student.department?.trim().toLowerCase())
            .filter(Boolean)
    ).size;

    // Automatically scroll to the form whenever it opens
    // or a different student's edit form is selected.
    useEffect(() => {
        if (!showForm) return;

        const frameId = requestAnimationFrame(() => {
            formSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => cancelAnimationFrame(frameId);
    }, [showForm, formKey]);

    // Open a blank form for adding a student.
    function handleAddClick() {
        setEditingStudent(null);
        setFormError("");
        setFormKey((previous) => previous + 1);
        setShowForm(true);
    }

    // Open the selected student's prefilled edit form.
    function handleEditClick(student) {
        if (!student) {
            setFormError("The selected student could not be found.");
            return;
        }

        setEditingStudent(student);
        setFormError("");
        setFormKey((previous) => previous + 1);
        setShowForm(true);
    }

    // Support navigation to this page with an editStudentId.
    useEffect(() => {
        const editStudentId = location.state?.editStudentId;

        if (editStudentId === undefined || editStudentId === null) {
            return;
        }

        const selectedStudent = students.find(
            (student) => String(student.id) === String(editStudentId)
        );

        if (selectedStudent) {
            setEditingStudent(selectedStudent);
            setFormError("");
            setFormKey((previous) => previous + 1);
            setShowForm(true);
        } else {
            setFormError("The selected student could not be found.");
        }

        // Clear navigation state to prevent reopening the same form.
        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, [location.state, location.pathname, navigate, students]);

    // Close the form.
    function handleCloseForm() {
        setShowForm(false);
        setEditingStudent(null);
        setFormError("");
    }

    // Add a student or save the selected student's changes.
    async function handleFormSubmit(formData) {
        setFormError("");

        try {
            const result = editingStudent
                ?await updateStudent(editingStudent.id, formData)
                :await addStudent(formData);

            if (result === false || result?.success === false) {
                setFormError(
                    result?.message ||
                    "Unable to save student. Check the roll number."
                );
                return;
            }

            handleCloseForm();
        } catch (error) {
            setFormError(
                error?.message ||
                "Unable to save student. Please try again."
            );
        }
    }

    // Delete the selected student.
    async function handleDeleteConfirm() {
        if (!deletingStudent) return;

        try {
            const result = await deleteStudent(deletingStudent.id);

            if (result === false || result?.success === false) {
                setFormError(
                    result?.message ||
                    "Unable to delete student. Please try again."
                );
                setDeletingStudent(null);
                return;
            }

            setDeletingStudent(null);
        } catch (error) {
            setFormError(
                error?.message ||
                "Unable to delete student. Please try again."
            );
            setDeletingStudent(null);
        }
    }

    return (
        <main className="student-management-page">
            <header className="sm-page-header">
                <div className="sm-page-heading">
                    <div className="sm-page-icon">
                        <Users size={27} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="sm-eyebrow">
                            STUDENT ADMINISTRATION
                        </p>

                        <h1>Student Management</h1>

                        <p className="sm-page-description">
                            Add students, update profiles, upload photos,
                            and manage records.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="sm-primary-button"
                    onClick={handleAddClick}
                >
                    <Plus size={18} aria-hidden="true" />
                    Add Student
                </button>
            </header>

            {formError && (
                <div className="sm-error-banner" role="alert">
                    <span>{formError}</span>

                    <button
                        type="button"
                        onClick={() => setFormError("")}
                        aria-label="Dismiss error"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <section className="sm-summary-grid">
                <article className="sm-summary-card">
                    <div className="sm-summary-icon">
                        <Users size={23} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="sm-summary-label">
                            Total Students
                        </p>

                        <h2>{managedStudents.length}</h2>

                        <p className="sm-summary-note">
                            All student profiles in the application
                        </p>
                    </div>
                </article>

                <article className="sm-summary-card">
                    <div className="sm-summary-icon sm-summary-icon-purple">
                        <Camera size={23} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="sm-summary-label">
                            Students With Photos
                        </p>

                        <h2>{studentsWithPhotos}</h2>

                        <p className="sm-summary-note">
                            Profiles with a photo
                        </p>
                    </div>
                </article>

                <article className="sm-summary-card">
                    <div className="sm-summary-icon">
                        <Building2 size={23} aria-hidden="true" />
                    </div>

                    <div>
                        <p className="sm-summary-label">
                            Departments
                        </p>

                        <h2>{totalDepartments}</h2>

                        <p className="sm-summary-note">
                            Unique departments represented
                        </p>
                    </div>
                </article>
            </section>

            {showForm && (
                <section
                    ref={formSectionRef}
                    className="sm-panel"
                    style={{ scrollMarginTop: "130px" }}
                >
                    <div className="sm-panel-heading">
                        <div>
                            <h2>
                                {editingStudent
                                    ? "Edit Student Profile"
                                    : "Add New Student"}
                            </h2>

                            <p>
                                Enter the student information in the fields below.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="sm-form-close-button"
                            onClick={handleCloseForm}
                            aria-label="Close student form"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <StudentForm
                        key={formKey}
                        initialStudent={editingStudent}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseForm}
                    />
                </section>
            )}

            <section className="sm-panel">
                <div className="sm-panel-heading sm-students-panel-heading">
                    <div>
                        <h2>All Students</h2>

                        <p>
                            {filteredStudents.length} student
                            {filteredStudents.length === 1 ? "" : "s"} found
                        </p>
                    </div>
                </div>

                <div className="sm-search-wrapper">
                    <Search size={18} aria-hidden="true" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, roll number, or department..."
                        aria-label="Search students"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {filteredStudents.length > 0 ? (
                    <div className="sm-managed-student-grid">
                        {filteredStudents.map((student) => (
                            <ManagedStudentCard
                                key={student.id}
                                student={student}
                                onEdit={() => handleEditClick(student)}
                                onDelete={() => setDeletingStudent(student)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="sm-empty-state">
                        <div className="sm-empty-state-icon">
                            <UserRound size={30} aria-hidden="true" />
                        </div>

                        <h3>
                            {search
                                ? "No Matching Students"
                                : "No Students Yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another name, roll number, or department."
                                : "Add your first student to start managing profiles."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                className="sm-primary-button"
                                onClick={handleAddClick}
                            >
                                <Plus size={17} aria-hidden="true" />
                                Add First Student
                            </button>
                        )}
                    </div>
                )}
            </section>

            {deletingStudent && (
                <StudentDeleteDialog
                    open={Boolean(deletingStudent)}
                    student={deletingStudent}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingStudent(null)}
                />
            )}
        </main>
    );
}
