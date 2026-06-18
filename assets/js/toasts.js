export function showToast(message, type = "success", duration = 3000) {
  const container = document.querySelector(".toast-container");

  if (!container) {
    console.warn("Toast container missing. Add <div class='toast-container'></div>");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}