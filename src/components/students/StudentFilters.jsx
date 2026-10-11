
import { ArrowDownUp, Filter, RotateCcw } from "lucide-react";
import Button from "../common/Button";

export default function StudentFilters({
  departments,
  department,
  onDepartmentChange,
  year,
  onYearChange,
  sortBy,
  onSortChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <section className="student-filters" aria-label="Student filters">
      <div className="student-filters-heading">
        <div className="student-filters-title">
          <Filter size={17} />
          <span>Filters</span>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClear}>
            <RotateCcw size={15} />
            Clear filters
          </Button>
        )}
      </div>

      <div className="student-filters-controls">
        <div className="student-filter-field">
          <label htmlFor="student-department-filter">
            Department
          </label>

          <select
            id="student-department-filter"
            className="form-control"
            value={department}
            onChange={(event) =>
              onDepartmentChange(event.target.value)
            }
          >
            <option value="all">All departments</option>

            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="student-filter-field">
          <label htmlFor="student-year-filter">
            Academic year
          </label>

          <select
            id="student-year-filter"
            className="form-control"
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
          >
            <option value="all">All years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>

        <div className="student-filter-field">
          <label htmlFor="student-sort-filter">
            <ArrowDownUp size={14} />
            Sort by
          </label>

          <select
            id="student-sort-filter"
            className="form-control"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="name">Name (A–Z)</option>
            <option value="rollNo">Roll number</option>
            <option value="year">Academic year</option>
          </select>
        </div>
      </div>
    </section>
  );
}
