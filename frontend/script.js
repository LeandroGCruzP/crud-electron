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
    .then(res => console.log('Deu certo', res))
    .catch(err => console.log('Deu errado', err))
}
