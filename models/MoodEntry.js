export default class MoodEntry {
  constructor({
    id = crypto.randomUUID(),
    mood,
    note = "",
    date = new Date().toISOString(),
    userId = null
  }) {
    this.id = id;
    this.mood = mood;
    this.note = note;
    this.date = date;
    this.userId = userId;
  }

  getMoodLabel() {
    const labels = {
      1: "Muito mal",
      2: "Mal",
      3: "Neutro",
      4: "Bem",
      5: "Muito bem"
    };

    return labels[this.mood] || "Não definido";
  }

  getMoodEmoji() {
    const emojis = {
      1: "😣",
      2: "😟",
      3: "😐",
      4: "🙂",
      5: "😄"
    };

    return emojis[this.mood] || "❔";
  }

  isPositiveMood() {
    return this.mood >= 4;
  }

  isNegativeMood() {
    return this.mood <= 2;
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
    return `${this.getMoodEmoji()} ${this.getMoodLabel()} — ${this.getFormattedDate()}`;
  }
}