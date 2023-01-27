var events = {};

window.addEventListener('DOMContentLoaded', async () => {
    
});

window.addEventListener('load', async () => {
    let a = await window.db.getEvents()
    a.forEach((e) => {
        events[String(e.id)] = e;
    });
    let nowDatetime = new Date();

    let eventsOrder = [];
    let datetimeDict = {};

    for (let eid in events) {
        let startDatetime = new Date(events[eid].start_datetime);
        let endDatetime = new Date(events[eid].end_datetime);

        if (nowDatetime > endDatetime) {
            return;
        }

        eventsOrder.push(startDatetime.getTime());
        if (datetimeDict[String(startDatetime.getTime())] === undefined) {
            datetimeDict[String(startDatetime.getTime())] = [String(events[eid].id)];
        }
        else {
            datetimeDict[String(startDatetime.getTime())].push(String(events[eid].id));
        }
    }
    eventsOrder.sort();

    eventsOrder.forEach((d) => {
        datetimeDict[d].forEach((eid) => {
            let e = events[eid];
            
            let startDatetime = new Date(e.start_datetime);
            let endDatetime = new Date(e.end_datetime);
            let status;

            if (nowDatetime > endDatetime) {
                return;
            }

            if (nowDatetime > startDatetime && nowDatetime < endDatetime) {
                status = '<span class="badge text-bg-warning">In corso</span>';
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
                        <a id="info-event-${e.id}" href="info-event.html" class="btn btn-info btn-lg">Informazioni</a>
                    </div>
                </div>
            </div>
            `);
        });
    });

    events.forEach((e) => {
        let startDatetime = new Date(e.start_datetime);
        let endDatetime = new Date(e.end_datetime);
        let status;

        if (nowDatetime > endDatetime) {
            return;
        }

        if (nowDatetime > startDatetime && nowDatetime < endDatetime) {
            status = '<span class="badge text-bg-warning">In corso</span>';
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
                    <a id="info-event-${e.id}" href="info-event.html" class="btn btn-info btn-lg">Informazioni</a>
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
    let domElement = $( this ).get( 0 );
    let id = domElement.document.activeElement.attributes.id.nodeValue
    
    if (id.slice(0, 11) === 'info-event-') {
        events.forEach(async (e) => {
            if (e.id == id.split('-')[2]) {
                await window.misc.viewEventInfo(e);
            }
        });
    }
});