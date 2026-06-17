export const SourceBadge = ({ source }) => {
  if (!source) return null;

  return (
    <span
      className={source === "cache" ? "source-badge cache" : "source-badge api"}
    >
      {source === "cache" ? "Cache" : "API"}
    </span>
  );
};
