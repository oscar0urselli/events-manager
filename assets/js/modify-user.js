// Check validity of C.F.
function checkCF(cf) {
    let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let even = {
        'A': 1, '0': 1, 'B': 0, '1': 0, 'C': 5, '2': 5, 'D': 7, '3': 7,
        'E': 9, '4': 9, 'F': 13, '5': 13, 'G': 15, '6': 15, 'H': 17, '7': 17,
        'I': 19, '8': 19, 'J': 21, '9': 21, 'K': 2, 'L': 4, 'M': 18, 'N': 20,
        'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14, 'U': 16, 'V': 10,
        'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };

    let s = 0;
    for (let i = 0; i < cf.length - 1; i++) {
        if (i % 2 === 0) {
            s += even[cf[i]];
        }
        else {
            if ('0123456789'.includes(cf[i])) {
                s += Number(cf[i]);
            }
            else {
                s += alpha.indexOf(cf[i]);
            }
        }
    }

    if (s % 26 === alpha.indexOf(cf[15])) {
        return true;
    }
    else {
        return false;
    }
}

var uid;

window.addEventListener('load', async (event) => {
    let user = await window.misc.viewUserInfo(undefined);
    console.log(user);

    uid = user.id;

    $('#name').val(user.name);
    $('#surname').val(user.surname);
    $('#sex').val(user.sex);

    let birthday = user.birthday.split('/');
    $('#day').val(birthday[0]);
    $('#month').val(birthday[1]);
    $('#year').val(birthday[2]);
    
    $('#city').val(user.city);
    $('#cf').val(user.cf);
    $('#role').val(user.role);
});

var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonth = currentDate.getMonth() + 1;
var currentYear = currentDate.getFullYear();
let errorToast = undefined;
let confirmToast = undefined;

// If C.F. is valid fill some of the fields
$('#cf').on('input', () => {
    let cf = $('#cf').val();
    let alpha = 'ABCDEHLMPRST';

    if (cf.length === 16) {
        let year = Number(cf.slice(6, 8));  
        year = Number(Number((String(currentYear).slice(2)) > year ? '20' : '19') + (year < 10 ? '0' + String(year) : String(year)));
        let month = cf.slice(8, 9);
        let day = Number(cf.slice(9, 11));

        if (day > 31) {
            day -= 40;
            $('#sex').val('F');
        }
        else {
            $('#sex').val('M');
        }

        $('#day').val(String(day));
        $('#month').val(String(alpha.indexOf(month) + 1));
        $('#year').val(year);
    }
});

// Check the invalid fields and report them, otherwise ask if sure
$('#pre-modify-user').on('click', () => {
    let sex = $('#sex').val();
    let day = $('#day').val();
    let month = $('#month').val();
    let year = $('#year').val();
    let city = $('#city').val();
    let cf = $('#cf').val();
    let role = $('#role').val();

    let errorStackTrace = [];

    if (sex === 'undefined') {
        errorStackTrace.push('SESSO');
    }
    if (city === 'undefined') {
        errorStackTrace.push('COMUNE DI RESIDENZA');
    }
    if (!checkCF(cf)) {
        errorStackTrace.push('CODICE FISCALE');
    }
    if (role === 'undefined') {
        errorStackTrace.push('INCARICO');
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

// If the user is sure send the data to the main process
$('#modify-user').on('click', async () => {
    let day = Number($('#day').val());
    let month = Number($('#month').val());
    let path = $('#pic')[0].files[0];
    if (path === undefined) {
        path = '';
    }
    else {
        path = path.path
    }
    
    console.log($('#pic'));
    const user = {
        id: uid,
        name: $('#name').val(),
        surname: $('#surname').val(),
        sex: $('#sex').val(),
        birthday: day + '/' + month + '/' + $('#year').val(),
        cf: $('#cf').val(),
        city: $('#city').val(),
        role: $('#role').val(),
        pic: path
    };
    
    const res = await window.db.modifyUser(user);

    console.log(res);
});