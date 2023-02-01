function toggleModel() {
  const html = document.documentElement

  html.classList.toggle("light")
  const img = document.querySelector("#profile img")

  if(html.classList.contains('light')){
    img.setAttribute('src', './assets/profile-white.jpeg')
    img.setAttribute("alt", "foto de Adenilson com a cabeça um pouco levantada com o braço na testa e olhos fechados.")

  }else{
    img.setAttribute('src', './assets/profile.jpeg')
    img.setAttribute('alt','foto de Adenilson com a cabeça baixa usando um oculos e com os olhos quase fechados.')
  }

}