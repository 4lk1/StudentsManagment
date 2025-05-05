document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("cr-ct");
    const tabContainer = document.querySelector(".tab");
    const searchInput = document.getElementById("search-input");
    const token = localStorage.getItem("token");

    // Load projects
    let projects = [];
    try {
        const response = await fetch('/api/projects', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        projects = await response.json();
        projects.forEach((project, index) => createProjectCard(project, index));
    } catch (error) {
        console.error('Error fetching projects:', error);
        alert("Failed to load projects.");
    }

    // Handle form submission
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const teamName = document.getElementById("emrGr").value.trim();
        const topic = document.getElementById("projTop").value.trim();
        const members = document.getElementById("member").value.trim();

        if (teamName && topic && members) {
            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ teamName, projectTopic: topic, members })
                });
                if (!response.ok) throw new Error("Failed to create project");
                const newProject = await response.json();
                projects.push(newProject);
                createProjectCard(newProject, projects.length - 1);
                form.reset();
            } catch (error) {
                console.error('Error creating project:', error);
                alert("Failed to create project.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Create a project card dynamically
    function createProjectCard(project, index) {
        const card = document.createElement("div");
        card.className = "pro-t";
        card.setAttribute("data-index", index);
        card.setAttribute("data-id", project.id);

        card.innerHTML = `
            <img src="/Icons&Backgrownd/team.png" alt="">
            <div class="skuadra">
                <h3>Team: ${project.teamName}</h3>
                <h4>Topic: ${project.projectTopic}</h4>
                <p>Antaret: ${project.members}</p>
                <div id="bt">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `;

        // Handle delete
        card.querySelector(".delete").addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this project?")) return;
            try {
                const response = await fetch(`/api/projects/${project.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to delete project");
                projects.splice(index, 1);
                card.remove();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert("Failed to delete project.");
            }
        });

        // Handle edit
        card.querySelector(".edit").addEventListener("click", async () => {
            const newTeam = prompt("Edit Team Name:", project.teamName);
            const newTopic = prompt("Edit Topic:", project.projectTopic);
            const newMembers = prompt("Edit Members:", project.members);

            if (newTeam && newTopic && newMembers) {
                try {
                    const response = await fetch(`/api/projects/${project.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ teamName: newTeam, projectTopic: newTopic, members: newMembers })
                    });
                    if (!response.ok) throw new Error("Failed to update project");
                    project.teamName = newTeam;
                    project.projectTopic = newTopic;
                    project.members = newMembers;
                    card.querySelector("h3").textContent = `Team: ${newTeam}`;
                    card.querySelector("h4").textContent = `Topic: ${newTopic}`;
                    card.querySelector("p").textContent = `Antaret: ${newMembers}`;
                } catch (error) {
                    console.error('Error updating project:', error);
                    alert("Failed to update project.");
                }
            }
        });

        tabContainer.appendChild(card);
    }

    // Search functionality
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const projectCards = document.querySelectorAll(".pro-t");

        projectCards.forEach(card => {
            const projectTopic = card.querySelector("h4").textContent.toLowerCase();
            const projectTeam = card.querySelector("h3").textContent.toLowerCase();
            const projectMembers = card.querySelector("p").textContent.toLowerCase();

            if (projectTopic.includes(query) || projectTeam.includes(query) || projectMembers.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});