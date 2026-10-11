
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search students...",
}) {
  return (
    <div className="search-bar">
      <Search
        size={18}
        className="search-bar-icon"
        aria-hidden="true"
      />

      <input
        type="search"
        className="search-bar-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search students by name, roll number or email"
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
