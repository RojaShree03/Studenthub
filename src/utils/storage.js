
const FAVOURITES_KEY = "studenthub_favourites";
const THEME_KEY = "studenthub_theme";

function readStorage(key, fallback) {
    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return fallback;
        }

        return JSON.parse(storedValue);
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

function normalizeFavouriteIds(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    const validIds = value.filter((id) => {
        if (typeof id === "number") {
            return Number.isSafeInteger(id) && id > 0;
        }

        if (typeof id === "string") {
            return id.trim().length > 0;
        }

        return false;
    });

    return [
        ...new Set(validIds.map((id) =>
            typeof id === "string" ? id.trim() : id
        )),
    ];
}

export function getFavouriteIds() {
    return normalizeFavouriteIds(
        readStorage(FAVOURITES_KEY, [])
    );
}

export function saveFavouriteIds(favouriteIds) {
    return writeStorage(
        FAVOURITES_KEY,
        normalizeFavouriteIds(favouriteIds)
    );
}

export function getSavedTheme() {
    const theme = readStorage(THEME_KEY, "light");

    return theme === "dark" ? "dark" : "light";
}

export function saveTheme(theme) {
    if (theme !== "light" && theme !== "dark") {
        return false;
    }

    return writeStorage(THEME_KEY, theme);
}
