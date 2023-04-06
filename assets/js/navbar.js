document.addEventListener('DOMContentLoaded', () => {
    let fileName = window.location.pathname.split('/').pop();

    $('#home-section').removeClass('link-dark');
    $('#events-section').removeClass('link-dark');
    $('#users-section').removeClass('link-dark');
    $('#settings-section').removeClass('link-dark');

    if (fileName === 'home.html') {
        $('#home-section').addClass('active');
        $('#events-section').addClass('link-dark');
        $('#users-section').addClass('link-dark');
        $('#settings-section').addClass('link-dark');
    }
    else if (fileName === 'events.html') {
        $('#home-section').addClass('link-dark');
        $('#events-section').addClass('active');
        $('#users-section').addClass('link-dark');
        $('#settings-section').addClass('link-dark');
    }
    else if (fileName === 'users.html') {
        $('#home-section').addClass('link-dark');
        $('#events-section').addClass('link-dark');
        $('#users-section').addClass('active');
        $('#settings-section').addClass('link-dark');
    }
    else if (fileName === 'settings.html') {
        $('#home-section').addClass('link-dark');
        $('#events-section').addClass('link-dark');
        $('#users-section').addClass('link-dark');
        $('#settings-section').addClass('active');
    }
});