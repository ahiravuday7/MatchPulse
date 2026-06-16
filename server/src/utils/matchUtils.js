// Match Status Helper
const FINISHED_STATUS_CODES = ["FT", "AET", "PEN"];

export const isFinishedMatch = (fixture) => {
  if (!fixture) {
    return false;
  }

  return FINISHED_STATUS_CODES.includes(fixture.fixture.status.short);
};
