document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  try {
      const response = await fetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch projects");
      const projects = await response.json();
      document.getElementById("team-count").textContent = projects.length;
  } catch (error) {
      console.error('Error fetching team count:', error);
      document.getElementById("team-count").textContent = "0";
  }
});