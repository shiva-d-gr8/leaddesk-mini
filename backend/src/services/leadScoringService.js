const calculateLeadScore = ({
  budgetRange,
  timeline,
  projectType,
  message,
}) => {
  let score = 0;

  const budgetScores = {
    "Under ₹50,000": 10,
    "₹50,000 - ₹2,00,000": 25,
    "₹2,00,000 - ₹5,00,000": 40,
    "Above ₹5,00,000": 50,
  };

  score += budgetScores[budgetRange] || 0;

  const timelineScores = {
    Immediately: 25,
    "Within 1 month": 20,
    "1-3 months": 15,
    "3+ months": 10,
    "Just exploring": 5,
  };

  score += timelineScores[timeline] || 0;

  const projectScores = {
    Website: 5,
    "Mobile App": 10,
    "SaaS Product": 15,
    "AI Application": 15,
    "Custom Software": 10,
  };

  score += projectScores[projectType] || 0;

  if (message.length > 100) {
    score += 10;
  }

  return Math.min(score, 100);
};

const getPriority = (score) => {
  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
};

module.exports = {
  calculateLeadScore,
  getPriority,
};