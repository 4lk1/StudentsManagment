document.addEventListener("DOMContentLoaded", function () {
    const monthYearDisplay = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    const weekdays = document.getElementById('weekdays');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();

    function renderCalendar(date) {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        monthYearDisplay.innerText = `${months[currentMonth]} ${currentYear}`;

        const firstDayOfMonth = new Date(currentYear, currentMonth, 0);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDay = firstDayOfMonth.getDay();

        weekdays.innerHTML = '';
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayNames.forEach(day => {
            const dayElem = document.createElement('div');
            dayElem.classList.add('weekday');
            dayElem.textContent = day;
            weekdays.appendChild(dayElem);
        });

        calendarDays.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty');
            calendarDays.appendChild(emptyDay);
        }

        const today = new Date();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('day');
            dayElem.textContent = day;

            // Highlight today's date
            if (
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
            ) {
                dayElem.classList.add('today');
            }

            calendarDays.appendChild(dayElem);
        }
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    }

    renderCalendar(currentDate);

    document.querySelector('button[onclick="prevMonth()"]').addEventListener('click', prevMonth);
    document.querySelector('button[onclick="nextMonth()"]').addEventListener('click', nextMonth);
});
