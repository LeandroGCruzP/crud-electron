const ERROR_MESSAGE = {
  401: "Usuário ou senha inválidos",
  500: "Servidor indisponível"
}

const form = document.querySelector("form")

const containerToast = document.getElementById("toast")
const spanToast = document.getElementById("toast-error")

form.addEventListener("submit", onSubmit)

function onSubmit (event) {
  event.preventDefault()

  const username = document.getElementById("username")
  const password = document.getElementById("password")

  const loginData = {
    username: username.value,
    password: password.value
  }

  fetch("http://192.168.0.159:4000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  })
    .then(res => {
      if (!res.ok) {
        toast("error", ERROR_MESSAGE[res.status])
        throw new Error(ERROR_MESSAGE[res.status])
      }

      return res.json()
    })
    .then(res => {
      sessionStorage.setItem("username", loginData.username)
      sessionStorage.setItem("token", res.token)
      window.location.href = "home.html"
    })
    .catch(err => {
      if (err.message === "Failed to fetch") {
        toast("error", ERROR_MESSAGE[500])
      }

      console.error("[ERROR LOGIN] >", err.message)
    })
}

function toast (type, message) {
  if (type === "error") {
    containerToast.style.display = "flex"
    containerToast.style.backgroundColor = "#A80000"
    spanToast.innerHTML = message

    setTimeout(() => containerToast.style.display = "none", 3000)
  }

  if (type === "success") {
    containerToast.style.display = "flex"
    containerToast.style.backgroundColor = "#009688"
    spanToast.innerHTML = message

    setTimeout(() => containerToast.style.display = "none", 3000)
  }
}
