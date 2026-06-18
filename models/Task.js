export default class Task {
  constructor({
    id = crypto.randomUUID(),
    title,
    category = "Geral",
    mentalLoad = "Medium",
    energy = "Medium",
    dueDate = "",
    status = "Pending",
    userId = null,
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.mentalLoad = mentalLoad;
    this.energy = energy;
    this.dueDate = dueDate;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  markAsDone() {
    this.status = "Done";
  }

  markAsPending() {
    this.status = "Pending";
  }

  toggleStatus() {
    this.status = this.status === "Done" ? "Pending" : "Done";
  }

  isDone() {
    return this.status === "Done";
  }

  isPending() {
    return this.status === "Pending";
  }

  isOverdue() {
    if (!this.dueDate || this.isDone()) return false;

    const today = new Date();
    const due = new Date(this.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }

  getStatusLabel() {
    if (this.isDone()) return "Concluída";
    if (this.isOverdue()) return "Atrasada";
    return "Pendente";
  }

  getEnergyLabel() {
    const labels = {
      Low: "Baixa",
      Medium: "Média",
      High: "Alta"
    };

    return labels[this.energy] || this.energy;
  }

  getMentalLoadLabel() {
    const labels = {
      Low: "Baixa",
      Medium: "Média",
      High: "Alta"
    };

    return labels[this.mentalLoad] || this.mentalLoad;
  }

  getSummary() {
    return `${this.title} — ${this.category} — ${this.getStatusLabel()}`;
  }
}