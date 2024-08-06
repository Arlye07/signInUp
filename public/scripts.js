// scripts.js
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const overlayBtn = document.getElementById("overlayBtn");
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const switchToSignup = document.getElementById("switch-to-signup");

  // Toggle the container to switch between sign up and sign in
  overlayBtn.addEventListener("click", () => {
    container.classList.toggle("right-panel-active");

    overlayBtn.classList.remove("btnScaled");
    window.requestAnimationFrame(() => {
      overlayBtn.classList.add("btnScaled");
    });
  });

  signUpButton.addEventListener("click", () => {
    console.log("Sign Up button clicked"); // Agrega esto para verificar si el clic es detectado
    container.classList.add("right-panel-active");
  });
  

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  switchToSignup.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  // Handle login form submission
  document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.querySelector('#login-form input[name="email"]').value;
    const password = document.querySelector('#login-form input[name="password"]').value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    const messageElement = document.getElementById("login-message");
    if (result.success) {
      messageElement.classList.add("success");
    } else {
      messageElement.classList.remove("success");
    }
    messageElement.innerText = result.message;
  });

  // Handle register form submission
  document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.querySelector('#register-form input[name="username"]').value;
    const email = document.querySelector('#register-form input[name="email"]').value;
    const password = document.querySelector('#register-form input[name="password"]').value;

    const response = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    const messageElement = document.getElementById("register-message");
    if (result.success) {
      messageElement.classList.add("success");
    } else {
      messageElement.classList.remove("success");
    }
    messageElement.innerText = result.message;
  });
});

