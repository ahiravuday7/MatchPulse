export const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="state-card error-state">
      <h2>Unable to load data</h2>
      <p>{message}</p>

      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
