document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('student-body');
  const token = localStorage.getItem('token');

  // Load students
  let students = [];
  try {
      const response = await fetch('/api/students', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      students = await response.json();
  } catch (error) {
      console.error('Error fetching students:', error);
      alert("Failed to load students.");
  }

  // Render student rows with checkboxes
  students.forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${student.studentId}</td>
          <td>${student.fullName}</td>
          <td>${student.group}</td>
          <td>${student.year}</td>
          <td>
              <input type="checkbox" id="present-${index}" data-student-id="${student.id}">
          </td>
      `;
      tbody.appendChild(row);
  });

  // Save Attendance Button Logic
  window.saveAttendance = async function () {
      const attendances = [];
      students.forEach((student, index) => {
          const checkbox = document.getElementById(`present-${index}`);
          attendances.push({
              studentId: student.id,
              isPresent: checkbox.checked
          });
      });

      try {
          const response = await fetch('/api/attendance', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(attendances)
          });
          if (!response.ok) throw new Error("Failed to save attendance");
          alert('Attendance has been saved!');
      } catch (error) {
          console.error('Error saving attendance:', error);
          alert("Failed to save attendance.");
      }
  };
});