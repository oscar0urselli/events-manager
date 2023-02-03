document.addEventListener('DOMContentLoaded', () => {
    // Some way to detect selected language

    let sections = [['home.html', 'Home', 'home'], ['events.html', 'Eventi', 'table'], ['users.html', 'Utenti', 'people-circle']];
    let fileName = window.location.pathname.split('/').pop();

    sections.forEach((s) => {
        $('#sections').append(`
            <li class="nav-item">
                <a href="${s[0]}" class="nav-link ${s[0] === fileName ? 'active' : 'link-dark'}" aria-current="page">
                    <svg class="bi pe-none me-2" width="16" height="16">
                        <use xlink:href="#${s[2]}" />
                    </svg>
                    ${s[1]}
                </a>
            </li>
        `);
    });
});