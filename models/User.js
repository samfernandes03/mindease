export default class User {
  constructor(name, email, password, role = "user") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Get all users from localStorage
  static getAll() {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  }

  // Save all users to localStorage
  static saveAll(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Find user by email
  static findByEmail(email) {
    return this.getAll().find(u => u.email === email);
  }
}
