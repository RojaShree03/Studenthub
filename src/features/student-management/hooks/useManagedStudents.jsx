import { useCallback, useEffect, useState } from "react";

import {
    getAllManagedStudents,
    addManagedStudent,
    updateManagedStudent,
    deleteManagedStudent,
} from "../utils/studentStorage";

function useManagedStudents() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const refreshStudents = useCallback(() => {
        setIsLoading(true);

        try {
            const savedStudents = getAllManagedStudents();

            setStudents(Array.isArray(savedStudents) ? savedStudents : []);
            setError("");
        } catch (err) {
            setError(
                err?.message || "Unable to load student records."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshStudents();
    }, [refreshStudents]);

    const addStudent = useCallback((studentData) => {
        try {
            const newStudent = addManagedStudent(studentData);

            setStudents((previous) => [...previous, newStudent]);
            setError("");

            return newStudent;
        } catch (err) {
            setError(
                err?.message || "Unable to add student."
            );

            throw err;
        }
    }, []);

    const updateStudent = useCallback((studentId, updates) => {
        try {
            const updatedStudent = updateManagedStudent(
                studentId,
                updates
            );

            setStudents((previous) =>
                previous.map((student) =>
                    String(student.id) === String(studentId)
                        ? updatedStudent
                        : student
                )
            );

            setError("");

            return updatedStudent;
        } catch (err) {
            setError(
                err?.message || "Unable to update student."
            );

            throw err;
        }
    }, []);

    const removeStudent = useCallback((studentId) => {
        try {
            deleteManagedStudent(studentId);

            setStudents((previous) =>
                previous.filter(
                    (student) =>
                        String(student.id) !== String(studentId)
                )
            );

            setError("");

            return true;
        } catch (err) {
            setError(
                err?.message || "Unable to delete student."
            );

            throw err;
        }
    }, []);

    const clearError = useCallback(() => {
        setError("");
    }, []);

    const totalStudents = students.length;

    const totalDepartments = new Set(
        students
            .map((student) =>
                student.department?.trim().toLowerCase()
            )
            .filter(Boolean)
    ).size;

    const studentsWithPhotos = students.filter(
        (student) =>
            Boolean(student.image || student.profileImage)
    ).length;

    return {
        students,
        isLoading,
        error,
        totalStudents,
        totalDepartments,
        studentsWithPhotos,
        addStudent,
        updateStudent,
        removeStudent,
        refreshStudents,
        clearError,
    };
}

export default useManagedStudents;