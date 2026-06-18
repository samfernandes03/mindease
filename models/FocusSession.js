export default class FocusSession {
  constructor({
    id = crypto.randomUUID(),
    mode = "light",
    duration = 25,
    breakDuration = 5,
    completed = false,
    date = new Date().toISOString(),
    userId = null
  } = {}) {
    this.id = id;
    this.mode = mode;
    this.duration = duration;
    this.breakDuration = breakDuration;
    this.completed = completed;
    this.date = date;
    this.userId = userId;
  }

  completeSession() {
    this.completed = true;
  }

  getModeLabel() {
    const labels = {
      light: "Foco Leve",
      deep: "Foco Profundo"
    };

    return labels[this.mode] || "Foco Leve";
  }

  getTotalTime() {
    return this.duration + this.breakDuration;
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString();
  }

  getFormattedTime() {
    return new Date(this.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  getSummary() {
    return `${this.getModeLabel()} — ${this.duration} min`;
  }

  isDeepFocus() {
    return this.mode === "deep";
  }
}