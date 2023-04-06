const alert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible me-3" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    $('#live-alert-placeholder').append(wrapper);
}


window.addEventListener('DOMContentLoaded', () => {
    //$('#advanced').hide();
});

$('#btn-preferences').on('input', () => {
    $('#preferences').show();
    $('#advanced').hide();
});

$('#btn-advanced').on('input', () => {
    $('#preferences').hide();
    $('#advanced').show();
});

var dangerToast = undefined;
$('#import-database-btn').on('click', () => {
    dangerToast = new bootstrap.Toast($('#confirm-toast'));
    dangerToast.show();
});

$('#confirm-btn').on('click', async () => {
    let path = $('#database')[0].files[0].path;
    console.log(path);
    let res = await window.db.importDB(path);

    if (res === 'ok') {
        alert('Database importato con successo.', 'warning');
    }
    else if (res === 'no') {
        alert('Errore durante l\'importazione del databse.', 'danger');
    }
});

$('#export-database').on('click', async () => {
    console.log(await window.db.exportDB());
});