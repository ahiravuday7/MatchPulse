const getEventIcon = (event) => {
  if (event.type === "Goal") return "⚽";
  if (event.type === "Card") return event.detail?.includes("Red") ? "🟥" : "🟨";
  if (event.type === "subst") return "🔁";
  if (event.type === "Var") return "VAR";

  return "•";
};

const getEventMinute = (time) => {
  if (!time) return "";

  if (time.extra) {
    return `${time.elapsed}+${time.extra}'`;
  }

  return `${time.elapsed}'`;
};

export const MatchEventsTimeline = ({ events = [], homeTeamId }) => {
  if (events.length === 0) {
    return (
      <section className="details-panel">
        <h2>Match Events</h2>
        <p className="muted-text">No match events available.</p>
      </section>
    );
  }

  return (
    <section className="details-panel">
      <h2>Match Events</h2>

      <div className="events-timeline">
        {events.map((event, index) => {
          const isHomeEvent = event.team?.id === homeTeamId;

          return (
            <div
              key={`${event.time?.elapsed}-${event.type}-${event.player?.id || index}`}
              className={
                isHomeEvent ? "event-row home-event" : "event-row away-event"
              }
            >
              <div className="event-minute">{getEventMinute(event.time)}</div>

              <div className="event-content">
                <span className="event-icon">{getEventIcon(event)}</span>

                <div>
                  <strong>{event.player?.name || "Unknown player"}</strong>

                  <p>
                    {event.detail || event.type}
                    {event.assist?.name
                      ? ` • Assist: ${event.assist.name}`
                      : ""}
                  </p>

                  {event.comments && <small>{event.comments}</small>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* This component shows match events.

Examples of events:

12' ⚽ Saka
35' 🟨 Caicedo
64' 🔁 Martinelli
80' 🟥 Defender */
