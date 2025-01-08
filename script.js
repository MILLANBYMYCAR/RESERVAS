document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventConvenerInput = document.getElementById('event-convener');
    const eventNotesInput = document.getElementById('event-notes');
    const eventStartInput = document.getElementById('event-start');
    const eventEndInput = document.getElementById('event-end');
    const switchViewButton = document.getElementById('switch-view');
    const printButton = document.getElementById('print-calendar');

    let events = JSON.parse(localStorage.getItem('events')) || [];
    let currentView = 'timeGridWeek';

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: currentView,
        editable: true,
        events: events,
        selectable: true,
        selectOverlap: false,
        eventClick: function (info) {
            alert(
                `Título: ${info.event.title}\n` +
                `Convocante: ${info.event.extendedProps.convener}\n` +
                `Notas: ${info.event.extendedProps.notes}`
            );
        },
    });

    calendar.render();

    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = eventTitleInput.value;
        const convener = eventConvenerInput.value;
        const notes = eventNotesInput.value;
        const start = eventStartInput.value;
        const end = eventEndInput.value;

        if (new Date(start) >= new Date(end)) {
            alert('La hora de fin debe ser posterior a la hora de inicio.');
            return;
        }

        const overlapping = events.some(event =>
            (new Date(start) < new Date(event.end) && new Date(end) > new Date(event.start))
        );

        if (overlapping) {
            alert('El horario seleccionado ya está reservado.');
            return;
        }

        const newEvent = { title, convener, notes, start, end };
        events.push(newEvent);
        calendar.addEvent(newEvent);

        localStorage.setItem('events', JSON.stringify(events));

        eventForm.reset();
    });

    switchViewButton.addEventListener('click', () => {
        currentView = currentView === 'timeGridWeek' ? 'dayGridMonth' : 'timeGridWeek';
        calendar.changeView(currentView);
    });

    printButton.addEventListener('click', () => {
        window.print();
    });
});
