var users;

window.addEventListener('DOMContentLoaded', (event) => {
    $('#filter-selection').hide();
});

window.addEventListener('load', async (event) => { 
    users = await window.db.getUsers();

    console.log(users);
    users.forEach((u) => {
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

$('#close-filter').on('click', () => {
    $('#filter-selection').hide();
});


var uid = null;
var warningToast = undefined;
$('*', document.body ).on('click', (event) => {
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
});

$('#del-user').on('click', async () => {
    if (uid !== null) {
        const res = await window.db.delUser(uid);
        console.log(res);
    }
});

$('#search-user').on('click', () => {
    $('#filter-selection').show();
});

$('#confirm-search-user').on('click', () => {
    let sexFilter = $('#sex').val();
    let roleFilter = $('#role').val();
    let cityFilter = $('#city').val();

    $('#users-list').empty();
    users.forEach((u) => {
        if ((u.sex === sexFilter || sexFilter === 'undefined') && 
            (u.role === roleFilter || roleFilter === 'undefined') && 
            (u.city === cityFilter || cityFilter === 'undefined')) {
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

    $('#filter-selection').hide();
});