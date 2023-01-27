var events = {};

window.addEventListener('load', async () => {
    let a = await window.db.getEvents();
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
            continue;
        }

        eventsOrder.push(startDatetime.getTime());
        if (datetimeDict[String(startDatetime.getTime())] === undefined) {
            datetimeDict[String(startDatetime.getTime())] = [eid];
        }
        else {
            datetimeDict[String(startDatetime.getTime())].push(eid);
        }
    }
    eventsOrder.sort();

    eventsOrder.forEach((d) => {
        datetimeDict[d].forEach((eid) => {
            console.log(eid);
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
});

$('*', document.body).on('click', async (event) => {
    event.stopPropagation();
    let id = event.target.id;
    
    if (id.slice(0, 11) === 'info-event-') {
        await window.misc.viewEventInfo(events[id.split('-')[2]]);
    }
});