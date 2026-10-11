
import { Heart, Search, Users } from "lucide-react";
import Button from "./Button";

const defaultIcons = {
  heart: Heart,
  search: Search,
  users: Users,
};

export default function EmptyState({
  icon = "users",
  title = "Nothing here yet",
  description = "There is no data to display right now.",
  actionLabel,
  onAction,
}) {
  const Icon = defaultIcons[icon] ?? Users;

  return (
    <section
      className="empty-state"
      aria-label={title}
    >
      <div className="empty-state-icon" aria-hidden="true">
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <h2 className="empty-state-title">{title}</h2>

      <p className="empty-state-description">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  );
}
