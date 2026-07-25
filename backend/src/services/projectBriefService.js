const generateProjectBrief = ({
  projectType,
  budgetRange,
  timeline,
}) => {
  const services = [];

  if (projectType === "Website") {
    services.push(
      "UI/UX Design",
      "Frontend Development"
    );
  }

  if (projectType === "Mobile App") {
    services.push(
      "Mobile Development",
      "Backend API"
    );
  }

  if (projectType === "SaaS Product") {
    services.push(
      "UI/UX Design",
      "Frontend Development",
      "Backend Development",
      "Database Architecture"
    );
  }

  if (projectType === "AI Application") {
    services.push(
      "AI Integration",
      "Backend Development",
      "Database Architecture"
    );
  }

  if (projectType === "Custom Software") {
    services.push(
      "Requirement Analysis",
      "Software Development",
      "System Architecture"
    );
  }

  let estimatedComplexity = "Medium";

  if (
    projectType === "SaaS Product" ||
    projectType === "AI Application"
  ) {
    estimatedComplexity = "High";
  }

  return {
    summary: `${projectType} project with a ${budgetRange} budget and a target timeline of ${timeline}.`,

    recommendedServices: services,

    estimatedComplexity,
  };
};

module.exports = generateProjectBrief;