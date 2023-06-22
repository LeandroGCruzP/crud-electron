const form = document.querySelector("form")

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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  })
    .then(res => {
      if (!res.ok) {
        const tooltip = document.getElementById("tooltip")
        const tooltipText = document.getElementById("tooltip-error")

        if(res.status === 401) {
          tooltip.style.display = 'flex'
          tooltipText.innerHTML = 'Usuário ou senha inválidos'
          throw new Error('Usuário ou senha inválidos')
        }

        tooltip.style.display = 'flex'
        tooltipText.innerHTML = 'Servidor indisponível'
        throw new Error('Servidor indisponível')
      }

      return res.json()
    })
    .then(res => {
      sessionStorage.setItem("username", loginData.username)
      sessionStorage.setItem("token", res.token)
      window.location.href = 'home.html'
    })
    .catch(err => console.log(err))
    .finally(() => {
      setTimeout(() => {
        tooltip.style.display = "none"
      }, 3000)
    })
}
