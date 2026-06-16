export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

//This gives today’s date in API-Football format:
