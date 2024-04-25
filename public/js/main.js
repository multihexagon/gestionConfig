const inputTitle = document.querySelector("#title");
const inputNote = document.querySelector("#user-note");
const addBtn = document.querySelector(".btn-add");
const empty = document.querySelector(".empty");
const p = document.querySelector("#p");
const btnSearch = document.querySelector("#btn-search");
const wordTo = document.querySelector("#word");

const addNote = async (title, content) => {
  try {
    const response = await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    console.log("New note created:", data);
    location.reload();
  } catch (error) {
    console.error("Error creating note:", error);
  }
};

const deleteNote = async (id) => {
  try {
    const response = await fetch(`/notes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("No se pudo eliminar la nota.");
    }
    const data = await response.json();
    console.log(data.message);
    const noteToDelete = document.querySelector(`.notes[data-id="${id}"]`);
    if (noteToDelete) {
      noteToDelete.remove();
      location.reload();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const editNote = async (id, newTitle, newContent) => {
  try {
    const response = await fetch(`/notes/${id}`, {
      method: "PUT", // Utilizamos el método PUT para actualizar la nota
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle, content: newContent }), // Enviamos los nuevos datos en el cuerpo de la solicitud
    });
    if (!response.ok) {
      throw new Error("No se pudo actualizar la nota.");
    }
    const data = await response.json();
    console.log(data.message); // Muestra el mensaje de éxito o error
  } catch (error) {
    console.error("Error:", error.message);
  }
};

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const title = inputTitle.value;
  const text = inputNote.value;
  const show_notes = document.querySelector(".show-notes");

  if (text === "" || title === "") return;
  else {
    if (p) {
      p.remove();
    }
    show_notes.innerHTML += `<div class="notes"><h2>${title}</h2><div class="text-notes">${text}</div>
    <div>
    <button class="edit-btn"><svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg></button>
    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
    </div>
    </div>`;
    addNote(title, text);
    inputTitle.value = "";
    inputNote.value = "";
  }

  attachEventListeners(); // Reattach event listeners after adding a new note
});

function attachEventListeners() {
  const delete_btns = document.querySelectorAll(".delete-btn");
  delete_btns.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const noteId = e.target.closest(".notes").dataset.id; // Obtener el ID de la nota
      deleteNote(noteId); // Llamar a la función deleteNote con el ID de la nota
    });
  });

  const edit_btns = document.querySelectorAll(".edit-btn");
  edit_btns.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const noteContainer = e.target.closest(".notes");
      const noteId = noteContainer.dataset.id; // Obtener el ID de la nota
      const titleElement = noteContainer.querySelector("h2");
      const contentElement = noteContainer.querySelector(".text-notes");
      const newTitle = prompt(
        "Ingrese el nuevo título:",
        titleElement.textContent
      );
      const newContent = prompt(
        "Ingrese el nuevo contenido:",
        contentElement.textContent
      );
      if (newTitle !== null && newContent !== null) {
        // Actualizar el título y el contenido en el DOM
        titleElement.textContent = newTitle;
        contentElement.textContent = newContent;
        // Llamar a la función para editar la nota en la base de datos
        editNote(noteId, newTitle, newContent);
      }
    });
  });
}

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  searchWords();
});

wordTo.addEventListener("input", (e) => {
  const counterlbl = document.getElementById("counter");
  let wcounter = 0;
  const words = inputNote.value.split(/\s+/);
  words.forEach((word) => {
    if (word === wordTo.value) {
      wcounter++;
    }
    return wcounter;
  });

  counterlbl.textContent = wcounter;
});

function searchWords() {
  let counter = 0;
  word = inputNote.value;
  const notes = document.querySelectorAll(".notes");
  notes.forEach((note) => {
    const contents = note.querySelectorAll(".text-notes");
    contents.forEach((content) => {
      if (
        content.textContent
          .toLocaleLowerCase()
          .includes(word.toLocaleLowerCase())
      ) {
        counter++;
      }
    });
  });
  if (counter === 0 || word === "") {
    Swal.fire({
      title: "No se encontraron coincidencias",
    });
  } else if (counter === 1) {
    Swal.fire({
      title: `Hay 1 palabra repetida`,
    });
  } else {
    Swal.fire({
      title: `Hay ${counter} palabras repetidas`,
    });
  }
}
// Attach initial event listeners
attachEventListeners();
