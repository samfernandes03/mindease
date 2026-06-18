export function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);

  if (!input) return;

  input.type = input.type === "password" ? "text" : "password";

  if (button) {
    button.setAttribute(
      "aria-label",
      input.type === "password" ? "Mostrar password" : "Esconder password"
    );
  }
}