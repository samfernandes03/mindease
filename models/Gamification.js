export default class Gamification {
  constructor({
    points = 0,
    level = 1,
    badges = [],
    completedActivities = 0,
    focusSessions = 0,
    moodEntries = 0
  } = {}) {
    this.points = points;
    this.level = level;
    this.badges = badges;
    this.completedActivities = completedActivities;
    this.focusSessions = focusSessions;
    this.moodEntries = moodEntries;
  }

  addPoints(points) {
    this.points += points;
    this.updateLevel();
    this.updateBadges();
  }

  addCompletedActivity(points = 10) {
    this.completedActivities += 1;
    this.addPoints(points);
  }

  addFocusSession(points = 15) {
    this.focusSessions += 1;
    this.addPoints(points);
  }

  addMoodEntry(points = 5) {
    this.moodEntries += 1;
    this.addPoints(points);
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

  updateBadges() {
    if (this.completedActivities >= 1) {
      this.addBadge("First Activity");
    }

    if (this.completedActivities >= 5) {
      this.addBadge("Well-being Explorer");
    }

    if (this.focusSessions >= 3) {
      this.addBadge("Focused Mind");
    }

    if (this.moodEntries >= 3) {
      this.addBadge("Self-Awareness");
    }

    if (this.points >= 100) {
      this.addBadge("Early Consistency");
    }
  }

  addBadge(badgeName) {
    if (!this.badges.includes(badgeName)) {
      this.badges.push(badgeName);
    }
  }

  getLevelLabel() {
    const labels = {
      1: "Beginner",
      2: "Consistent",
      3: "Focused",
      4: "Well-Being Master"
    };

    return labels[this.level] || "Beginner";
  }

  getProgressToNextLevel() {
    if (this.level === 1) {
      return Math.min((this.points / 100) * 100, 100);
    }

    if (this.level === 2) {
      return Math.min(((this.points - 100) / 100) * 100, 100);
    }

    if (this.level === 3) {
      return Math.min(((this.points - 200) / 100) * 100, 100);
    }

    return 100;
  }

  toJSON() {
    return {
      points: this.points,
      level: this.level,
      badges: this.badges,
      completedActivities: this.completedActivities,
      focusSessions: this.focusSessions,
      moodEntries: this.moodEntries
    };
  }
}