const authorizingBtn = document.getElementById('authorizing');
const clienId = 'b55df3b0d2e53b36ec7c';
const clientSecret = '6b9f7f50d4618c19d0dd6c758604e46e3b4f0c95';
const callback = 'https://iteary.github.io/Codejam-image-api';
netlifyIdentity.open();

// Get the current user:
const user = netlifyIdentity.currentUser();

// Bind to events
netlifyIdentity.on('init', user => console.log('init', user));
netlifyIdentity.on('login', user => console.log('login', user));
netlifyIdentity.on('logout', () => console.log('Logged out'));
netlifyIdentity.on('error', err => console.error('Error', err));
netlifyIdentity.on('open', () => console.log('Widget opened'));
netlifyIdentity.on('close', () => console.log('Widget closed'));

// Close the modal
netlifyIdentity.close();

// Log out the user
netlifyIdentity.logout();


