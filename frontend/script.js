const form = document.querySelector("form")

form.addEventListener("submit", onSubmit)

function onSubmit (event) {
  event.preventDefault()

  const username = document.getElementById("username")
  const password = document.getElementById("password")

  const credentials = {
    username: username.value,
    password: password.value
  }

  fetch("http://localhost:3333/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })
    .then(() => {
      sessionStorage.setItem("username", credentials.username)
      window.location.href = 'home.html'
    })
    .catch(err => console.log('Deu errado', err))
}
