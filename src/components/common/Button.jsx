
import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    type = "button",
    className = "",
    disabled = false,
    onClick,
    ...props
  },
  ref
) {
  const buttonClassName = [
    "btn",
    `btn-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
