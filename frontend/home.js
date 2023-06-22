function getInfoSessionStorage() {
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('token');

  const usernameElement = document.getElementById('username')
  usernameElement.textContent = username

  fetch("http://192.168.0.159:4000/api/devices", {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log(res)

      const tbody = document.getElementById('tbody');

      res.devices.map(device => {
        const row = `
          <tr>
            <td>${device.name}</td>
            <td>${device.localQueue}</td>
            <td>${device.serialPort}</td>
            <td>${device.serialNumber}</td>
            <td>${device.syncMode}</td>
            <td>${device.syncStatus}</td>
            <td>
              <div class="actions">
                <div class="action">
                  <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.69408 17.3854L17.9508 4.12755C18.4746 3.62636 19.1737 3.35015 19.8986 3.35808C20.6234 3.366 21.3164 3.65742 21.829 4.16993C22.3417 4.68244 22.6333 5.37531 22.6414 6.10017C22.6496 6.82503 22.3735 7.52426 21.8725 8.04813L8.61358 21.306C8.31112 21.6085 7.92588 21.8146 7.50642 21.8985L3.25 22.75L4.1015 18.4925C4.1854 18.0731 4.39159 17.6878 4.69408 17.3854Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.708 7.0415L18.958 10.2915" stroke="black" stroke-width="2"/>
                  </svg>
                </div>

                <div class="action">
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.99967 22.1667C6.99967 22.7855 7.24551 23.379 7.68309 23.8166C8.12068 24.2542 8.71417 24.5 9.33301 24.5H18.6663C19.2852 24.5 19.8787 24.2542 20.3163 23.8166C20.7538 23.379 20.9997 22.7855 20.9997 22.1667V8.16667H6.99967V22.1667ZM9.33301 10.5H18.6663V22.1667H9.33301V10.5ZM18.083 4.66667L16.9163 3.5H11.083L9.91634 4.66667H5.83301V7H22.1663V4.66667H18.083Z" fill="#FF0000"/>
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        `

        tbody.innerHTML += row
      })
    })
    .catch(err => console.log(err))
}

getInfoSessionStorage();

const iconClose = document.getElementById('iconClose');
iconClose.addEventListener('click', handleCloseApplication)

function handleCloseApplication () {
  sessionStorage.clear();
  window.location.href = './index.html';
}
