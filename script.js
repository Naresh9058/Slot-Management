let currentDate = new Date();
let selectedDate = null;
let slots = {};

function showContent(contentType) {
    const mainContent = document.getElementById('main-content');
    switch(contentType) {
        case 'home':
            mainContent.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-item active">Assessment</div>
                    <div class="progress-item active">Interview 1</div>
                    <div class="progress-item">Interview 2</div>
                    <div class="progress-item">Offer letter</div>
                </div>
                <div class="content-box">
                    <a href="#" class="view-students">View students</a>
                    <h2>Interview 1</h2>
                    <p>(Create slots for students)</p>
                    <h3>Select date and time</h3>
                    <div id="home-calendar" class="calendar"></div>
                    <h3>Time zone</h3>
                    <select>
                        <option>Indian standard time</option>
                    </select>
                </div>
            `;
            renderHomeCalendar();
            break;
        case 'calendar':
            mainContent.innerHTML = `
                <div class="content-box">
                    <h2>Interview Calendar</h2>
                    <div class="calendar-header">
                        <button onclick="changeMonth(-1)">Previous</button>
                        <span id="current-month"></span>
                        <button onclick="changeMonth(1)">Next</button>
                    </div>
                    <div id="calendar" class="calendar"></div>
                    <div class="slot-management">
                        <h3>Manage Slots for <span id="selected-date"></span></h3>
                        <form id="slot-form" class="slot-form">
                            <input type="time" id="slot-time" required>
                            <input type="number" id="slot-duration" placeholder="Duration (minutes)" required>
                            <button type="submit">Add Slot</button>
                        </form>
                        <ul id="slots-list" class="slots-list"></ul>
                    </div>
                </div>
            `;
            renderCalendar();
            document.getElementById('slot-form').addEventListener('submit', addSlot);
            break;
        case 'applicants':
            mainContent.innerHTML = '<div class="content-box"><h2>Applicants</h2><p>Applicant information would go here.</p></div>';
            break;
    }
}

function renderHomeCalendar() {
    const calendar = document.getElementById('home-calendar');
    calendar.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < 7; i++) {
        const dayName = new Date(2023, 0, i + 1).toLocaleString('default', {weekday: 'short'});
        const dayHeader = document.createElement('div');
        dayHeader.textContent = dayName;
        dayHeader.classList.add('calendar-day');
        calendar.appendChild(dayHeader);
    }

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        day.classList.add('calendar-day');
        if (i >= 24 && i <= 29) {
            day.classList.add('highlight');
        }
        calendar.appendChild(day);
    }
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    document.getElementById('current-month').textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    for (let i = 0; i < 7; i++) {
        const dayName = new Date(2023, 0, i + 1).toLocaleString('default', {weekday: 'short'});
        const dayHeader = document.createElement('div');
        dayHeader.textContent = dayName;
        dayHeader.classList.add('calendar-day');
        calendar.appendChild(dayHeader);
    }

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        day.classList.add('calendar-day');
        if (year === new Date().getFullYear() && month === new Date().getMonth() && i === new Date().getDate()) {
            day.classList.add('today');
        }
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        if (slots[dateString] && slots[dateString].length > 0) {
            day.classList.add('has-slots');
        }
        day.addEventListener('click', () => selectDate(dateString));
        calendar.appendChild(day);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(dateString) {
    selectedDate = dateString;
    document.getElementById('selected-date').textContent = dateString;
    renderSlots();
}

function renderSlots() {
    const slotsList = document.getElementById('slots-list');
    slotsList.innerHTML = '';
    if (slots[selectedDate]) {
        slots[selectedDate].forEach((slot, index) => {
            const li = document.createElement('li');
            li.textContent = `${slot.time} (${slot.duration} minutes)`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteSlot(index));
            li.appendChild(deleteBtn);
            slotsList.appendChild(li);
        });
    }
}

function addSlot(event) {
    event.preventDefault();
    const time = document.getElementById('slot-time').value;
    const duration = document.getElementById('slot-duration').value;
    if (!slots[selectedDate]) {
        slots[selectedDate] = [];
    }
    slots[selectedDate].push({ time, duration });
    renderSlots();
    renderCalendar();
}

function deleteSlot(index) {
    slots[selectedDate].splice(index, 1);
    renderSlots();
    renderCalendar();
}

showContent('home');
