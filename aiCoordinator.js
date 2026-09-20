export function coordinateEmergency(input = {}) {
  const text = `${input.type || ""} ${input.description || ""}`.toLowerCase();

  let priority = "high";
  if (/(cardiac|heart|unconscious|severe bleeding|stroke|not breathing|breathing difficulty)/.test(text)) {
    priority = "critical";
  } else if (/(fracture|fever|pain|minor)/.test(text)) {
    priority = "medium";
  }

  const recommendedAction =
    priority === "critical"
      ? "Request immediate human EMS review and consider the nearest emergency facility."
      : priority === "high"
        ? "Notify the response coordinator and identify the nearest available medical resource."
        : "Route to an appropriate healthcare service and monitor for worsening symptoms.";

  return {
    priority,
    recommendedAction,
    note: "AI output is decision support only and must not replace qualified medical or emergency professionals."
  };
}
