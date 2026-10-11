
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

function StudentDeleteDialog({
  open,
  student,
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isDeleting, onCancel]);

  if (!open || !student) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !isDeleting) {
      onCancel?.();
    }
  }

  async function handleConfirm() {
    if (isDeleting) return;

    await onConfirm?.(student);
  }

  return createPortal(
    <div
      className="sm-delete-overlay"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <section
        className="sm-delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sm-delete-title"
        aria-describedby="sm-delete-description"
      >
        <button
          type="button"
          className="sm-delete-close"
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Close confirmation dialog"
        >
          <X size={19} />
        </button>

        <div className="sm-delete-icon">
          <AlertTriangle size={27} />
        </div>

        <h2 id="sm-delete-title">Delete Student?</h2>

        <p id="sm-delete-description">
          Are you sure you want to delete{" "}
          <strong>{student.name}</strong>
          {student.rollNumber ? (
            <>
              {" "}({student.rollNumber})
            </>
          ) : null}
          ? This action cannot be undone.
        </p>

        <div className="sm-delete-actions">
          <button
            type="button"
            className="sm-delete-cancel-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="sm-delete-confirm-button"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

export default StudentDeleteDialog;
