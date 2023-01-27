var users;

window.addEventListener('DOMContentLoaded', (event) => {
    
});

window.addEventListener('load', async (event) => { 
    users = await window.db.getUsers();

    users.forEach((u) => {
        let status = `<input class="px-3 form-check-input" type="checkbox" role="switch" id="change-status-${u.id}" checked>
                    Stato:
                    <span id="status-badge-${u.id}" class="badge text-bg-info">Attivo</span>`;
        if (u.status === 'disabled') {
            status = `<input class="px-3 form-check-input" type="checkbox" role="switch" id="change-status-${u.id}">
                    Stato:
                    <span id="status-badge-${u.id}" class="badge text-bg-secondary">Disabilitato</span>`;
        }
        
        $('#users-list').append(`
        <div id="user-${u.id}" class="col">
            <div class="card text-center shadow-lg h-100" style="width: 18rem;">
                <img src="../../${u.pic}" class="card-img-top img-thumbnail">
                <div class="card-body">
                    <h5 class="card-title">${u.name} ${u.surname}</h5>
                    <p class="text-secondary">#${u.id}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Incarico: ${u.role}</li>
                    <li class="list-group-item">Città: ${u.city}</li>
                    <li class="list-group-item">Data di nascita: ${u.birthday}</li>
                    <li class="list-group-item">${status}</li>
                </ul>
                <div class="card-body">
                    <a id="modify-user-${u.id}" href="modify-user.html" class="btn btn-primary btn-lg">Modifica</a>
                    <button type="button" id="del-user-${u.id}" class="btn btn-danger btn-lg">Elimina</button>
                </div>
            </div>
        </div>
        `);
    });
});


var uid = null;
var warningToast = undefined;
$('*', document.body ).on('click', async (event) => {
    event.stopPropagation();
    let domElement = $( this ).get( 0 );
    let id = domElement.document.activeElement.attributes.id.nodeValue
    
    if (id.slice(0, 9) === 'del-user-') {
        uid = id.split('-')[2]

        warningToast = new bootstrap.Toast($('#confirm-toast'));
        warningToast.show();
    }
    else if (id.slice(0, 12) === 'modify-user-') {
        users.forEach(async (u) => {
            if (u.id == id.split('-')[2]) {
                await window.misc.viewUserInfo(u);
            }
        });
    }
    else if (id.slice(0, 14) === 'change-status-') {
        uid = id.split('-')[2];
        $('#status-badge-' + uid).toggleClass('text-bg-info text-bg-secondary');
        
        if ($('#change-status-' + uid).prop('checked')) {
            $('#status-badge-' + uid).text('Attivo');
            await window.db.changeUserStatus(Number(uid), 'active');
            users = await window.db.getUsers();
        }
        else {
            $('#status-badge-' + uid).text('Disabilitato');
            await window.db.changeUserStatus(Number(uid), 'disabled');
            users = await window.db.getUsers();
        }
    }
});

$('#del-user').on('click', async () => {
    if (uid !== null) {
        const res = await window.db.delUser(uid);
        console.log(res);
    }
});

$('#confirm-search-user').on('click', () => {
    let statusFilter = $('#status').val();
    let sexFilter = $('#sex').val();
    let roleFilter = $('#role').val();
    let cityFilter = $('#city').val();

    $('#users-list').empty();
    users.forEach((u) => {
        if ((u.status === statusFilter || statusFilter === 'undefined') &&
            (u.sex === sexFilter || sexFilter === 'undefined') && 
            (u.role === roleFilter || roleFilter === 'undefined') && 
            (u.city === cityFilter || cityFilter === 'undefined')) {
            
            let status = `<input class="px-3 form-check-input" type="checkbox" role="switch" id="change-status-${u.id}" checked>
                Stato:
                <span id="status-badge-${u.id}" class="badge text-bg-info">Attivo</span>`;
            if (u.status === 'disabled') {
                status = `<input class="px-3 form-check-input" type="checkbox" role="switch" id="change-status-${u.id}">
                    Stato:
                    <span id="status-badge-${u.id}" class="badge text-bg-secondary">Disabilitato</span>`;
            }

            $('#users-list').append(`
            <div id="user-${u.id}" class="col">
                <div class="card text-center shadow-lg h-100" style="width: 18rem;">
                    <img src="../../${u.pic}" class="card-img-top img-thumbnail">
                    <div class="card-body">
                        <h5 class="card-title">${u.name} ${u.surname}</h5>
                        <p class="text-secondary">#${u.id}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Incarico: ${u.role}</li>
                        <li class="list-group-item">Città: ${u.city}</li>
                        <li class="list-group-item">Data di nascita: ${u.birthday}</li>
                        <li class="list-group-item">${status}</li>
                    </ul>
                    <div class="card-body">
                        <a id="modify-user-${u.id}" href="modify-user.html" class="btn btn-primary btn-lg">Modifica</a>
                        <button type="button" id="del-user-${u.id}" class="btn btn-danger btn-lg">Elimina</button>
                    </div>
                </div>
            </div>
            `);
        }
    });
});