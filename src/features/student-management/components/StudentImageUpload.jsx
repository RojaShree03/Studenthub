import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  X,
  UserRound,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function StudentImageUpload({
  value = "",
  onChange,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  function openFilePicker() {
    if (disabled) return;

    setError("");
    inputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again.
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Unable to generate the image preview.");
        return;
      }

      setPreview(reader.result);
      setError("");
      onChange?.(reader.result, file);
    };

    reader.onerror = () => {
      setError("Unable to read the image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    if (disabled) return;

    setPreview("");
    setError("");
    onChange?.("", null);
  }

  return (
    <div className="sm-image-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        hidden
        aria-label="Select student profile image"
      />

      <div className="sm-image-upload-preview">
        {preview ? (
          <img
            src={preview}
            alt="Student profile preview"
            className="sm-uploaded-image"
            onError={() => {
              setError("Unable to display the selected image.");
            }}
          />
        ) : (
          <div className="sm-image-placeholder">
            <UserRound size={42} strokeWidth={1.5} />
          </div>
        )}

        <button
          type="button"
          className="sm-image-camera-button"
          onClick={openFilePicker}
          disabled={disabled}
          aria-label="Upload student profile image"
          title="Upload profile image"
        >
          <Camera size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="sm-image-upload-info">
        <h4>Profile Photo</h4>

        <p>JPG, PNG, or WebP · Maximum 5 MB</p>

        <div className="sm-image-upload-actions">
          <button
            type="button"
            className="sm-image-select-button"
            onClick={openFilePicker}
            disabled={disabled}
          >
            <ImagePlus size={16} aria-hidden="true" />
            {preview ? "Change Photo" : "Choose Photo"}
          </button>

          {preview && (
            <button
              type="button"
              className="sm-image-remove-button"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <X size={16} aria-hidden="true" />
              Remove
            </button>
          )}
        </div>

        {error && (
          <p className="sm-image-upload-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentImageUpload;