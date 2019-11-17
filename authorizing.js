const authorizingBtn = document.getElementById('authorizing');
const clienId = 'b55df3b0d2e53b36ec7c';
const clientSecret = '6b9f7f50d4618c19d0dd6c758604e46e3b4f0c95';
const callback = 'https://iteary.github.io/Codejam-image-api/callback';
authorizingBtn.onclick = getAuthorizing;

function getAuthorizing() {
    window.location = `https://github.com/login/oauth/authorize?client_id=${clienId}&redirect_uri=${callback}`;
}