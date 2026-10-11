
import { Moon, Sun, Palette, CheckCircle2, Info } from "lucide-react";
import { useStudents } from "../context/StudentContext";

export default function Settings() {
  const { theme, toggleTheme } = useStudents();

  const isDark = theme === "dark";

  return (
    <div className="settings-page">
      <section className="settings-page-header">
        <div className="settings-eyebrow">
          <Palette size={16} />
          Preferences
        </div>

        <h1 className="settings-page-title">Settings</h1>

        <p className="settings-page-description">
          Customize StudentHub Pro to match your preferences.
        </p>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-section-icon">
            {isDark ? <Moon size={21} /> : <Sun size={21} />}
          </div>

          <div>
            <h2>Appearance</h2>
            <p>Choose how StudentHub Pro looks on your device.</p>
          </div>
        </div>

        <div className="settings-theme-options">
          <button
            type="button"
            className={`settings-theme-option ${
              !isDark ? "settings-theme-selected" : ""
            }`}
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            aria-pressed={!isDark}
          >
            <div className="settings-theme-preview settings-preview-light">
              <div className="settings-preview-sidebar" />
              <div className="settings-preview-content">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="settings-theme-label">
              <Sun size={17} />
              <span>Light mode</span>
              {!isDark && <CheckCircle2 size={17} />}
            </div>
          </button>

          <button
            type="button"
            className={`settings-theme-option ${
              isDark ? "settings-theme-selected" : ""
            }`}
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            aria-pressed={isDark}
          >
            <div className="settings-theme-preview settings-preview-dark">
              <div className="settings-preview-sidebar" />
              <div className="settings-preview-content">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="settings-theme-label">
              <Moon size={17} />
              <span>Dark mode</span>
              {isDark && <CheckCircle2 size={17} />}
            </div>
          </button>
        </div>
      </section>

      <section className="settings-section settings-about">
        <div className="settings-section-heading">
          <div className="settings-section-icon">
            <Info size={21} />
          </div>

          <div>
            <h2>About StudentHub Pro</h2>
            <p>Application information</p>
          </div>
        </div>

        <div className="settings-about-details">
          <div>
            <span>Application</span>
            <strong>StudentHub Pro</strong>
          </div>

          <div>
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

          <div>
            <span>Current theme</span>
            <strong>{isDark ? "Dark mode" : "Light mode"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
