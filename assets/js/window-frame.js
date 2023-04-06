var isMaximized = false;

$('#close-btn').on('click', () => {
    window.windowFrame.closeWindow();
});

$('#fullscreen-toggle').on('click', () => {
    window.windowFrame.maxUnmaxWindow();

    isMaximized = !isMaximized;
    $('#fullscreen-toggle').empty();

    if (isMaximized) {
        $('#fullscreen-toggle').append('<i class="bi bi-fullscreen-exit"></i>');
    }
    else {
        $('#fullscreen-toggle').append('<i class="bi bi-arrows-fullscreen"></i>');
    }
});

$('#minimize-btn').on('click', () => {
    isMaximized = true;
    $('#fullscreen-toggle').empty();
    $('#fullscreen-toggle').append('<i class="bi bi-fullscreen-exit"></i>');

    window.windowFrame.minimizeWindow();
});