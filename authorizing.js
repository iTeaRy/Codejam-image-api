let isLogin = false;
const login = document.getElementById('login');
const userName = document.getElementById('user');
const userAvatar = document.getElementById('avatar');
login.addEventListener('click', (e) => {
    if(!isLogin) {
        e.preventDefault()
        const authenticator = new netlify.default ({})
        authenticator.authenticate({provider:"github", scope: "user"}, (err, data) => {
            if (err) {
                alert(`Error Authenticating with GitHub: ${err}`);
            } else {
                getResponse(data.token);
            }

        });
    } else {
        unSetUserData();
    }


});

function unSetUserData () {
    login.innerHTML = 'Login with GitHub';
    userName.innerHTML = `Incognito`;
    userAvatar.style.background  = '#000000';
}

function setUserData (data) {
    login.innerHTML = 'Login out';
    userName.innerHTML = `You login as ${data.login}`;
    userAvatar.style.backgroundImage  = `url(${data.avatar_url})`;
    userAvatar.style.backgroundSize = 'contain';
}

async function getResponse(token) {
    const resp =  await fetch('https://api.github.com/user',
        {
            headers: {
                'Authorization': `token ${token}`,
            }
        });
    let data = await resp.json();
    setUserData(data);
}