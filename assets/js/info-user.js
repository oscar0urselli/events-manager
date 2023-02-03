var uid;

window.addEventListener('load', async () => {
    let user = await window.misc.viewUserInfo(undefined);
    uid = user.id;

    $('#name').text(user.name + " " + user.surname);
    $('#birthday').text(user.birthday);
    $('#cf').text(user.cf);
    $('#sex').text(user.sex);
    $('#city').text(user.city);
    $('#role').text(user.role);

    user.events.split(';').forEach(async (eid) => {
        let e = await window.db.getEvent(Number(eid));

        console.log(e);
        $('#events-table').append(`
        <tr id="added-tr-${e.id}">
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.site}</td>
            <td>${new Date(e.start_datetime).toLocaleDateString('it-IT')}</td>
            <td>${new Date(e.end_datetime).toLocaleDateString('it-IT')}</td>
        </tr>
        `);
    });
});