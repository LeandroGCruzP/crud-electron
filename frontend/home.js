// * --------------------------- Session storage ---------------------------
const username = sessionStorage.getItem("username")
const token = sessionStorage.getItem("token")

// * --------------------------- Elements from DOM ---------------------------
const containerToast = document.querySelector("#toast")
const spanToast = document.querySelector("#toast-error")

const modal = document.querySelector(".modal")
const btnOpenModal = document.querySelector(".btn-create")
const btnCloseModal = document.querySelector(".btn-close")
const btnCancelModal = document.querySelector(".btn-cancel")
const btnLogout = document.querySelector(".btn-logout")

const form = document.querySelector("form")
const inputName = document.querySelector("#name")
const selectSerialPort = document.querySelector("#serial-port")
const inputSerialPort = document.querySelector("#editable-serial-port")
const btnLoadSerialPort = document.querySelector("#btn-load-serial-port")
const containerFormField = document.querySelector(".container-form-field")
const spanInfoModelVersion = document.querySelector("#info-model-version")
const spanInfoSerialNumber = document.querySelector("#info-serial-number")
const checkboxConnectionMode = document.querySelector("#connection-mode")
const inputSerialNumber = document.querySelector("#serial-number")
const iconCopyToClipboard = document.querySelector("#copy-to-clipboard")
const selectSyncMode = document.querySelector("#sync-mode")
const inputRemoteQueue = document.querySelector("#remote-queue")
const inputDefaultRemoteItem = document.querySelector("#remote-item")

const spanUserLogged = document.querySelector(".user-logged")

// * --------------------------- Initial values to elements ---------------------------
inputRemoteQueue.value = ""
inputRemoteQueue.disabled = true
inputRemoteQueue.style.cursor = "not-allowed"
inputRemoteQueue.style.backgroundColor = "#EEEEEE"

inputDefaultRemoteItem.value = ""
inputDefaultRemoteItem.disabled = true
inputDefaultRemoteItem.style.cursor = "not-allowed"
inputDefaultRemoteItem.style.backgroundColor = "#EEEEEE"

inputSerialPort.value = selectSerialPort.value

spanUserLogged.textContent = username

// * --------------------------- Add event listeners ---------------------------
btnOpenModal.addEventListener("click", openModal)
btnCloseModal.addEventListener("click", closeModal)
btnCancelModal.addEventListener("click", closeModal)
btnLogout.addEventListener("click", logout)

form.addEventListener("submit", createDevice)
checkboxConnectionMode.addEventListener("click", handleCheckbox)
iconCopyToClipboard.addEventListener("click", handleCopyToClipboard)
selectSyncMode.addEventListener("change", handleSyncMode)

selectSerialPort.addEventListener("change", () => inputSerialPort.value = selectSerialPort.value)
selectSerialPort.addEventListener("click", () => inputSerialPort.value = selectSerialPort.value)
btnLoadSerialPort.addEventListener("click", handleLoadSerialPort)
btnLoadSerialPort.addEventListener("mouseover", () => btnLoadSerialPort.style.filter = "brightness(1.2)")
btnLoadSerialPort.addEventListener("mouseleave", () => btnLoadSerialPort.style.filter = "brightness(1)")
inputSerialPort.addEventListener("input", () => selectSerialPort.value = inputSerialPort.value)
inputSerialPort.addEventListener("focus", () => selectSerialPort.style.border = "1px solid #CA0000")
inputSerialPort.addEventListener("focusout", () => selectSerialPort.style.border = "1px solid #E2E2E2")

// * Validate fields
inputName.addEventListener("input", e => {
  const errorMessage = inputName.parentNode.querySelector(".error-message")

  if (!errorMessage && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessage && e.target.value !== "") {
    errorMessage.remove()
  }
})

inputSerialPort.addEventListener("input", e => {
  const errorMessage = containerFormField.parentNode.querySelector(".error-message")

  if (!errorMessage && e.target.value === "") {
    setSpanError(containerFormField, "Este campo é obrigatório")
  } else if (errorMessage && e.target.value !== "") {
    errorMessage.remove()
  }
})

checkboxConnectionMode.addEventListener("click", () => {
  const errorMessage = containerFormField.parentNode.querySelector(".error-message")
  const errorMessageSerialNumber = inputSerialNumber.parentNode.querySelector(".error-message")

  if (!errorMessage && !checkboxConnectionMode.checked && selectSerialPort.value === "") {
    setSpanError(containerFormField, "Este campo é obrigatório")
  } else if (errorMessage && checkboxConnectionMode.checked) {
    errorMessage.remove()
  }

  if (!errorMessageSerialNumber && checkboxConnectionMode.checked && selectSerialPort.value === "") {
    setSpanError(inputSerialNumber, "Este campo é obrigatório")
  } else if (errorMessageSerialNumber && !checkboxConnectionMode.checked) {
    errorMessageSerialNumber.remove()
  }
})

inputSerialNumber.addEventListener("input", e => {
  const errorMessage = inputSerialNumber.parentNode.querySelector(".error-message")

  if (!errorMessage && checkboxConnectionMode.checked && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessage && e.target.value !== "") {
    errorMessage.remove()
  }
})

// * --------------------------- List all devices ---------------------------
fetch("http://192.168.0.159:4000/api/devices", {
  method: "GET",
  headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
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
  .catch(() => {
    toast("error", "Erro ao listar os dispositivos")

    logout()
  })

// * --------------------------- List all ports ---------------------------
fetch("http://192.168.0.159:4000/api/system/ports", {
  method: "GET",
  headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
})
  .then(res => res.json())
  .then(res => {
    const serialPort = document.querySelector("#serial-port")

    res.ports.map(port => {
      const option = `<option value="${port}">${port}</option>`

      serialPort.innerHTML += option
    })
  })
  .catch(() => {
    toast("error", "Erro ao listar os dispositivos")
  })

// * --------------------------- Functions ---------------------------
function createDevice (event) {
  event.preventDefault()

  // * validate fields before submit to API
  if (inputName.value === "" || (inputSerialPort.value === "" && !checkboxConnectionMode.checked) || (inputSerialNumber.value === "" && checkboxConnectionMode.checked)) {
    if (inputName.value === "") {
      const errorMessage = inputName.parentNode.querySelector(".error-message")

      !errorMessage && setSpanError(inputName, "Este campo é obrigatório")
    }

    if (inputSerialPort.value === "" && !checkboxConnectionMode.checked) {
      const errorMessage = containerFormField.parentNode.querySelector(".error-message")

      !errorMessage && setSpanError(containerFormField, "Este campo é obrigatório")
    }

    if (inputSerialNumber.value === "" && checkboxConnectionMode.checked) {
      const errorMessage = inputSerialNumber.parentNode.querySelector(".error-message")

      !errorMessage && setSpanError(inputSerialNumber, "Este campo é obrigatório")
    }

    return
  }

  const deviceData = {
    name: inputName.value,
    serialPort: inputSerialPort.value,
    connectionMode: checkboxConnectionMode.checked ? "Auto" : "Fixed",
    serialNumber: inputSerialNumber.value,
    syncMode: selectSyncMode.value,
    remoteQueue: inputRemoteQueue.value,
    defaultRemoteItem: inputDefaultRemoteItem.value,
  }

  // * Create devices
  fetch("http://192.168.0.159:4000/api/devices", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(deviceData)
  })
    .then(res => {
      if (!res.ok) {
        if(res.status === 401) {
          logout()

          toast("error", "Usuário sem token de acesso")
        }

        toast("error", "Erro ao adicionar dispositivo")
      }

      return res.json()
    })
    .then(() => {
      toast("success", "Dispositivo adicionado com sucesso")

      closeModal()
    })
    .catch(err => console.error(err))
}

function handleLoadSerialPort () {
  // * List serial number
  fetch(`http://192.168.0.159:4000/api/system/serial?port=${inputSerialPort.value}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) {
        toast("error", "Erro ao carregar porta serial")
      } else {
        return res.json()
      }
    })
    .then(res => {
      res.devices.map(device => {
        if(device.port === inputSerialPort.value) {
          inputSerialNumber.value = device.serialNumber
          spanInfoModelVersion.innerHTML = `Modelo: ${device.model} | Versão: ${device.fw_ver}`
          spanInfoSerialNumber.innerHTML = `Número Serial: ${device.serialNumber}`
        } else {
          inputSerialNumber.value = ""
          spanInfoModelVersion.innerHTML = `Modelo: - | Versão: -`
          spanInfoSerialNumber.innerHTML = `Número Serial: -`
        }
      })
    })
    .catch(() => {
      setSpanError(containerFormField, "Porta serial não identificada")

      inputSerialNumber.value = ""
      spanInfoModelVersion.innerHTML = `Modelo: - | Versão: -`
      spanInfoSerialNumber.innerHTML = `Número Serial: -`
    })
}

function handleCopyToClipboard() {
  const text = inputSerialNumber.value

  navigator.clipboard.writeText(text)
    .then(() => toast("success", "Número serial copiado"))
    .catch((error) => console.error("Failed to copy text to clipboard:", error))
}

function toast (type, message) {
  if (type === "error") {
    containerToast.style.display = "flex"
    containerToast.style.backgroundColor = "#A80000"
    spanToast.innerHTML = message

    setTimeout(() => containerToast.style.display = "none", 3000)

    throw new Error(message)
  }

  if (type === "success") {
    containerToast.style.display = "flex"
    containerToast.style.backgroundColor = "#009688"
    spanToast.innerHTML = message

    setTimeout(() => containerToast.style.display = "none", 3000)
  }
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

// function validateInput(event, parameter) {
//   const inputElement = event.target
//   const errorMessage = inputElement.parentNode.querySelector(".error-message")

//   const collection = {
//     require: () => {
//       if (!errorMessage && inputElement.value === "") {
//         setSpanError(inputElement, "Este campo é obrigatório")
//       } else if (errorMessage && inputElement.value !== "") {
//         errorMessage.remove()
//       }
//     }
//   }

//   collection[parameter]()
// }

function setSpanError (inputAbove, message) {
  const spanError = document.createElement("span")
  spanError.textContent = `* ${message}`
  spanError.classList.add("error-message")
  inputAbove.parentNode.appendChild(spanError)
}
