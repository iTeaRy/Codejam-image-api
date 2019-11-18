const authorizingBtn = document.getElementById('authorizing');
const clienId = 'b55df3b0d2e53b36ec7c';
const clientSecret = '6b9f7f50d4618c19d0dd6c758604e46e3b4f0c95';
const callback = 'https://iteary.github.io/Codejam-image-api';
const anchorTag = document.getElementById('login');
const userName = document.getElementById('user');
const userAvatar = document.getElementById('avatar');
anchorTag.addEventListener('click', (e) => {
    e.preventDefault()
    const authenticator = new netlify.default ({})
    authenticator.authenticate({provider:"github", scope: "user"}, (err, data) => {
        if (err) {
            alert(`Error Authenticating with GitHub: ${err}`);
        } else {
            getResponse(data.token);
        }

    });

});

function setUserData (data) {
    userName.innerHTML = `You login as ${data.login}`;
    userAvatar.style.background = url(`${data.avatar_url}`);
}

async function getResponse(token) {
    const resp =  await fetch('https://api.github.com/user',
        {
            headers: {
                'Authorization': `token ${token}`,
            }
        });
    let data = await resp.json();
    console.log(data);
    setUserData(data);
}