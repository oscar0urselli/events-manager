var events;

window.addEventListener('DOMContentLoaded', async () => {
    
});

window.addEventListener('load', async () => {
    events = await window.db.getEvents();
    let nowDatetime = new Date().getTime();

    events.forEach((e) => {
        let status;

        if (nowDatetime > e.start_datetime && nowDatetime < e.end_datetime) {
            status = '<span class="badge text-bg-warning">In corso</span>';
        }
        else if (nowDatetime > e.end_datetime) {
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
                    <li class="list-group-item">Inizio: ${new Date(e.start_datetime).toLocaleString('it-IT')}</li>
                    <li class="list-group-item">Fine: ${new Date(e.end_datetime).toLocaleString('it-IT')}</li>
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

var eid = null;
var warningToast = undefined;
$('*', document.body).on('click', (event) => {
    event.stopPropagation();
    let id = event.target.id;
    
    if (id.slice(0, 10) === 'del-event-') {
        eid = id.split('-')[2]

        warningToast = new bootstrap.Toast($('#confirm-toast'));
        warningToast.show();
    }
    else if (id.slice(0, 13) === 'modify-event-') {
        events.forEach(async (e) => {
            if (e.id == id.split('-')[2]) {
                await window.misc.viewEventInfo(e);
            }
        });
    }
});

$('#del-event').on('click', async () => {
    if (eid !== null) {
        const res = await window.db.delEvent(eid);
        console.log(res);
    }
});

$('#confirm-search-event').on('click', () => {
    let searchDate = $('#start_date').val();
    let dateSearchType = $('#date-search-type').val();
    let statusFilter = $('#status').val();

    let nowDatetime = new Date().getTime();
    let searchDateFilter = new Date(searchDate).getTime();

    $('#events-list').empty();
    events.forEach((e) => {
        if (((statusFilter === '1' && nowDatetime > e.start_datetime && nowDatetime < e.end_datetime) ||
            (statusFilter === '2' && nowDatetime > e.end_datetime) ||
            (statusFilter === '3' && nowDatetime < e.start_datetime) ||
            (statusFilter === 'undefined')) &&
            ((dateSearchType === '1' && e.end_datetime < searchDateFilter) ||
            (dateSearchType === '2' && e.start_datetime > searchDateFilter) ||
            (dateSearchType === 'undefined' || searchDate === ''))) {
            
            let status;

            if (nowDatetime > e.start_datetime && nowDatetime < e.end_datetime) {
                status = '<span class="badge text-bg-warning">In corso</span>';
            }
            else if (nowDatetime > e.end_datetime) {
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
                            <li class="list-group-item">Inizio: ${new Date(e.start_datetime).toLocaleString('it-IT')}</li>
                            <li class="list-group-item">Fine: ${new Date(e.end_datetime).toLocaleString('it-IT')}</li>
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

$('#export-events-view').on('click', async (event) => {
    let searchDate = $('#start_date').val();
    let dateSearchType = $('#date-search-type').val();
    let statusFilter = $('#status').val();

    const conditions = {
        date: new Date(searchDate).getTime(),
        dateType: dateSearchType,
        status: statusFilter
    };

    console.log(await window.db.exportEventsView(conditions));
});