export default function MessageBanner({ kind = "error", message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`message-banner message-banner--${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
