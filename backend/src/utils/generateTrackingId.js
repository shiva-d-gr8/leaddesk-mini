const generateTrackingId = () => {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `LD-${date}-${randomPart}`;
};

module.exports = generateTrackingId;