// * ----------------------------------------------------------------------------------------------- Variables
const ERROR_MESSAGE = {
  "401-devices": "Erro ao listar os dispositivos",
  "401-ports": "Erro ao listar as portas",
  500: "Servidor indisponível"
}

const URL_API_SERVER = "http://192.168.0.159:4000/api"

// * ----------------------------------------------------------------------------------------------- Session storage
const username = sessionStorage.getItem("username")
const token = sessionStorage.getItem("token")

// * ----------------------------------------------------------------------------------------------- Elements DOM
const divToast = document.querySelector("#toast")
const spanToast = document.querySelector("#toast-error")

const modalDelete = document.querySelector(".modal-delete")
const btnCloseModalDelete = document.querySelector(".btn-close-modal-delete")
const btnCancelModalDelete = document.querySelector(".btn-cancel-modal-delete")
const modalCreate = document.querySelector(".modal-create")
const btnCloseModalCreate = document.querySelector(".btn-close-modal-create")
const btnCancelModalCreate = document.querySelector(".btn-cancel-modal-create")
const spinner = document.querySelector(".spinner")
const btnRefetchDevices = document.querySelector(".btn-refetch")
const btnOpenModalCreate = document.querySelector(".btn-create")
const btnLogout = document.querySelector(".btn-logout")

const form = document.querySelector("form")
const inputName = document.querySelector("#name")
const selectSerialPort = document.querySelector("#serial-port")
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

// * ----------------------------------------------------------------------------------------------- Initial load
inputRemoteQueue.value = ""
inputRemoteQueue.disabled = true
inputRemoteQueue.style.cursor = "not-allowed"
inputRemoteQueue.style.backgroundColor = "#EEEEEE"

inputDefaultRemoteItem.value = ""
inputDefaultRemoteItem.disabled = true
inputDefaultRemoteItem.style.cursor = "not-allowed"
inputDefaultRemoteItem.style.backgroundColor = "#EEEEEE"

spanUserLogged.textContent = username

listDevices()
listPorts()

// * ----------------------------------------------------------------------------------------------- Add event listeners
btnRefetchDevices.addEventListener("click", () => { listDevices(), listPorts() })
btnCloseModalDelete.addEventListener("click", closeModalDelete)
btnCancelModalDelete.addEventListener("click", closeModalDelete)
btnOpenModalCreate.addEventListener("click", openModalCreate)
btnCloseModalCreate.addEventListener("click", closeModalCreate)
btnCancelModalCreate.addEventListener("click", closeModalCreate)
btnLogout.addEventListener("click", logout)

form.addEventListener("submit", createDevice)
checkboxConnectionMode.addEventListener("click", handleCheckbox)
iconCopyToClipboard.addEventListener("click", copyToClipboard)
selectSyncMode.addEventListener("change", handleSyncMode)

btnLoadSerialPort.addEventListener("click", listSerialPort)
btnLoadSerialPort.addEventListener("mouseover", () => btnLoadSerialPort.style.filter = "brightness(1.2)")
btnLoadSerialPort.addEventListener("mouseleave", () => btnLoadSerialPort.style.filter = "brightness(1)")

// * Validate fields
inputName.addEventListener("input", e => {
  const errorMessageName = inputName.parentNode.querySelector(".error-message")

  if (!errorMessageName && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessageName && e.target.value !== "") {
    errorMessageName.remove()
  }
})

selectSerialPort.addEventListener("change", e => {
  const errorMessageContainerFormField = containerFormField.parentNode.querySelector(".error-message")

  if (!errorMessageContainerFormField && e.target.value === "") {
    setSpanError(containerFormField, "Este campo é obrigatório")
  } else if (errorMessageContainerFormField && e.target.value !== "") {
    errorMessageContainerFormField.remove()
  }
})

checkboxConnectionMode.addEventListener("click", () => {
  const errorMessageContainerFormField = containerFormField.parentNode.querySelector(".error-message")
  const errorMessageSerialNumber = inputSerialNumber.parentNode.querySelector(".error-message")

  if (!errorMessageContainerFormField && !checkboxConnectionMode.checked && selectSerialPort.value === "") {
    setSpanError(containerFormField, "Este campo é obrigatório")
  } else if (errorMessageContainerFormField && checkboxConnectionMode.checked) {
    errorMessageContainerFormField.remove()
  }

  if (!errorMessageSerialNumber && checkboxConnectionMode.checked && inputSerialNumber.value === "") {
    setSpanError(inputSerialNumber, "Este campo é obrigatório")
  } else if (errorMessageSerialNumber && !checkboxConnectionMode.checked) {
    errorMessageSerialNumber.remove()
  }
})

inputSerialNumber.addEventListener("input", e => {
  const errorMessageSerialNumber = inputSerialNumber.parentNode.querySelector(".error-message")

  if (!errorMessageSerialNumber && checkboxConnectionMode.checked && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessageSerialNumber && e.target.value !== "") {
    errorMessageSerialNumber.remove()
  }
})

inputRemoteQueue.addEventListener("input", e => {
  const errorMessageRemoteQueue = inputRemoteQueue.parentNode.querySelector(".error-message")

  if (!errorMessageRemoteQueue && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessageRemoteQueue && e.target.value !== "") {
    errorMessageRemoteQueue.remove()
  }
})

inputDefaultRemoteItem.addEventListener("input", e => {
  const errorMessageDefaultRemoteItem = inputDefaultRemoteItem.parentNode.querySelector(".error-message")

  if (!errorMessageDefaultRemoteItem && e.target.value === "") {
    setSpanError(e.target, "Este campo é obrigatório")
  } else if (errorMessageDefaultRemoteItem && e.target.value !== "") {
    errorMessageDefaultRemoteItem.remove()
  }
})

selectSyncMode.addEventListener("change", e => {
  const errorMessageRemoteQueue = inputRemoteQueue.parentNode.querySelector(".error-message")
  const errorMessageDefaultRemoteItem = inputDefaultRemoteItem.parentNode.querySelector(".error-message")

  if (!errorMessageRemoteQueue && e.target.value !== "Local") {
    setSpanError(inputRemoteQueue, "Este campo é obrigatório")
  } else if (errorMessageRemoteQueue && e.target.value === "Local") {
    errorMessageRemoteQueue.remove()
  }

  if (!errorMessageDefaultRemoteItem && e.target.value !== "Local") {
    setSpanError(inputDefaultRemoteItem, "Este campo é obrigatório")
  } else if (errorMessageDefaultRemoteItem && e.target.value === "Local") {
    errorMessageDefaultRemoteItem.remove()
  }
})

// * ----------------------------------------------------------------------------------------------- Functions
function listDevices () {
  spinner.style.display = "flex"

  fetch(`${URL_API_SERVER}/devices`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) {
        toast("error", ERROR_MESSAGE[`${res.status}-devices`])
        throw new Error(ERROR_MESSAGE[`${res.status}-devices`])
      }

      return res.json()
    })
    .then(res => {
      const tbody = document.querySelector("tbody")

      tbody.innerHTML = ""

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
                <div class="action-update">
                  <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.69408 17.3854L17.9508 4.12755C18.4746 3.62636 19.1737 3.35015 19.8986 3.35808C20.6234 3.366 21.3164 3.65742 21.829 4.16993C22.3417 4.68244 22.6333 5.37531 22.6414 6.10017C22.6496 6.82503 22.3735 7.52426 21.8725 8.04813L8.61358 21.306C8.31112 21.6085 7.92588 21.8146 7.50642 21.8985L3.25 22.75L4.1015 18.4925C4.1854 18.0731 4.39159 17.6878 4.69408 17.3854Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.708 7.0415L18.958 10.2915" stroke="black" stroke-width="2"/>
                  </svg>
                </div>

                <div id={${device.id}} class="action-delete">
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

      addDeleteButtonListeners()
    })
    .catch(err => {
      if (err.message === "Failed to fetch") {
        toast("error", ERROR_MESSAGE[500])
      }

      console.error("[ERROR LIST DEVICES] >", err.message)
    })
    .finally(() => {
      setTimeout(() => spinner.style.display = "none", 1000)
    })
}

function listPorts () {
  fetch(`${URL_API_SERVER}/system/ports`, {
  method: "GET",
  headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
})
  .then(res => {
    if (!res.ok) {
      toast("error", ERROR_MESSAGE[`${res.status}-ports`])
      throw new Error(ERROR_MESSAGE[`${res.status}-ports`])
    }

    return res.json()
  })
  .then(res => {
    const serialPort = document.querySelector("#serial-port")

    serialPort.innerHTML = ""

    res.ports.map(port => {
      option = `<option value="${port}">${port}</option>`

      serialPort.innerHTML += option
    })
  })
  .catch(err => {
    if (err.message === "Failed to fetch") {
      toast("error", ERROR_MESSAGE[500])
    }

    console.error("[ERROR LIST PORTS] >", err.message)
  })
}

function createDevice (event) {
  event.preventDefault()

  // * validate fields before submit to API
  if (
    inputName.value === "" ||
    (selectSerialPort.value === "" && !checkboxConnectionMode.checked) ||
    (inputSerialNumber.value === "" && checkboxConnectionMode.checked) ||
    (inputRemoteQueue.value === "" && selectSyncMode.value !== "Local") ||
    (inputDefaultRemoteItem.value === "" && selectSyncMode.value !== "Local")
  ) {
    if (inputName.value === "") {
      const errorMessageName = inputName.parentNode.querySelector(".error-message")

      !errorMessageName && setSpanError(inputName, "Este campo é obrigatório")
    }

    if (selectSerialPort.value === "" && !checkboxConnectionMode.checked) {
      const errorMessageContainerFormField = containerFormField.parentNode.querySelector(".error-message")

      !errorMessageContainerFormField && setSpanError(containerFormField, "Este campo é obrigatório")
    }

    if (inputSerialNumber.value === "" && checkboxConnectionMode.checked) {
      const errorMessageSerialNumber = inputSerialNumber.parentNode.querySelector(".error-message")

      !errorMessageSerialNumber && setSpanError(inputSerialNumber, "Este campo é obrigatório")
    }

    if (inputRemoteQueue.value === "" && selectSyncMode.value !== "Local") {
      const errorMessageRemoteQueue = inputRemoteQueue.parentNode.querySelector(".error-message")

      !errorMessageRemoteQueue && setSpanError(inputRemoteQueue, "Este campo é obrigatório")
    }

    if (inputDefaultRemoteItem.value === "" && selectSyncMode.value !== "Local") {
      const errorMessageDefaultRemoteItem = inputDefaultRemoteItem.parentNode.querySelector(".error-message")

      !errorMessageDefaultRemoteItem && setSpanError(inputDefaultRemoteItem, "Este campo é obrigatório")
    }

    return
  }

  const deviceData = {
    name: inputName.value,
    serialPort: selectSerialPort.value ? selectSerialPort.value : undefined,
    connectionMode: checkboxConnectionMode.checked ? "Auto" : "Fixed",
    serialNumber: inputSerialNumber.value ? inputSerialNumber.value : undefined,
    syncMode: selectSyncMode.value,
    remoteQueue: inputRemoteQueue.value ? inputRemoteQueue.value : undefined,
    defaultRemoteItem: inputDefaultRemoteItem.value ? inputDefaultRemoteItem.value : undefined,
  }

  fetch(`${URL_API_SERVER}/devices`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(deviceData)
  })
    .then(res => {
      if (!res.ok) {
        toast("error", "Erro ao adicionar dispositivo")
        throw new Error("Erro ao adicionar dispositivo")
      }

      toast("success", "Dispositivo adicionado com sucesso")
      listDevices()
      listPorts()
      closeModalCreate()
    })
    .catch(err => {
      console.error("[ERROR CREATE DEVICE] >", err.message)
    })
}

function listSerialPort () {
  fetch(`${URL_API_SERVER}/system/serial?port=${selectSerialPort.value}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) {
        toast("error", "Erro ao carregar porta serial")
        throw new Error("Erro ao carregar porta serial")
      }

      return res.json()
    })
    .then(res => {
      res.devices.map(device => {
        if(device.port === selectSerialPort.value) {
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
    .catch(err => {
      if (err.message === "Failed to fetch") {
        toast("error", ERROR_MESSAGE[500])
      }

      const errorMessageContainerFormField = containerFormField.parentNode.querySelector(".error-message")

      if(errorMessageContainerFormField) {
        setSpanError(containerFormField, "Porta serial não identificada")
      }

      inputSerialNumber.value = ""
      spanInfoModelVersion.innerHTML = `Modelo: - | Versão: -`
      spanInfoSerialNumber.innerHTML = `Número Serial: -`

      console.error("[ERROR LIST SERIAL NUMBER] >", err.message)
    })
}

function copyToClipboard() {
  const text = inputSerialNumber.value

  navigator.clipboard.writeText(text)
    .then(() => toast("success", "Número serial copiado"))
    .catch((error) => console.error("Failed to copy text to clipboard:", error.message))
}

function toast (type, message) {
  if (type === "error") {
    divToast.style.display = "flex"
    divToast.style.backgroundColor = "#A80000"
    spanToast.innerHTML = message

    setTimeout(() => divToast.style.display = "none", 3000)
  }

  if (type === "success") {
    divToast.style.display = "flex"
    divToast.style.backgroundColor = "#009688"
    spanToast.innerHTML = message

    setTimeout(() => divToast.style.display = "none", 3000)
  }
}

function logout () {
  sessionStorage.clear()
  window.location.href = "./index.html"
}

function closeModalCreate () {
  inputName.value = ""

  selectSerialPort.selectedIndex = 0
  selectSerialPort.disabled = false
  selectSerialPort.style.cursor = "auto"
  selectSerialPort.style.backgroundColor = "#FFFFFF"

  btnLoadSerialPort.disabled = false
  btnLoadSerialPort.style.cursor = "pointer"
  btnLoadSerialPort.style.backgroundColor = "#A80000"

  checkboxConnectionMode.checked = false

  inputSerialNumber.value = ""
  spanInfoModelVersion.innerHTML = `Modelo: - | Versão: -`
  spanInfoSerialNumber.innerHTML = `Número Serial: -`

  selectSyncMode.selectedIndex = 0

  inputRemoteQueue.value = ""
  inputRemoteQueue.disabled = true
  inputRemoteQueue.style.cursor = "not-allowed"
  inputRemoteQueue.style.backgroundColor = "#EEEEEE"

  inputDefaultRemoteItem.value = ""
  inputDefaultRemoteItem.disabled = true
  inputDefaultRemoteItem.style.cursor = "not-allowed"
  inputDefaultRemoteItem.style.backgroundColor = "#EEEEEE"

  const errorMessageName = inputName.parentNode.querySelector(".error-message")
  const errorMessageContainerFormField = containerFormField.parentNode.querySelector(".error-message")
  const errorMessageSerialNumber = inputSerialNumber.parentNode.querySelector(".error-message")
  const errorMessageRemoteQueue = inputRemoteQueue.parentNode.querySelector(".error-message")
  const errorMessageDefaultRemoteItem = inputDefaultRemoteItem.parentNode.querySelector(".error-message")

  if (errorMessageName) errorMessageName.remove()
  if (errorMessageContainerFormField) errorMessageContainerFormField.remove()
  if (errorMessageSerialNumber) errorMessageSerialNumber.remove()
  if (errorMessageRemoteQueue) errorMessageRemoteQueue.remove()
  if (errorMessageDefaultRemoteItem) errorMessageDefaultRemoteItem.remove()

  modalCreate.close()
}

function openModalCreate () {
  modalCreate.showModal()
}

function closeModalDelete () {
  modalDelete.close()
}

function addDeleteButtonListeners () {
  const btnOpenModalDeleteList = document.querySelectorAll(".action-delete");

  btnOpenModalDeleteList.forEach(btn => {
    console.log(btn.id)
    btn.addEventListener("click", () => modalDelete.showModal())
  })
}

function handleCheckbox () {
  if (checkboxConnectionMode.checked) {
    selectSerialPort.value = ""
    selectSerialPort.disabled = true
    selectSerialPort.style.cursor = "not-allowed"
    selectSerialPort.style.backgroundColor = "#EEEEEE"

    btnLoadSerialPort.disabled = true
    btnLoadSerialPort.style.cursor = "not-allowed"
    btnLoadSerialPort.style.backgroundColor = "#878787"
    btnLoadSerialPort.style.filter = "brightness(1)"
  } else {
    selectSerialPort.selectedIndex = 0
    selectSerialPort.disabled = false
    selectSerialPort.style.cursor = "auto"
    selectSerialPort.style.backgroundColor = "transparent"

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

function setSpanError (inputAbove, message) {
  const spanError = document.createElement("span")
  spanError.textContent = `* ${message}`
  spanError.classList.add("error-message")
  inputAbove.parentNode.appendChild(spanError)
}
