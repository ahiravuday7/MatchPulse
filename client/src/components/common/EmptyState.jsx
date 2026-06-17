export const EmptyState = ({ title = "No data found", message }) => {
  return (
    <div className="state-card">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
  );
};
