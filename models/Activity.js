export default class Activity {
  constructor({
    id = crypto.randomUUID(),
    title,
    description = "",
    category = "Bem-estar",
    duration = 5,
    difficulty = "Fácil",
    points = 10,
    tags = [],
    type = "exercise",
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.duration = duration;
    this.difficulty = difficulty;
    this.points = points;
    this.tags = tags;
    this.type = type;
    this.createdAt = createdAt;
  }

  matchesCategory(category) {
    return this.category.toLowerCase() === category.toLowerCase();
  }

  hasTag(tag) {
    return this.tags
      .map((item) => item.toLowerCase())
      .includes(tag.toLowerCase());
  }

  isShortActivity() {
    return this.duration <= 5;
  }

  getDifficultyLabel() {
    const labels = {
      Fácil: "Atividade simples",
      Médio: "Atividade moderada",
      Difícil: "Atividade exigente"
    };

    return labels[this.difficulty] || "Atividade simples";
  }

  getSummary() {
    return `${this.title} — ${this.duration} min — ${this.difficulty}`;
  }
}