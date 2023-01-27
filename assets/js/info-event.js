var users = {};
var events;
var eid;

window.addEventListener('load', async () => {
    let event = await window.misc.viewEventInfo(undefined);
    eid = event.id;
    
    let us = await window.db.getUsers();
    us.forEach((u) => {
        users[String(u.id)] = u;
    });
    
    events = await window.db.getEvents();

    $('#name').text(event.name);
    $('#description').text(event.description);
    $('#start_date').text(new Date(event.start_datetime).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })); //.text(event.start_datetime.split('T')[0]);
    $('#start_time').text(event.start_datetime.split('T')[1]);
    $('#end_date').text(new Date(event.end_datetime).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })); //.text(event.end_datetime.split('T')[0]);
    $('#end_time').text(event.end_datetime.split('T')[1]);
    $('#site').text(event.site);
    $('#notes').text(event.notes);

    event.users.split(';').forEach(async (uid) => {
        let u = await window.db.getUser(uid);

        let presence = `<input class="form-check-input" type="checkbox" id="presence-user-${u.id}">`;
        if (u.events === null) {
            users[String(u.id)].events = '';
        }
        else if (u.events.indexOf(String(eid)) !== -1) {
            presence = `<input class="form-check-input" type="checkbox" id="presence-user-${u.id}" checked>`;
        }

        $('#added-users-table').append(`
        <tr id="added-tr-${u.id}">
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.surname}</td>
            <td>${u.cf}</td>
            <td>${u.city}</td>
            <td>${u.role}</td>
            <td>${presence}</td>
        </tr>
        `);
    });
});

$(document.body).on('click', '.form-check-input', async (event) => {
    let id = event.target.id;
    
    if (id.slice(0, 14) === 'presence-user-') {
        let uid = id.split('-')[2];

        if ($('#' + id).prop('checked')) {
            if (users[uid].events.length === 0) {
                users[uid].events = `${eid}`;
            }
            else {
                users[uid].events += `;${eid}`;
            }
        }
        else {
            let ev = '';
            users[uid].events.split(';').forEach((e) => {
                if (e !== String(eid)) {
                    ev += e + ';';
                }
            });

            users[uid].events = ev.slice(0, ev.length - 1);
        }
        
        await window.db.takePresence(uid, users[uid].events);
    }
});