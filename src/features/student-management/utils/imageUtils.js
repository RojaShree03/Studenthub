
export const MAX_IMAGE_SIZE_MB = 5;

export const MAX_IMAGE_SIZE_BYTES =
  MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * Validate a selected image file.
 *
 * Returns:
 * { valid: true, error: "" }
 * or
 * { valid: false, error: "..." }
 */
export function validateStudentImage(file) {
  if (!file) {
    return {
      valid: false,
      error: "Please select an image.",
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG and WebP images are allowed.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "The selected image is empty.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size must be ${MAX_IMAGE_SIZE_MB} MB or less.`,
    };
  }

  return {
    valid: true,
    error: "",
  };
}

/**
 * Convert an image File into a Base64 data URL.
 *
 * The returned string can be used for image previews
 * and localStorage persistence.
 */
export function imageFileToDataUrl(file) {
  const validation = validateStudentImage(file);

  if (!validation.valid) {
    return Promise.reject(
      new Error(validation.error)
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(
          new Error("Unable to read the selected image.")
        );
      }
    };

    reader.onerror = () => {
      reject(
        new Error("Failed to read the image file.")
      );
    };

    reader.onabort = () => {
      reject(
        new Error("Image reading was cancelled.")
      );
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Return a readable file size.
 */
export function formatImageFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 Bytes";
  }

  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Check whether a value is an image data URL
 * with an allowed image MIME type.
 */
export function isValidImageDataUrl(value) {
  if (typeof value !== "string") {
    return false;
  }

  return /^data:image\/(jpeg|png|webp);base64,/i.test(value);
}

/**
 * Return the image extension associated with a MIME type.
 */
export function getImageExtension(mimeType) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensions[mimeType] || null;
}
