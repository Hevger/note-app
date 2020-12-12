const form = document.getElementById("registerForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let name = form.elements["name"].value;
  let email = form.elements["email"].value;
  let password = form.elements["password"].value;
  let repassword = form.elements["repassword"].value;
  let statusCode;
  fetch("http://localhost:5000/register", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, repassword }),
  })
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((data) => {
      console.log(statusCode);
      if (data.name === "Name is required") {
        document.getElementById("nameRequired").style.display = "block";
      } else {
        document.getElementById("nameRequired").style.display = "none";
      }
      if (data.email === "E-mail is not valid") {
        document.getElementById("emailRequired").style.display = "block";
      } else {
        document.getElementById("emailRequired").style.display = "none";
      }
      if (data.password === "Password must be between 6 and 50 characters") {
        document.getElementById("passwordRequired").style.display = "block";
      } else {
        document.getElementById("passwordRequired").style.display = "none";
      }
      if (data.repassword === "Password confirmation is required") {
        document.getElementById("repasswordRequired").style.display = "block";
      } else {
        document.getElementById("repasswordRequired").style.display = "none";
      }
      if (data.errorMessage === "User already exsits") {
        document.getElementById("userExists").style.display = "block";
      } else {
        document.getElementById("userExists").style.display = "none";
      }
      if (statusCode == 200) {
        document.location.replace("index.html");
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
