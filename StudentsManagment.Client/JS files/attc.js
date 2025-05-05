document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // Load attendance overview
    let overview = { present: 0, absent: 0 };
    try {
        const response = await fetch('/api/attendance/overview', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch attendance overview");
        overview = await response.json();
    } catch (error) {
        console.error('Error fetching attendance overview:', error);
        alert("Failed to load attendance overview.");
    }

    // Create the pie chart
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    const attendanceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                label: 'Attendance',
                data: [overview.present, overview.absent],
                backgroundColor: ['#4caf50', '#f44336'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' Students';
                        }
                    }
                }
            }
        }
    });
});