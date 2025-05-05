document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("add-student-form");
    const tabContainer = document.querySelector(".tab");
    const searchInput = document.getElementById("searchInput");
    const token = localStorage.getItem("token");

    // Load students
    let students = [];
    try {
        const response = await fetch('/api/students', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch students");
        students = await response.json();
        students.forEach((student, index) => createStudentCard(student, index));
    } catch (error) {
        console.error('Error fetching students:', error);
        alert("Failed to load students.");
    }

    // Handle form submission
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("student-name").value.trim();
        const id = document.getElementById("student-id").value.trim();
        const year = document.getElementById("student-year").value.trim();
        const group = document.getElementById("student-group").value.trim();

        if (name && id && year && group) {
            try {
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ fullName: name, studentId: id, year, group })
                });
                if (!response.ok) throw new Error("Failed to add student");
                const newStudent = await response.json();
                students.push(newStudent);
                createStudentCard(newStudent, students.length - 1);
                form.reset();
            } catch (error) {
                console.error('Error adding student:', error);
                alert("Failed to add student.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Create a student card dynamically
    function createStudentCard(student, index) {
        const card = document.createElement("div");
        card.className = "team-form";
        card.id = "team";
        card.setAttribute("data-index", index);
        card.setAttribute("data-id", student.id);

        card.innerHTML = `
            <img src="/Icons&Backgrownd/project.png" alt="">
            <h3>${student.fullName}</h3>
            <h4>ID: ${student.studentId}</h4>
            <h5>Year: ${student.year}</h5>
            <h6>Group: ${student.group}</h6>
            <button class="edit">Edit</button>
            <button class="delete" style="background-color: lightcoral;">Delete</button>
        `;

        // Handle delete
        card.querySelector(".delete").addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this student?")) return;
            try {
                const response = await fetch(`/api/students/${student.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to delete student");
                students.splice(index, 1);
                card.remove();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert("Failed to delete student.");
            }
        });

        // Handle edit
        card.querySelector(".edit").addEventListener("click", async () => {
            const newName = prompt("Edit Name:", student.fullName);
            const newId = prompt("Edit ID:", student.studentId);
            const newYear = prompt("Edit Year:", student.year);
            const newGroup = prompt("Edit Group:", student.group);

            if (newName && newId && newYear && newGroup) {
                try {
                    const response = await fetch(`/api/students/${student.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ fullName: newName, studentId: newId, year: newYear, group: newGroup })
                    });
                    if (!response.ok) throw new Error("Failed to update student");
                    student.fullName = newName;
                    student.studentId = newId;
                    student.year = newYear;
                    student.group = newGroup;
                    card.querySelector("h3").textContent = newName;
                    card.querySelector("h4").textContent = `ID: ${newId}`;
                    card.querySelector("h5").textContent = `Year: ${newYear}`;
                    card.querySelector("h6").textContent = `Group: ${newGroup}`;
                } catch (error) {
                    console.error('Error updating student:', error);
                    alert("Failed to update student.");
                }
            }
        });

        tabContainer.appendChild(card);
    }

    // Live search filter
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const studentCards = document.querySelectorAll(".team-form");

        studentCards.forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const id = card.querySelector("h4").textContent.toLowerCase();
            const year = card.querySelector("h5").textContent.toLowerCase();
            const group = card.querySelector("h6").textContent.toLowerCase();

            if (name.includes(query) || id.includes(query) || year.includes(query) || group.includes(query)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
});