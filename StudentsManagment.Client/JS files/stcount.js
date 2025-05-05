document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  try {
      const response = await fetch('/api/students', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const students = await response.json();
      document.getElementById("student-count").textContent = students.length;
  } catch (error) {
      console.error('Error fetching student count:', error);
      document.getElementById("student-count").textContent = "0";
  }
});