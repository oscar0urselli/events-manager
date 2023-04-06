document.addEventListener('DOMContentLoaded', () => {
    i18next.init({
        lng: navigator.language || navigator.userLanguage,
        resources: {
            en: {
                translation: {
                    navbar: {
                        events: 'Events',
                        users: 'Users',
                        settings: 'Settings'
                    }
                }
            },
            it: {
                translation: {
                    navbar: {
                        events: 'Eventi',
                        users: 'Utenti',
                        settings: 'Impostazioni'
                    }
                }
            }
        }
    }, (err, t) => {
        jqueryI18next.init(i18next, $);
    
        $('#sections').localize();
    });
});