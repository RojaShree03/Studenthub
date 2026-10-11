
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  UserRound,
  X,
  RotateCcw,
  UserRoundPlus,
  LoaderCircle,
} from "lucide-react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const EMPTY_FORM = {
  name: "",
  rollNo: "",
  email: "",
  phone: "",
  department: "",
  year: "",
};

function getFormValues(student) {
  return {
    name: student?.name ?? "",
    rollNo: student?.rollNo ?? student?.rollNumber ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? student?.mobile ?? "",
    department: student?.department ?? "",
    year: student?.year ? String(student.year) : "",
  };
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read the selected photo."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected photo."));
    };

    reader.readAsDataURL(file);
  });
}

function scrollToElement(element) {
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

export default function StudentForm({
  initialStudent = null,
  onSubmit,
  onCancel,
}) {
  const formRef = useRef(null);
  const firstErrorRef = useRef(null);
  const photoInputRef = useRef(null);

  const [formData, setFormData] = useState(() =>
    getFormValues(initialStudent)
  );

  const [photo, setPhoto] = useState(
    initialStudent?.image || initialStudent?.profileImage || ""
  );

  const [photoChanged, setPhotoChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(getFormValues(initialStudent));
    setPhoto(initialStudent?.image || initialStudent?.profileImage || "");
    setPhotoChanged(false);
    setErrors({});
    setSubmitError("");
  }, [initialStudent]);

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again.
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSubmitError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setSubmitError("The photo must be smaller than 5 MB.");
      return;
    }

    try {
      const imageData = await readImage(file);

      setPhoto(imageData);
      setPhotoChanged(true);
      setSubmitError("");
    } catch (error) {
      setSubmitError(
        error?.message || "Unable to load the selected photo."
      );
    }
  }

  function removePhoto() {
    setPhoto("");
    setPhotoChanged(true);
    setSubmitError("");
  }

  function validate() {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Student name is required.";
    }

    if (!formData.rollNo.trim()) {
      nextErrors.rollNo = "Roll number is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.department.trim()) {
      nextErrors.department = "Department is required.";
    }

    if (!formData.year) {
      nextErrors.year = "Select an academic year.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        const firstInvalidField = formRef.current?.querySelector(
          '[aria-invalid="true"]'
        );

        scrollToElement(firstInvalidField || firstErrorRef.current);

        firstInvalidField?.focus({ preventScroll: true });
      });

      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim(),
        rollNumber: formData.rollNo.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mobile: formData.phone.trim(),
        department: formData.department.trim(),
        year: Number(formData.year),

        // The context saves this image to IndexedDB.
        // It should not be persisted as Base64 in localStorage.
        image: photo,
        profileImage: photo,
      };

      await onSubmit(payload);
    } catch (error) {
      setSubmitError(
        error?.message ||
        "Unable to save the student. Please try again."
      );

      requestAnimationFrame(() => {
        scrollToElement(firstErrorRef.current);
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData(getFormValues(initialStudent));
    setPhoto(initialStudent?.image || initialStudent?.profileImage || "");
    setPhotoChanged(false);
    setErrors({});
    setSubmitError("");
  }

  return (
    <form
      ref={formRef}
      className="sm-student-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <section className="sm-form-section">
        <div className="sm-form-section-heading">
          <h3>Student Information</h3>
          <p>Enter the student's basic details.</p>
        </div>

        <div className="sm-image-upload">
          <div className="sm-image-upload-preview">
            {photo ? (
              <img
                src={photo}
                alt="Student profile"
                className="sm-uploaded-image"
              />
            ) : (
              <div className="sm-image-placeholder">
                <UserRound size={42} />
              </div>
            )}

            <button
              type="button"
              className="sm-image-camera-button"
              aria-label="Choose profile photo"
              onClick={() => photoInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="sm-image-upload-info">
            <h4>Profile Photo</h4>
            <p>JPG, PNG, or WebP · Maximum 5 MB</p>

            <div className="sm-image-upload-actions">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                hidden
              />

              <button
                type="button"
                className="sm-primary-button sm-image-select-button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImagePlus size={17} />
                {photo ? "Change Photo" : "Choose Photo"}
              </button>

              {photo && (
                <button
                  type="button"
                  className="sm-secondary-button sm-image-remove-button"
                  onClick={removePhoto}
                  disabled={isSubmitting}
                >
                  <X size={17} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="sm-form-grid">
          <div className="sm-form-field">
            <label htmlFor="student-name">
              Student Name <span>*</span>
            </label>
            <input
              id="student-name"
              name="name"
              value={formData.name}
              onChange={updateField}
              placeholder="Enter student name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "student-name-error" : undefined
              }
              disabled={isSubmitting}
            />
            {errors.name && (
              <span
                id="student-name-error"
                className="sm-field-error"
              >
                {errors.name}
              </span>
            )}
          </div>

          <div className="sm-form-field">
            <label htmlFor="student-roll">
              Roll Number <span>*</span>
            </label>
            <input
              id="student-roll"
              name="rollNo"
              value={formData.rollNo}
              onChange={updateField}
              placeholder="Enter roll number"
              aria-invalid={Boolean(errors.rollNo)}
              aria-describedby={
                errors.rollNo ? "student-roll-error" : undefined
              }
              disabled={isSubmitting}
            />
            {errors.rollNo && (
              <span
                id="student-roll-error"
                className="sm-field-error"
              >
                {errors.rollNo}
              </span>
            )}
          </div>

          <div className="sm-form-field">
            <label htmlFor="student-email">
              Email Address <span>*</span>
            </label>
            <input
              id="student-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={updateField}
              placeholder="Enter email address"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "student-email-error" : undefined
              }
              disabled={isSubmitting}
            />
            {errors.email && (
              <span
                id="student-email-error"
                className="sm-field-error"
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className="sm-form-field">
            <label htmlFor="student-phone">Phone Number</label>
            <input
              id="student-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={updateField}
              placeholder="Enter phone number"
              autoComplete="tel"
              disabled={isSubmitting}
            />
          </div>

          <div className="sm-form-field">
            <label htmlFor="student-department">
              Department <span>*</span>
            </label>
            <input
              id="student-department"
              name="department"
              value={formData.department}
              onChange={updateField}
              placeholder="Enter department"
              aria-invalid={Boolean(errors.department)}
              aria-describedby={
                errors.department
                  ? "student-department-error"
                  : undefined
              }
              disabled={isSubmitting}
            />
            {errors.department && (
              <span
                id="student-department-error"
                className="sm-field-error"
              >
                {errors.department}
              </span>
            )}
          </div>

          <div className="sm-form-field">
            <label htmlFor="student-year">
              Academic Year <span>*</span>
            </label>
            <select
              id="student-year"
              name="year"
              value={formData.year}
              onChange={updateField}
              aria-invalid={Boolean(errors.year)}
              aria-describedby={
                errors.year ? "student-year-error" : undefined
              }
              disabled={isSubmitting}
            >
              <option value="">Select academic year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            {errors.year && (
              <span
                id="student-year-error"
                className="sm-field-error"
              >
                {errors.year}
              </span>
            )}
          </div>
        </div>
      </section>

      {submitError && (
        <p
          ref={firstErrorRef}
          className="sm-form-submit-error"
          role="alert"
          tabIndex={-1}
        >
          {submitError}
        </p>
      )}

      <div className="sm-form-actions">
        <button
          type="button"
          className="sm-secondary-button"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="sm-secondary-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="sm-primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="sm-spinner" size={17} />
              Saving...
            </>
          ) : (
            <>
              <UserRoundPlus size={17} />
              {initialStudent ? "Update Student" : "Add Student"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
