function getUserInfo() {
  fetch("http://localhost:5000/me", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    headers: {
      Authorization: localStorage.getItem("userInfo"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("name", data.name);
      document.getElementById("welcomeMessage").textContent =
        "Welcome " + localStorage.getItem("name");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getOneNote(id) {
  fetch(`http://localhost:5000/notes/${id}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    headers: {
      Authorization: localStorage.getItem("userInfo"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".noteTitle").textContent = data.title;
      document.getElementById("noteBody").textContent = data.content;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getUserNotes() {
  fetch("http://localhost:5000/notes/", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    headers: {
      Authorization: localStorage.getItem("userInfo"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("userNotes", JSON.stringify(data));
      let userNotes = data;

      var str = "<ul id='noteslist'>";
      userNotes.forEach((note) => {
        str += `<li data-attribute=${note._id}>` + note.title + "</li>";
      });
      str += "</ul>";
      document.getElementById("notes").innerHTML = str;

      // Detect click on list
      var noteslist = document.getElementById("noteslist");
      noteslist.addEventListener("click", function (e) {
        // Remove selection from other notes
        var x = document.getElementsByClassName("activeNote");

        [].forEach.call(x, function (el) {
          el.classList.remove("activeNote");
        });

        // Add selection to selected note
        if (e.target.tagName === "LI") {
          var selectedNote = e.target;
          selectedNote.classList.add("activeNote");
          document.getElementById("editButton").style.display = "block";
          document.getElementById("deleteButton").style.display = "block";
          document.getElementById("saveButton").style.display = "none";
          document.getElementById("noteInputTitle").style.display = "none";
          document.getElementById("noteInputContent").style.display = "none";

          document.querySelector(".noteTitle").style.display = "block";
          document.getElementById("noteBody").style.display = "block";

          // Get note data
          getOneNote(e.target.getAttribute("data-attribute"));
          localStorage.setItem(
            "selectedNote",
            e.target.getAttribute("data-attribute")
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Create note
document.getElementById("newNote").addEventListener("click", (event) => {
  document.getElementById("noteInputTitle").value = "";
  document.getElementById("noteInputContent").value = "";

  localStorage.removeItem("selectedNote");
  document.querySelector(".noteTitle").style.display = "none";
  document.getElementById("noteBody").style.display = "none";
  document.getElementById("editButton").style.display = "none";
  document.getElementById("deleteButton").style.display = "none";
  document.getElementById("saveButton").style.display = "block";
  var x = document.getElementsByClassName("activeNote");
  [].forEach.call(x, function (el) {
    el.classList.remove("activeNote");
  });

  document.getElementById("noteInputTitle").style.display = "block";
  document.getElementById("noteInputContent").style.display = "block";
});

// Delete note
document.getElementById("deleteButton").addEventListener("click", (event) => {
  fetch(`http://localhost:5000/notes/${localStorage.getItem("selectedNote")}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    headers: {
      Authorization: localStorage.getItem("userInfo"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success == "Success") {
        localStorage.removeItem("selectedNote");
        document.getElementById("editButton").style.display = "none";
        document.getElementById("deleteButton").style.display = "none";
        document.querySelector(".noteTitle").textContent = "Select a note.";
        document.getElementById("noteBody").textContent = "";
        getUserNotes();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Create new form
const form = document.getElementById("editorForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let title = form.elements["noteInputTitle"].value;
  let content = form.elements["noteInputContent"].value;
  let statusCode;
  createNewNote(title, content, statusCode);
});

function createNewNote(title, content, statusCode) {
  if (localStorage.getItem("selectedNote") == null) {
    fetch("http://localhost:5000/notes/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("userInfo"),
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((data) => {
        if (data.title == "Title is required") {
          document.getElementById("titleRequired").style.display = "block";
        } else {
          document.getElementById("titleRequired").style.display = "none";
        }
        if (data.content == "Content is required") {
          document.getElementById("contentRequired").style.display = "block";
        } else {
          document.getElementById("contentRequired").style.display = "none";
        }

        if (
          data.title != "Title is required" &&
          data.content != "Content is required"
        ) {
          if (statusCode == 200) {
            getUserNotes();

            document.getElementById("saveButton").style.display = "none";
            document.getElementById("noteInputTitle").value = "";
            document.getElementById("noteInputContent").value = "";
            document.getElementById("noteInputTitle").style.display = "none";
            document.getElementById("noteInputContent").style.display = "none";
            document.querySelector(".noteTitle").textContent = data.title;
            document.getElementById("noteBody").textContent = data.content;
            document.querySelector(".noteTitle").style.display = "block";
            document.getElementById("noteBody").style.display = "block";
            localStorage.setItem("selectedNote", data._id);
            document.getElementById("deleteButton").style.display = "block";
            document.getElementById("editButton").style.display = "block";
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function updateNote(title, content, statusCode) {
  fetch(`http://localhost:5000/notes/${localStorage.getItem("selectedNote")}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("userInfo"),
    },
    body: JSON.stringify({ title, content }),
  })
    .then((response) => {
      statusCode = response.status;
      return response.json();
    })
    .then((data) => {
      if (data.title == "Title is required") {
        document.getElementById("titleRequired").style.display = "block";
      } else {
        document.getElementById("titleRequired").style.display = "none";
      }
      if (data.content == "Content is required") {
        document.getElementById("contentRequired").style.display = "block";
      } else {
        document.getElementById("contentRequired").style.display = "none";
      }
      if (
        data.title != "Title is required" &&
        data.content != "Content is required"
      ) {
        if (statusCode == 200) {
          getUserNotes();

          document.getElementById("saveButton").style.display = "none";
          document.getElementById("noteInputTitle").value = "";
          document.getElementById("noteInputContent").value = "";
          document.getElementById("noteInputTitle").style.display = "none";
          document.getElementById("noteInputContent").style.display = "none";
          document.querySelector(".noteTitle").textContent = data.title;
          document.getElementById("noteBody").textContent = data.content;
          document.querySelector(".noteTitle").style.display = "block";
          document.getElementById("noteBody").style.display = "block";
          localStorage.setItem("selectedNote", data._id);
          document.getElementById("deleteButton").style.display = "block";
          document.getElementById("editButton").style.display = "block";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Detect edit button
document.getElementById("editButton").addEventListener("click", (event) => {
  fetch(`http://localhost:5000/notes/${localStorage.getItem("selectedNote")}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    headers: {
      Authorization: localStorage.getItem("userInfo"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".noteTitle").style.display = "none";
      document.getElementById("noteBody").style.display = "none";
      document.getElementById("noteInputTitle").value = data.title;
      document.getElementById("noteInputContent").value = data.content;
      document.getElementById("noteInputTitle").style.display = "block";
      document.getElementById("noteInputContent").style.display = "block";
      document.getElementById("deleteButton").style.display = "none";
      document.getElementById("editButton").style.display = "none";
      document.getElementById("saveButton").style.display = "block";

      const form = document.getElementById("editorForm");
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        let title = form.elements["noteInputTitle"].value;
        let content = form.elements["noteInputContent"].value;
        let statusCode;
        updateNote(title, content, statusCode);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("signOut").addEventListener("click", (event) => {
  localStorage.clear();
  document.location.replace("index.html");
});

document.addEventListener("DOMContentLoaded", function () {
  var token = localStorage.getItem("userInfo");

  // check if user is logged in
  if (token == null) {
    document.location.replace("index.html");
  } else {
    getUserInfo();
    getUserNotes();
  }
});
