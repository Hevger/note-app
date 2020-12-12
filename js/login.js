const form = document.getElementById("loginForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let email = form.elements["email"].value;
  let password = form.elements["password"].value;

  fetch("http://localhost:5000/login", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.email === "Email is not valid") {
        document.getElementById("emailRequired").style.display = "block";
      }
      if (data.password === "Password is required") {
        document.getElementById("passwordRequired").style.display = "block";
      } else if (
        data.error === "Please provide a valid username and password."
      ) {
        document.getElementById("wrongLogin").style.display = "block";
      } else if (data.token) {
        localStorage.setItem("userInfo", data.token);
        document.location.replace("dashboard.html");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  var token = localStorage.getItem("userInfo");

  // check if already logged in
  if (token != null) {
    document.location.replace("dashboard.html");
  }
});
