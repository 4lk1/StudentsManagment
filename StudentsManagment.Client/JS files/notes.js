document.addEventListener("DOMContentLoaded", async function () {
  const notesContainer = document.getElementById("notes-container");
  const token = localStorage.getItem("token");

  // Load notes
  let notes = [];
  try {
      const response = await fetch('/api/notes', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch notes");
      notes = await response.json();
  } catch (error) {
      console.error('Error fetching notes:', error);
      alert("Failed to load notes.");
  }

  // Display notes as read-only
  notesContainer.innerHTML = "";
  notes.forEach(note => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");

      const noteContent = document.createElement("textarea");
      noteContent.value = note.content;
      noteContent.readOnly = true;

      noteDiv.appendChild(noteContent);
      notesContainer.appendChild(noteDiv);
  });
});