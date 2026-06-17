export default class User {
  constructor({
    id = crypto.randomUUID(),
    name,
    email,
    password = "",
    role = "user",
    favorites = [],
    points = 0,
    level = 1,
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.favorites = favorites;
    this.points = points;
    this.level = level;
    this.createdAt = createdAt;
  }

  isAdmin() {
    return this.role === "admin";
  }

  addFavorite(activityId) {
    if (!this.favorites.includes(activityId)) {
      this.favorites.push(activityId);
    }
  }

  removeFavorite(activityId) {
    this.favorites = this.favorites.filter((id) => id !== activityId);
  }

  hasFavorite(activityId) {
    return this.favorites.includes(activityId);
  }

  addPoints(points) {
    this.points += points;
    this.updateLevel();
  }

  updateLevel() {
    if (this.points >= 300) {
      this.level = 4;
    } else if (this.points >= 200) {
      this.level = 3;
    } else if (this.points >= 100) {
      this.level = 2;
    } else {
      this.level = 1;
    }
  }

  getLevelLabel() {
    const labels = {
      1: "Iniciante",
      2: "Consistente",
      3: "Focado",
      4: "Mestre do Bem-Estar"
    };

    return labels[this.level] || "Iniciante";
  }
}