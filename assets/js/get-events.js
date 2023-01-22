var events;

window.addEventListener('DOMContentLoaded', async () => {
    
});

window.addEventListener('load', async () => {
    events = await window.db.getEvents();
    let nowDatetime = new Date();

    events.forEach((e) => {
        let startDatetime = new Date(e.start_datetime);
        let endDatetime = new Date(e.end_datetime);
        let status;

        if (nowDatetime > startDatetime && nowDatetime < endDatetime) {
            status = '<span class="badge text-bg-warning">In corso</span>';
        }
        else if (nowDatetime > endDatetime) {
            status = '<span class="badge text-bg-secondary">Terminato</span>';
        }
        else {
            status = '<span class="badge text-bg-info">Prossimamente</span>';
        }

        $('#events-list').append(`
        <div id="event-${e.id}" class="col">
            <div class="card text-center shadow-lg h-100" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${e.name}</h5>
                    <p class="text-secondary">#${e.id}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${status}</li>
                    <li class="list-group-item">Luogo: ${e.site}</li>
                    <li class="list-group-item">Inizio: ${startDatetime.toLocaleString('it-IT')}</li>
                    <li class="list-group-item">Fine: ${endDatetime.toLocaleString('it-IT')}</li>
                </ul>
                <div class="card-body">
                    <a id="modify-event-${e.id}" href="modify-event.html" class="btn btn-primary btn-lg">Modifica</a>
                    <button type="button" id="del-event-${e.id}" class="btn btn-danger btn-lg">Elimina</button>
                </div>
            </div>
        </div>
        `);
    });
});

$('#confirm-search-event').on('click', () => {
    let searchDate = $('#start_date').val();
    let dateSearchType = $('#date-search-type').val();
    let statusFilter = $('#status').val();

    let nowDatetime = new Date();
    let searchDateFilter = new Date(searchDate);

    $('#events-list').empty();
    events.forEach((e) => {
        if (((statusFilter === '1' && nowDatetime > new Date(e.start_datetime) && nowDatetime < new Date(e.end_datetime)) ||
            (statusFilter === '2' && nowDatetime > new Date(e.end_datetime)) ||
            (statusFilter === '3' && nowDatetime < new Date(e.start_datetime)) ||
            (statusFilter === 'undefined')) &&
            ((dateSearchType === '1' && new Date(e.end_datetime) < searchDateFilter) ||
            (dateSearchType === '2' && new Date(e.start_datetime) > searchDateFilter) ||
            (dateSearchType === 'undefined' || searchDate === ''))) {
            
            let startDatetime = new Date(e.start_datetime);
            let endDatetime = new Date(e.end_datetime);
            let status;

            if (nowDatetime > startDatetime && nowDatetime < endDatetime) {
                status = '<span class="badge text-bg-warning">In corso</span>';
            }
            else if (nowDatetime > endDatetime) {
                status = '<span class="badge text-bg-secondary">Terminato</span>';
            }
            else {
                status = '<span class="badge text-bg-info">Prossimamente</span>';
            }
            $('#events-list').append(`
                <div id="event-${e.id}" class="col">
                    <div class="card text-center shadow-lg h-100" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${e.name}</h5>
                            <p class="text-secondary">#${e.id}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">${status}</li>
                            <li class="list-group-item">Luogo: ${e.site}</li>
                            <li class="list-group-item">Inizio: ${startDatetime.toLocaleString('it-IT')}</li>
                            <li class="list-group-item">Fine: ${endDatetime.toLocaleString('it-IT')}</li>
                        </ul>
                        <div class="card-body">
                            <a id="modify-event-${e.id}" href="modify-event.html" class="btn btn-primary btn-lg">Modifica</a>
                            <button type="button" id="del-event-${e.id}" class="btn btn-danger btn-lg">Elimina</button>
                        </div>
                    </div>
                </div>
            `);
        }
    });
});