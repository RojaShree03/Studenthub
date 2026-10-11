
const STORAGE_KEY = "student_management_students";
const STORAGE_VERSION = 1;

function readStudents() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (!storedData) {
            return [];
        }

        const parsedData = JSON.parse(storedData);

        // Support both the versioned format and a plain array.
        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        if (
            parsedData?.version === STORAGE_VERSION &&
            Array.isArray(parsedData.students)
        ) {
            return parsedData.students;
        }

        return [];
    } catch (error) {
        console.error("Unable to read student data:", error);
        throw new Error("Student data could not be loaded.");
    }
}

function writeStudents(students) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                version: STORAGE_VERSION,
                students,
            })
        );
    } catch (error) {
        console.error("Unable to save student data:", error);

        if (
            error?.name === "QuotaExceededError" ||
            error?.name === "NS_ERROR_DOM_QUOTA_REACHED"
        ) {
            throw new Error(
                "Browser storage is full. Try using a smaller profile image."
            );
        }

        throw new Error("Student data could not be saved.");
    }
}

function normalizeRollNumber(rollNumber) {
    return String(rollNumber ?? "").trim().toLowerCase();
}

function normalizeStudentId(studentId) {
    return String(studentId ?? "");
}

function createStudentId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `student_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

function normalizeStudentFields(studentData) {
    return {
        ...studentData,
        name: String(studentData.name ?? "").trim(),
        rollNumber: String(
            studentData.rollNumber ?? studentData.rollNo ?? ""
        ).trim(),
        email: String(studentData.email ?? "").trim(),
        phone: String(
            studentData.phone ?? studentData.mobile ?? ""
        ).trim(),
        department: String(studentData.department ?? "").trim(),
        year: String(studentData.year ?? ""),
        image: studentData.image || studentData.profileImage || "",
    };
}

export function getAllManagedStudents() {
    return readStudents();
}

export function getManagedStudentById(studentId) {
    const targetId = normalizeStudentId(studentId);

    return (
        readStudents().find(
            (student) => normalizeStudentId(student.id) === targetId
        ) || null
    );
}

export function addManagedStudent(studentData) {
    const students = readStudents();
    const normalizedData = normalizeStudentFields(studentData);
    const rollNumber = normalizeRollNumber(normalizedData.rollNumber);

    if (!rollNumber) {
        throw new Error("Roll number is required.");
    }

    const duplicate = students.some(
        (student) =>
            normalizeRollNumber(student.rollNumber ?? student.rollNo) ===
            rollNumber
    );

    if (duplicate) {
        throw new Error("This roll number already exists.");
    }

    const now = new Date().toISOString();

    const newStudent = {
        ...normalizedData,
        id: createStudentId(),
        createdAt: now,
        updatedAt: now,
    };

    writeStudents([...students, newStudent]);

    return newStudent;
}

export function updateManagedStudent(studentId, updates) {
    const students = readStudents();
    const targetId = normalizeStudentId(studentId);

    const index = students.findIndex(
        (student) => normalizeStudentId(student.id) === targetId
    );

    if (index === -1) {
        throw new Error("Student not found.");
    }

    const currentStudent = students[index];
    const normalizedUpdates = normalizeStudentFields({
        ...currentStudent,
        ...updates,
        image:
            updates.image ??
            updates.profileImage ??
            currentStudent.image ??
            currentStudent.profileImage ??
            "",
    });

    const updatedRollNumber = normalizeRollNumber(
        normalizedUpdates.rollNumber
    );

    if (!updatedRollNumber) {
        throw new Error("Roll number is required.");
    }

    const duplicate = students.some(
        (student) =>
            normalizeStudentId(student.id) !== targetId &&
            normalizeRollNumber(student.rollNumber ?? student.rollNo) ===
            updatedRollNumber
    );

    if (duplicate) {
        throw new Error("This roll number already exists.");
    }

    const updatedStudent = {
        ...currentStudent,
        ...normalizedUpdates,
        id: currentStudent.id,
        createdAt: currentStudent.createdAt,
        updatedAt: new Date().toISOString(),
    };

    const updatedStudents = [...students];
    updatedStudents[index] = updatedStudent;

    writeStudents(updatedStudents);

    return updatedStudent;
}

export function deleteManagedStudent(studentId) {
    const students = readStudents();
    const targetId = normalizeStudentId(studentId);

    const studentExists = students.some(
        (student) => normalizeStudentId(student.id) === targetId
    );

    if (!studentExists) {
        throw new Error("Student not found.");
    }

    const updatedStudents = students.filter(
        (student) => normalizeStudentId(student.id) !== targetId
    );

    writeStudents(updatedStudents);

    return true;
}

export function clearManagedStudents() {
    writeStudents([]);
}
