
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";

import { students as initialStudents } from "../data/students";

import {
    getFavouriteIds,
    saveFavouriteIds,
    getSavedTheme,
    saveTheme,
} from "../utils/storage";

const StudentContext = createContext(null);

const MANAGED_STUDENTS_KEY = "student_management_students";
const STUDENT_OVERRIDES_KEY = "studenthub_student_overrides";
const DELETED_STUDENTS_KEY = "studenthub_deleted_students";

const DB_NAME = "StudentHubDatabase";
const DB_VERSION = 1;
const IMAGE_STORE = "studentImages";

function normalizeYear(year) {
    if (typeof year === "number" && year >= 1 && year <= 4) {
        return year;
    }

    const match = String(year ?? "").match(/\d+/);
    const numericYear = match ? Number(match[0]) : 1;

    return numericYear >= 1 && numericYear <= 4 ? numericYear : 1;
}

function normalizeStudent(student, fallbackId) {
    const rollNo = String(
        student.rollNo ?? student.rollNumber ?? ""
    ).trim();

    const image = student.image || student.profileImage || "";

    return {
        ...student,
        id: student.id ?? fallbackId,
        name: String(student.name ?? "").trim(),
        rollNo,
        rollNumber: rollNo,
        email: String(student.email ?? "").trim(),
        phone: String(student.phone ?? student.mobile ?? "").trim(),
        mobile: String(student.phone ?? student.mobile ?? "").trim(),
        department: String(student.department ?? "").trim(),
        year: normalizeYear(student.year),
        image,
        profileImage: image,
        avatarColor: student.avatarColor || "#eef2ff",
        avatarTextColor: student.avatarTextColor || "#4f46e5",
    };
}

// IndexedDB helpers for profile photos.
function openImageDatabase() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("Your browser does not support IndexedDB."));
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const database = request.result;

            if (!database.objectStoreNames.contains(IMAGE_STORE)) {
                database.createObjectStore(IMAGE_STORE, {
                    keyPath: "studentId",
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            reject(request.error || new Error("Unable to open image storage."));
        };
    });
}

async function saveStudentImage(studentId, image) {
    const database = await openImageDatabase();

    try {
        await new Promise((resolve, reject) => {
            const transaction = database.transaction(IMAGE_STORE, "readwrite");
            const store = transaction.objectStore(IMAGE_STORE);

            if (image) {
                store.put({
                    studentId: String(studentId),
                    image,
                });
            } else {
                store.delete(String(studentId));
            }

            transaction.oncomplete = resolve;
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    } finally {
        database.close();
    }
}

async function getStudentImage(studentId) {
    const database = await openImageDatabase();

    try {
        return await new Promise((resolve, reject) => {
            const transaction = database.transaction(IMAGE_STORE, "readonly");
            const request = transaction
                .objectStore(IMAGE_STORE)
                .get(String(studentId));

            request.onsuccess = () => resolve(request.result?.image || "");
            request.onerror = () => reject(request.error);
        });
    } finally {
        database.close();
    }
}

async function deleteStudentImage(studentId) {
    await saveStudentImage(studentId, "");
}

function readArray(key) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function readObject(key) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");

        return parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
            ? parsed
            : {};
    } catch {
        return {};
    }
}

function readManagedStudents() {
    try {
        const parsed = JSON.parse(
            localStorage.getItem(MANAGED_STUDENTS_KEY) || "[]"
        );

        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed?.students)) return parsed.students;

        return [];
    } catch {
        return [];
    }
}

function createInitialStudents() {
    const overrides = readObject(STUDENT_OVERRIDES_KEY);
    const deletedIds = new Set(
        readArray(DELETED_STUDENTS_KEY).map(String)
    );

    const originals = initialStudents
        .map((student) => {
            const normalized = normalizeStudent(student, student.id);
            const override = overrides[String(normalized.id)];

            return override
                ? normalizeStudent(
                    { ...normalized, ...override, id: normalized.id },
                    normalized.id
                )
                : normalized;
        })
        .filter((student) => !deletedIds.has(String(student.id)));

    const originalIds = new Set(
        originals.map((student) => String(student.id))
    );

    const originalRollNumbers = new Set(
        originals.map((student) => student.rollNo.toLowerCase()).filter(Boolean)
    );

    const newStudents = readManagedStudents()
        .map((student) => normalizeStudent(student, student.id))
        .filter((student) => {
            if (deletedIds.has(String(student.id))) return false;

            const duplicateId = originalIds.has(String(student.id));
            const duplicateRoll = student.rollNo &&
                originalRollNumbers.has(student.rollNo.toLowerCase());

            return !duplicateId && !duplicateRoll;
        });

    return [...originals, ...newStudents];
}

function saveStudentRecords(students) {
    const originalIds = new Set(
        initialStudents.map((student) => String(student.id))
    );

    const deletedIds = new Set(readArray(DELETED_STUDENTS_KEY).map(String));
    const overrides = {};

    students.forEach((student) => {
        const id = String(student.id);
        deletedIds.delete(id);

        if (originalIds.has(id)) {
            // Do not save image data in localStorage.
            const { image, profileImage, ...details } = student;
            overrides[id] = details;
        }
    });

    const managedStudents = students
        .filter((student) => !originalIds.has(String(student.id)))
        .map((student) => {
            const { image, profileImage, ...details } = student;
            return details;
        });

    try {
        localStorage.setItem(
            STUDENT_OVERRIDES_KEY,
            JSON.stringify(overrides)
        );

        localStorage.setItem(
            MANAGED_STUDENTS_KEY,
            JSON.stringify({ version: 1, students: managedStudents })
        );

        localStorage.setItem(
            DELETED_STUDENTS_KEY,
            JSON.stringify([...deletedIds])
        );
    } catch (error) {
        console.error("Unable to save student details:", error);

        throw new Error(
            "Unable to save student details. Browser storage may be full."
        );
    }
}

const initialState = {
    students: createInitialStudents(),
    favouriteIds: getFavouriteIds(),
    theme: getSavedTheme(),
};

function studentReducer(state, action) {
    switch (action.type) {
        case "SET_STUDENTS":
            return { ...state, students: action.students };

        case "ADD_STUDENT":
            return {
                ...state,
                students: [...state.students, action.student],
            };

        case "UPDATE_STUDENT":
            return {
                ...state,
                students: state.students.map((student) =>
                    String(student.id) === String(action.student.id)
                        ? action.student
                        : student
                ),
            };

        case "DELETE_STUDENT":
            return {
                ...state,
                students: state.students.filter(
                    (student) => String(student.id) !== String(action.studentId)
                ),
                favouriteIds: state.favouriteIds.filter(
                    (id) => String(id) !== String(action.studentId)
                ),
            };

        case "ADD_FAVOURITE":
            if (
                state.favouriteIds.some(
                    (id) => String(id) === String(action.studentId)
                )
            ) {
                return state;
            }

            return {
                ...state,
                favouriteIds: [...state.favouriteIds, action.studentId],
            };

        case "REMOVE_FAVOURITE":
            return {
                ...state,
                favouriteIds: state.favouriteIds.filter(
                    (id) => String(id) !== String(action.studentId)
                ),
            };

        case "SET_THEME":
            return { ...state, theme: action.theme };

        default:
            return state;
    }
}

export function StudentProvider({ children }) {
    const [state, dispatch] = useReducer(studentReducer, initialState);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadImages() {
            try {
                const studentsWithImages = await Promise.all(
                    state.students.map(async (student) => {
                        try {
                            const image = await getStudentImage(student.id);

                            return image
                                ? { ...student, image, profileImage: image }
                                : student;
                        } catch (error) {
                            console.error("Unable to load student photo:", error);
                            return student;
                        }
                    })
                );

                if (!cancelled) {
                    dispatch({
                        type: "SET_STUDENTS",
                        students: studentsWithImages,
                    });
                }
            } finally {
                if (!cancelled) setImagesLoaded(true);
            }
        }

        loadImages();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        saveFavouriteIds(state.favouriteIds);
    }, [state.favouriteIds]);

    useEffect(() => {
        saveTheme(state.theme);
    }, [state.theme]);

    useEffect(() => {
        document.documentElement.dataset.theme = state.theme;
    }, [state.theme]);

    const addFavourite = useCallback((studentId) => {
        dispatch({ type: "ADD_FAVOURITE", studentId });
    }, []);

    const removeFavourite = useCallback((studentId) => {
        dispatch({ type: "REMOVE_FAVOURITE", studentId });
    }, []);

    const toggleTheme = useCallback(() => {
        dispatch({
            type: "SET_THEME",
            theme: state.theme === "light" ? "dark" : "light",
        });
    }, [state.theme]);

    const addStudent = useCallback(async (studentData) => {
        const normalized = normalizeStudent(
            studentData,
            `managed_${Date.now()}`
        );

        const duplicate = state.students.some(
            (student) =>
                student.rollNo.toLowerCase() === normalized.rollNo.toLowerCase() &&
                student.rollNo !== ""
        );

        if (duplicate) {
            throw new Error("This roll number already exists.");
        }

        await saveStudentImage(normalized.id, normalized.image);
        const nextStudents = [...state.students, normalized];

        try {
            saveStudentRecords(nextStudents);
        } catch (error) {
            await deleteStudentImage(normalized.id).catch(() => { });
            throw error;
        }

        dispatch({ type: "ADD_STUDENT", student: normalized });
        return normalized;
    }, [state.students]);

    const updateStudent = useCallback(async (studentId, updates) => {
        const existing = state.students.find(
            (student) => String(student.id) === String(studentId)
        );

        if (!existing) {
            throw new Error("Student not found.");
        }

        const updated = normalizeStudent(
            { ...existing, ...updates, id: existing.id },
            existing.id
        );

        const duplicate = state.students.some(
            (student) =>
                String(student.id) !== String(existing.id) &&
                student.rollNo.toLowerCase() === updated.rollNo.toLowerCase() &&
                student.rollNo !== ""
        );

        if (duplicate) {
            throw new Error("This roll number already exists.");
        }

        await saveStudentImage(updated.id, updated.image);

        const nextStudents = state.students.map((student) =>
            String(student.id) === String(existing.id) ? updated : student
        );

        saveStudentRecords(nextStudents);

        dispatch({ type: "UPDATE_STUDENT", student: updated });
        return updated;
    }, [state.students]);

    const deleteStudent = useCallback(async (studentId) => {
        const exists = state.students.some(
            (student) => String(student.id) === String(studentId)
        );

        if (!exists) {
            throw new Error("Student not found.");
        }

        const nextStudents = state.students.filter(
            (student) => String(student.id) !== String(studentId)
        );

        saveStudentRecords(nextStudents);
        await deleteStudentImage(studentId);

        const originalIds = new Set(
            initialStudents.map((student) => String(student.id))
        );

        if (originalIds.has(String(studentId))) {
            const deletedIds = new Set(
                readArray(DELETED_STUDENTS_KEY).map(String)
            );

            deletedIds.add(String(studentId));

            localStorage.setItem(
                DELETED_STUDENTS_KEY,
                JSON.stringify([...deletedIds])
            );

            const overrides = readObject(STUDENT_OVERRIDES_KEY);
            delete overrides[String(studentId)];

            localStorage.setItem(
                STUDENT_OVERRIDES_KEY,
                JSON.stringify(overrides)
            );
        }

        dispatch({ type: "DELETE_STUDENT", studentId });
    }, [state.students]);

    const favouriteStudents = useMemo(
        () => state.students.filter((student) =>
            state.favouriteIds.some(
                (id) => String(id) === String(student.id)
            )
        ),
        [state.students, state.favouriteIds]
    );

    const value = useMemo(() => ({
        students: state.students,
        favouriteIds: state.favouriteIds,
        favouriteStudents,
        favouriteCount: favouriteStudents.length,
        theme: state.theme,
        imagesLoaded,
        addFavourite,
        removeFavourite,
        toggleTheme,
        addStudent,
        updateStudent,
        deleteStudent,
    }), [
        state.students,
        state.favouriteIds,
        state.theme,
        favouriteStudents,
        imagesLoaded,
        addFavourite,
        removeFavourite,
        toggleTheme,
        addStudent,
        updateStudent,
        deleteStudent,
    ]);

    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    );
}

export function useStudents() {
    const context = useContext(StudentContext);

    if (context === null) {
        throw new Error("useStudents must be used inside a StudentProvider");
    }

    return context;
}
