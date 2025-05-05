document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  // Load daily visits
  let visits = [];
  try {
      const response = await fetch('/api/dailyvisits', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch daily visits");
      visits = await response.json();
  } catch (error) {
      console.error('Error fetching daily visits:', error);
      alert("Failed to load daily visits.");
  }

  // Prepare data
  const sortedDates = visits.map(v => v.date.split('T')[0]).sort();
  const visitCounts = visits.map(v => v.visitCount);

  // Chart
  const ctx = document.getElementById('loginChart').getContext('2d');
  const chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: sortedDates,
          datasets: [{
              label: 'Visits per Day',
              data: visitCounts,
              backgroundColor: '#2196f3'
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
                  stepSize: 1
              }
          },
          plugins: {
              tooltip: {
                  callbacks: {
                      label: ctx => `Visits: ${ctx.raw}`
                  }
              }
          }
      }
  });

  // Clear button
  document.getElementById('reset-btn').addEventListener('click', async () => {
      if (confirm("Are you sure you want to clear all visit data?")) {
          try {
              const response = await fetch('/api/dailyvisits', {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!response.ok) throw new Error("Failed to clear visits");
              location.reload();
          } catch (error) {
              console.error('Error clearing visits:', error);
              alert("Failed to clear visits.");
          }
      }
  });
});