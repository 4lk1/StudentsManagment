document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('missed-table-body');
  const token = localStorage.getItem('token');

  if (!tableBody) {
      console.error("Missing element: #missed-table-body");
      return;
  }

  // Load missed attendance
  let missed = [];
  try {
      const response = await fetch('/api/attendance/missed', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch missed attendance");
      missed = await response.json();
  } catch (error) {
      console.error('Error fetching missed attendance:', error);
      alert("Failed to load missed attendance.");
      return;
  }

  // Render missed attendance
  missed.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${student.id || 'N/A'}</td>
          <td>${student.name || 'N/A'}</td>
          <td>${student.group || 'N/A'}</td>
          <td>${student.year || 'N/A'}</td>
          <td>${student.timesAbsent}</td>
      `;
      tableBody.appendChild(row);
  });
});