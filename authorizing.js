const authorizingBtn = document.getElementById('authorizing');
const clienId = 'b55df3b0d2e53b36ec7c';
const clientSecret = '6b9f7f50d4618c19d0dd6c758604e46e3b4f0c95';
const callback = 'https://iteary.github.io/Codejam-image-api';
authorizingBtn.onclick = registration;
let isNew = true;

async function getAuthorizing() {
    isNew = false;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clienId}&redirect_uri=${callback}`;

}

async function registration() {
    if (isNew) { getAuthorizing() } else {

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://github.com/login/oauth/authorize', false);

        xhr.send();

// 4. Если код ответа сервера не 200, то это ошибка
        if (xhr.status != 200) {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            alert( xhr.responseText ); // responseText -- текст ответа.
        }

    }
}


