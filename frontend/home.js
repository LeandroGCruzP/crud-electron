function getInfoSessionStorage() {
  const username = sessionStorage.getItem('username');

  const usernameElement = document.getElementById('username')
  usernameElement.innerHTML = username
}

getInfoSessionStorage();

const iconClose = document.getElementById('iconClose');
iconClose.addEventListener('click', handleCloseApplication)

function handleCloseApplication () {
  sessionStorage.clear();
  window.location.href = './index.html';
}
