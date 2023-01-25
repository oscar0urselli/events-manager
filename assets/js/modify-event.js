var users;
var events;
var eid;
var addedUsers = [];

function updateSearchTable() {
    $('#filtered-users-list').empty();
    
    let selectedSex = $('#sex').val();
    let selectedRole = $('#role').val();
    let selectedCity = $('#city').val();
    users.forEach((u) => {
        if ((u.sex === selectedSex || selectedSex === 'undefined') &&
            (u.role === selectedRole || selectedRole === 'undefined') &&
            (u.city === selectedCity || selectedCity === 'undefined')) {
            
            let status;
            if (addedUsers.indexOf(u.id) !== -1) {
                status = `<span class="badge text-bg-success">Aggiunto</span>`;
            }
            else {
                status = `<button id="add-user-${u.id}" type="button" class="btn btn-outline-success btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                </button>`;

                let sDatetime = new Date($('#start_date').val() + 'T' + $('#start_time').val() + ':00');
                let eDatetime = new Date($('#end_date').val() + 'T' + $('#end_time').val() + ':00');
                events.every((e) => {
                    let eventStartDatetime = new Date(e.start_datetime);
                    let eventEndDatetime = new Date(e.end_datetime);
                    
                    if (e.users.split(';').indexOf(String(u.id)) !== -1 &&
                        ((sDatetime > eventStartDatetime && sDatetime < eventEndDatetime) ||
                         (eDatetime > eventStartDatetime && eDatetime < eventEndDatetime) ||
                         (eventStartDatetime > sDatetime && eventEndDatetime < eDatetime) ||
                         (eventStartDatetime < sDatetime && eventEndDatetime > eDatetime))) {

                        status = `<span class="badge text-bg-danger">Occupato</span>`;
                        
                        return false;
                    }
                    return true;
                });
            }

            $('#filtered-users-list').append(`
                <tr id="tr-${u.id}">
                    <td>${u.id}</td>
                    <td>${u.name}</td>
                    <td>${u.surname}</td>
                    <td>${u.cf}</td>
                    <td>${u.city}</td>
                    <td>${u.role}</td>
                    <td id="status-field-${u.id}">
                        ${status}
                    </td>
                </tr>
            `);
        }
    });
}

window.addEventListener('DOMContentLoaded', async () => {
     
});

window.addEventListener('load', async () => {
    let event = await window.misc.viewEventInfo(undefined);
    eid = event.id;
    users = await window.db.getUsers();
    events = await window.db.getEvents();
    console.log(event);

    $('#name').val(event.name);
    $('#description').val(event.description);
    $('#start_date').val(event.start_datetime.split('T')[0]);
    $('#start_time').val(event.start_datetime.split('T')[1]);
    $('#end_date').val(event.end_datetime.split('T')[0]);
    $('#end_time').val(event.end_datetime.split('T')[1]);
    $('#site').val(event.site);
    $('#notes').val(event.notes);

    event.users.split(';').forEach(async (uid) => {
        let u = await window.db.getUser(uid);
        addedUsers.push(Number(uid));

        $('#added-users-table').append(`
        <tr id="added-tr-${u.id}">
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.surname}</td>
            <td>${u.cf}</td>
            <td>${u.city}</td>
            <td>${u.role}</td>
            <td>
                <button id="del-user-${u.id}" type="button" class="btn btn-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </td>
        </tr>
        `);
    });
});

$('#add-users').on('click', () => {
    updateSearchTable();
});

$('#sex, #role, #city').on('change', () => {
    updateSearchTable();
});

$('*').on('click', (event) => {
    event.stopPropagation();
    let domElement = $( this ).get( 0 );
    let id = domElement.document.activeElement.attributes.id.nodeValue;

    if (id.slice(0, 9) === 'add-user-') {
        let uid = Number(id.split('-')[2]);

        addedUsers.push(uid);

        $(`#status-field-${uid}`).empty();
        $(`#status-field-${uid}`).append(`<span class="badge text-bg-success">Aggiunto</span>`);

        let u;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === uid) {
                u = users[i];
                break;
            }
        }

        $('#added-users-table').append(`
        <tr id="added-tr-${u.id}">
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.surname}</td>
            <td>${u.cf}</td>
            <td>${u.city}</td>
            <td>${u.role}</td>
            <td>
                <button id="del-user-${u.id}" type="button" class="btn btn-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </td>
        </tr>
        `);
    }
    else if (id.slice(0, 9) === 'del-user-') {
        let uid = Number(id.split('-')[2]);
        $(`#added-tr-${uid}`).remove();
        addedUsers.splice(addedUsers.indexOf(uid), 1);
    }
});

$('#start_date, #start_time, #end_date, #end_time').on('change', () => {
    let startDate = $('#start_date').val();
    let startTime = $('#start_time').val();
    let endDate = $('#end_date').val();
    let endTime = $('#end_time').val();
    
    if (startDate !== '' && startTime !== '' && endDate !== '' && endTime !== '') {
        let startDateTime = new Date(startDate + 'T' + startTime + ':00');
        let endDateTime = new Date(endDate + 'T' + endTime + ':00');

        if (endDateTime < startDateTime) {
            $('#add-users').prop('disabled', true);
        }
        else {
            $('#add-users').prop('disabled', false);
        }
    }
    else {
        $('#add-users').prop('disabled', true);
    }
});

$('#pre-modify-event').on('click', () => {
    let name = $('#name').val();
    let site = $('#site').val();

    let errorStackTrace = [];

    if (name === '') {
        errorStackTrace.push('NOME EVENTO');
    }
    if (addedUsers.length === 0) {
        errorStackTrace.push('PARTECIPANTI');
    }
    if (site === '') {
        errorStackTrace.push('LUOGO');
    }
    if ($('#start_date').val() === '') {
        errorStackTrace.push('DATA INIZIO');
    }
    if ($('#start_time').val() === '') {
        errorStackTrace.push('ORARIO INIZIO');
    }
    if ($('#end_date').val() === '') {
        errorStackTrace.push('DATA FINE');
    }
    if ($('#end_time').val() === '') {
        errorStackTrace.push('ORARIO FINE');
    }

    let startDate = $('#start_date').val();
    let startTime = $('#start_time').val();
    let endDate = $('#end_date').val();
    let endTime = $('#end_time').val();
    if (startDate !== '' && startTime !== '' && endDate !== '' && endTime !== '') {
        let startDateTime = new Date(startDate + 'T' + startTime);
        let endDateTime = new Date(endDate + 'T' + endTime);

        if (endDateTime < startDateTime) {
            errorStackTrace.push('FINE EVENTO ANTECEDENTE ALL\'INIZIO');
        }
        else {
            $('#add-users').prop('disabled', false);
        }
    }

    if (errorStackTrace.length === 0) {
        confirmToast = new bootstrap.Toast($('#confirm-toast'));
        confirmToast.show();
    }
    else {
        errorToast = new bootstrap.Toast($('#error-toast'));
        errorToast.show();
        let e = 'I seguenti campi NON sono stati compilati correttamente:\n';
        errorStackTrace.forEach(item => {
            e += ' - ' + item + '\n';
        });
        console.log(e);
        $('#error-fields').text(e);
    }
});

$('#modify-event').on('click', async () => {
    const event = {
        id: eid,
        name: $('#name').val(),
        description: $('#description').val(),
        notes: $('#notes').val(),
        start_datetime: $('#start_date').val() + 'T' + $('#start_time').val(),
        end_datetime: $('#end_date').val() + 'T' + $('#end_time').val(),
        site: $('#site').val(),
        users: addedUsers.join(';')
    }

    const res = await window.db.modifyEvent(event);
    console.log(res);
});