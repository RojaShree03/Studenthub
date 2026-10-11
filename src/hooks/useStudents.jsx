
import { useMemo, useState } from "react";
import { useStudents as useStudentContext } from "../context/StudentContext";

export default function useStudents({ favouritesOnly = false } = {}) {
  const {
    students = [],
    favouriteIds = [],
  } = useStudentContext();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const departments = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => String(student.department ?? "").trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = students.filter((student) => {
      const name = String(student.name ?? "");
      const rollNumber = String(
        student.rollNumber ?? student.rollNo ?? ""
      );
      const email = String(student.email ?? "");
      const studentDepartment = String(student.department ?? "");
      const studentYear = Number(student.year);

      const matchesSearch =
        name.toLowerCase().includes(normalizedSearch) ||
        rollNumber.toLowerCase().includes(normalizedSearch) ||
        email.toLowerCase().includes(normalizedSearch);

      const matchesDepartment =
        department === "all" ||
        studentDepartment === department;

      const matchesYear =
        year === "all" ||
        studentYear === Number(year);

      const matchesFavourite =
        !favouritesOnly ||
        favouriteIds.some(
          (id) => String(id) === String(student.id)
        );

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesYear &&
        matchesFavourite
      );
    });

    return result.sort((a, b) => {
      const nameA = String(a.name ?? "");
      const nameB = String(b.name ?? "");
      const rollA = String(a.rollNumber ?? a.rollNo ?? "");
      const rollB = String(b.rollNumber ?? b.rollNo ?? "");

      switch (sortBy) {
        case "rollNo":
          return rollA.localeCompare(rollB);

        case "year":
          return (
            Number(a.year ?? 0) - Number(b.year ?? 0) ||
            nameA.localeCompare(nameB)
          );

        case "name":
        default:
          return nameA.localeCompare(nameB);
      }
    });
  }, [
    students,
    favouriteIds,
    search,
    department,
    year,
    sortBy,
    favouritesOnly,
  ]);

  const clearFilters = () => {
    setSearch("");
    setDepartment("all");
    setYear("all");
    setSortBy("name");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    department !== "all" ||
    year !== "all" ||
    sortBy !== "name";

  return {
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
  };
}
