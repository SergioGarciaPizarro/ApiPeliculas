const URLId = `https://api.themoviedb.org/3/movie/`;
const URLCreditos = `/credits`;
const apiKeyEs = `?language=es-ES&api_key=55ea98affd7c0e06727d66ee478d4107`;
const imagenesDeApi = "https://image.tmdb.org/t/p/original";

var parametros = new URLSearchParams(window.location.search);
var idPelicula = parametros.get(`id`);
const contenido = document.getElementById("contenido");
const volver = document.getElementById("volverBoton");


let urlFinal = `${URLId}${idPelicula}${apiKeyEs}`;
let urlActores = `${URLId}${idPelicula}${URLCreditos}${apiKeyEs}`;




fetch(urlFinal)
  .then(response => response.json())
  .then(informacionApi => {
    let resultado = informacionApi.results || [informacionApi];

    resultado.forEach((todaInformacion) => {
      let generos = todaInformacion.genres;
      let productores = todaInformacion.production_companies;
      let fechaLanzamiento = todaInformacion.release_date;
      let tagline = todaInformacion.tagline;
      let status = todaInformacion.status;
      let duracion = todaInformacion.runtime;
      let titulo = todaInformacion.title;
      let imagenFondo = `${imagenesDeApi}${todaInformacion.backdrop_path}`;
      let poster = `${imagenesDeApi}${todaInformacion.poster_path}`;

      if (status == "Released") {
        status = "Publicada"
      } else {
        status = "Sin publicar"
      }

      // Fetch de la información de los actores
      fetch(urlActores)
        .then(response => response.json())
        .then(informacionReparto => {


          let resultados = informacionReparto.cast || [informacionReparto];

          let actores = resultados.slice(0, 5); // Obtener solo los 5 primeros actores

          let actoresArray = [];
          let directorInfo = [];

          actores.forEach((actor) => {
            let nombreActor = actor.name;
            let rutaPerfil = actor.profile_path ? `${imagenesDeApi}${actor.profile_path}` : "No disponible";

            let obj = { "nombreActor": nombreActor, "rutaPerfil": rutaPerfil };
            actoresArray.push(obj);

            // Busco el director en la api buscando el nombre ya que no esta ordenado
            informacionReparto.crew.forEach(persona => {
              if (persona.job === "Director") {
                directorInfo = {
                  nombre: persona.name,
                  rutaPerfil: persona.profile_path ? `${imagenesDeApi}${persona.profile_path}` : "No disponible",
                };
              }
            });
          });
          contenido.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${imagenFondo}")`;

          contenido.innerHTML = `
          <div id="informacion" class="row">
      <div class="col-3">
        <img id="poster" class="w-100" src="${poster}" alt="Title">
      </div>
      <div class="card-body col-9">
        <div id="descripcion" class="w-100 d-flex justify-content-center align-content-center flex-column gap-2">
          <div
            class="h-25 w-100 d-flex justify-content-center justify-content-center align-items-center flex-column gap-3">
            <h1 class="card-title">${titulo}</h1>
            <div id="lanzamiento" class="bg-primary rounded-3">${fechaLanzamiento}</div>
          </div>

          <div id="reparto" class="d-flex">
            <div class="d-flex">
              <div>
                Director:
                <div class="card d-flex align-items-center" id="Director">
                  <img class="card-img-top" id="personas" src="${directorInfo.rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${directorInfo.nombre}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div>
              Actores:
              <div id="todosActores" class="d-flex">

                <div class="card d-flex align-items-center" id="cartas">
                  <img class="card-img-top" id="personas" src="${actoresArray[0].rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${actoresArray[0].nombreActor}</h4>
                  </div>
                </div>

                <div class="card d-flex align-items-center" id="cartas">
                  <img class="card-img-top" id="personas" src="${actoresArray[1].rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${actoresArray[1].nombreActor}</h4>
                  </div>
                </div>

                <div class="card d-flex align-items-center" id="cartas">
                  <img class="card-img-top" id="personas" src="${actoresArray[2].rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${actoresArray[2].nombreActor}</h4>
                  </div>
                </div>

                <div class="card d-flex align-items-center" id="cartas">
                  <img class="card-img-top" id="personas" src="${actoresArray[3].rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${actoresArray[3].nombreActor}</h4>
                  </div>
                </div>

                <div class="card d-flex align-items-center" id="cartas">
                  <img class="card-img-top" id="personas" src="${actoresArray[4].rutaPerfil}" alt="Title" />
                  <div class="card-body">
                    <h4>${actoresArray[4].nombreActor}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class=" d-flex w-100">
            <div class="laInformacion">
              <h1>${tagline}</h1>
              <pre>
              Generos               -> ${generos.map((genero) => genero.name).join(", ")} 
              Productores           -> ${productores.map((productor) => productor.name).join(", ")}
              Estado de la pelicula -> ${status}
              Duración              -> ${duracion} m
              </pre>
            </div>
          </div>
        </div>
        <div id="" class="">
          <div class="h-25 w-100 d-flex justify-content-center justify-content-center align-items-center gap-5 ">
            <button id="volverBoton" class="btn btn-primary w-25"
              onclick="window.location.href='../index.html'">Volver</button>
            <button id="anadirFav" class="btn btn-primary w-25 "
            onclick="window.location.href='../favoritos/favoritos.html?id=${idPelicula}'">Añadir a favoritos</button>
          </div>
        </div>
      </div>
    </div>
           `;
        });
    });

  });

