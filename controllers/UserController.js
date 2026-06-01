import User from "../models/User.js";

class UserController {
  static login(email, password) {
    const user = User.findByEmail(email);

    if (!user) {
      return { success: false, message: "This email is not registered." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password." };
    }

    localStorage.setItem("session", JSON.stringify(user));

    return { success: true };
  }
}

export default UserController;
