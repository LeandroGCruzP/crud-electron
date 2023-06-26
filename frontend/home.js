const username = sessionStorage.getItem("username")
const token = sessionStorage.getItem("token")

const userLogged = document.querySelector(".user-logged")
userLogged.textContent = username

fetch("http://192.168.0.159:4000/api/devices", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(res => {
    const tbody = document.querySelector("tbody")

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

fetch("http://192.168.0.159:4000/api/system/ports", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(res => {
    const serialPort = document.querySelector("#serial-port")

    res.ports.map(port => {
      const option = `<option value="${port}">${port}</option>`

      serialPort.innerHTML += option
    })
  })
  .catch(err => console.log(err))


const toast = document.getElementById("toast")
const toastText = document.getElementById("toast-error")

const modal = document.querySelector(".modal")
const btnOpenModal = document.querySelector(".btn-create")
const btnCloseModal = document.querySelector(".btn-close")
const btnCancelModal = document.querySelector(".btn-cancel")
const btnLogout = document.querySelector(".btn-logout")

const form = document.querySelector("form")
const inputName = document.getElementById("name")
const selectSerialPort = document.getElementById("serial-port")
const inputSerialPort = document.getElementById("editable-serial-port")
const btnLoadSerialPort = document.getElementById("btn-load-serial-port")
const textInfoModelVersion = document.getElementById("info-model-version")
const textInfoSerialNumber = document.getElementById("info-serial-number")
const checkboxConnectionMode = document.getElementById("connection-mode")
const inputSerialNumber = document.getElementById("serial-number")
const copyToClipboard = document.getElementById("copy-to-clipboard")
const selectSyncMode = document.getElementById("sync-mode")
const inputRemoteQueue = document.getElementById("remote-queue")
const inputDefaultRemoteItem = document.getElementById("remote-item")

inputSerialPort.value = selectSerialPort.value

inputRemoteQueue.value = ""
inputRemoteQueue.disabled = true
inputRemoteQueue.style.cursor = "not-allowed"
inputRemoteQueue.style.backgroundColor = "#EEEEEE"

inputDefaultRemoteItem.value = ""
inputDefaultRemoteItem.disabled = true
inputDefaultRemoteItem.style.cursor = "not-allowed"
inputDefaultRemoteItem.style.backgroundColor = "#EEEEEE"

btnOpenModal.addEventListener("click", openModal)
btnCloseModal.addEventListener("click", closeModal)
btnCancelModal.addEventListener("click", closeModal)
btnLogout.addEventListener("click", logout)

form.addEventListener("submit", createDevice)
checkboxConnectionMode.addEventListener("click", handleCheckbox)
btnLoadSerialPort.addEventListener("mouseover", () => btnLoadSerialPort.style.filter = "brightness(1.2)")
btnLoadSerialPort.addEventListener("mouseleave", () => btnLoadSerialPort.style.filter = "brightness(1)")
btnLoadSerialPort.addEventListener("click", handleLoadSerialPort)

selectSerialPort.addEventListener("change", () => inputSerialPort.value = selectSerialPort.value)
inputSerialPort.addEventListener("input", () => selectSerialPort.value = inputSerialPort.value)
selectSerialPort.addEventListener("click", () => inputSerialPort.value = selectSerialPort.value)
inputSerialPort.addEventListener("focus", () => selectSerialPort.style.border = "1px solid #CA0000")
inputSerialPort.addEventListener("focusout", () => selectSerialPort.style.border = "1px solid #E2E2E2")

copyToClipboard.addEventListener("click", handleCopyToClipboard)
selectSyncMode.addEventListener("change", handleSyncMode)


function handleLoadSerialPort () {
  fetch("http://192.168.0.159:4000/api/system/serial", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      res.devices.map(device => {
        if(inputSerialPort.value === device.port) {
          inputSerialNumber.value = device.serialNumber
          textInfoModelVersion.innerHTML = `Modelo: ${device.model} | Versão: ${device.fw_ver}`
          textInfoSerialNumber.innerHTML = `Número Serial: ${device.serialNumber}`
        }
      })
    })
    .catch(err => console.log(err))
}

function handleCopyToClipboard() {
  const text = inputSerialNumber.value

  navigator.clipboard.writeText(text)
    .then(() => {
      toast.style.display = "flex"
      toast.style.zIndex = "9999999"
      toast.style.backgroundColor = "#009688"
      toastText.innerHTML = "Número serial copiado"
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error)
    })
    .finally(() => {
      setTimeout(() => {
        toast.style.display = "none"
      }, 3000)
    })
}

function createDevice (event) {
  event.preventDefault()

  const deviceData = {
    name: inputName.value,
    serialPort: inputSerialPort.value,
    connectionMode: checkboxConnectionMode.checked ? "Auto" : "Fixed",
    serialNumber: inputSerialNumber.value,
    syncMode: selectSyncMode.value,
    remoteQueue: inputRemoteQueue.value,
    defaultRemoteItem: inputDefaultRemoteItem.value,
  }

  fetch("http://192.168.0.159:4000/api/devices", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(deviceData)
  })
    .then(res => {
      if (!res.ok) {
        if(res.status === 401) {
          toast.style.display = "flex"
          toast.style.backgroundColor = "#A80000"
          toastText.innerHTML = "Usuário sem token de acesso"

          // logout
          sessionStorage.clear()
          window.location.href = "./index.html"

          throw new Error("Usuário sem token de acesso")
        }

        toast.style.display = "flex"
        toast.style.backgroundColor = "#A80000"
        toastText.innerHTML = "Erro ao adicionar dispositivo"
        throw new Error("Erro ao adicionar dispositivo")
      }

      return res.json()
    })
    .then(() => {
      toast.style.display = "flex"
      toast.style.backgroundColor = "#009688"
      toastText.innerHTML = "Dispositivo adicionado com sucesso"

      closeModal()
    })
    .catch(err => console.log(err))
    .finally(() => {
      setTimeout(() => {
        toast.style.display = "none"
      }, 3000)
    })
}

function logout () {
  sessionStorage.clear()
  window.location.href = "./index.html"
}

function closeModal () {
  inputName.value = ""
  selectSerialPort.selectedIndex = 0
  checkboxConnectionMode.checked = false
  inputSerialNumber.value = ""
  selectSyncMode.selectedIndex = 0
  inputRemoteQueue.value = ""
  inputDefaultRemoteItem.value = ""

  selectSerialPort.disabled = false
  selectSerialPort.style.cursor = "auto"
  inputSerialPort.disabled = false
  inputSerialPort.style.cursor = "text"
  btnLoadSerialPort.disabled = false
  btnLoadSerialPort.style.cursor = "pointer"
  btnLoadSerialPort.style.backgroundColor = "#A80000"

  modal.close()
}

function openModal () {
  inputSerialPort.value = selectSerialPort.value

  modal.showModal()
}

function handleCheckbox () {
  if (checkboxConnectionMode.checked) {
    selectSerialPort.value = ""
    selectSerialPort.disabled = true
    selectSerialPort.style.cursor = "not-allowed"
    selectSerialPort.style.backgroundColor = "#EEEEEE"

    inputSerialPort.value = ""
    inputSerialPort.disabled = true
    inputSerialPort.style.cursor = "not-allowed"

    btnLoadSerialPort.disabled = true
    btnLoadSerialPort.style.cursor = "not-allowed"
    btnLoadSerialPort.style.backgroundColor = "#878787"
    btnLoadSerialPort.style.filter = "brightness(1)"

    inputSerialNumber.value = ""
    inputSerialNumber.disabled = true
    inputSerialNumber.style.cursor = "not-allowed"
    inputSerialNumber.style.backgroundColor = "#EEEEEE"

    copyToClipboard.style.cursor = "not-allowed"
  } else {
    selectSerialPort.selectedIndex = 0
    selectSerialPort.disabled = false
    selectSerialPort.style.cursor = "auto"
    selectSerialPort.style.backgroundColor = "transparent"

    inputSerialPort.disabled = false
    inputSerialPort.style.cursor = "text"
    inputSerialPort.value = selectSerialPort.value

    btnLoadSerialPort.disabled = false
    btnLoadSerialPort.style.cursor = "pointer"
    btnLoadSerialPort.style.backgroundColor = "#A80000"

    inputSerialNumber.disabled = false
    inputSerialNumber.style.cursor = "text"
    inputSerialNumber.style.backgroundColor = "transparent"

    copyToClipboard.style.cursor = "pointer"
  }
}

function handleSyncMode () {
  const collection = {
    Local() {
      inputRemoteQueue.value = ""
      inputRemoteQueue.disabled = true
      inputRemoteQueue.style.cursor = "not-allowed"
      inputRemoteQueue.style.backgroundColor = "#EEEEEE"

      inputDefaultRemoteItem.value = ""
      inputDefaultRemoteItem.disabled = true
      inputDefaultRemoteItem.style.cursor = "not-allowed"
      inputDefaultRemoteItem.style.backgroundColor = "#EEEEEE"
    },
    Remote() {
      inputRemoteQueue.disabled = false
      inputRemoteQueue.style.cursor = "text"
      inputRemoteQueue.style.backgroundColor = "transparent"

      inputDefaultRemoteItem.disabled = false
      inputDefaultRemoteItem.style.cursor = "text"
      inputDefaultRemoteItem.style.backgroundColor = "transparent"
    },
    Both() {
      inputRemoteQueue.disabled = false
      inputRemoteQueue.style.cursor = "text"
      inputRemoteQueue.style.backgroundColor = "transparent"

      inputDefaultRemoteItem.disabled = false
      inputDefaultRemoteItem.style.cursor = "text"
      inputDefaultRemoteItem.style.backgroundColor = "transparent"
    }
  }

  collection[selectSyncMode.value]()
}
