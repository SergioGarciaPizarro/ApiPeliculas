const todasPeliculasPaginas = "https://api.themoviedb.org/3/discover/movie?&language=es-ES&api_key=55ea98affd7c0e06727d66ee478d4107&page=";
const peliculasConId = "https://api.themoviedb.org/3/movie/";
const imagenesDeApi = "https://image.tmdb.org/t/p/original";

const api_key = "?language=es-ES&api_key=55ea98affd7c0e06727d66ee478d4107";
let numPagina = 1;
let totalPaginas = 500;

const contenido = document.getElementById("contenido");
const paginacion = document.getElementById("paginacion");


obtenerDatosPeliculas(numPagina);


function obtenerDatosPeliculas(numPagina) {
  let urlApiFinal = `${todasPeliculasPaginas}${numPagina}`
  fetch(urlApiFinal)
    .then(response => response.json())
    .then(peliculas => {
      contenido.innerHTML = "";
      let arrayPeliculas = [];

      peliculas.results.forEach(listaDePeliculas => {

        let titulo = listaDePeliculas.title;
        let idPelicula = listaDePeliculas.id;
        let mediaVotos = listaDePeliculas.vote_average;
        let descripcion = listaDePeliculas.overview;
        let urlImagenApi = `${imagenesDeApi}${listaDePeliculas.poster_path}`;


        let obj = { "titulo": titulo, "idPelicula": idPelicula, "mediaVotos": mediaVotos, "descripcion": descripcion, "urlImagenApi": urlImagenApi };

        arrayPeliculas.push(obj);
      });

      arrayPeliculas.forEach(peliculas => {
        contenido.innerHTML += `<div id="informacion" class="row">
      <div class="col-3 ">
        <img class="w-100" src="${peliculas.urlImagenApi}" alt="Title">
      </div>
      <div class="card-body col-9">
        <div id="descripcion" class="h-100 w-100 d-flex justify-content-center align-content-center flex-column gap-2">
          <div class="h-25 w-100 d-flex justify-content-center justify-content-center align-items-center flex-column ">
            <h1 class="card-title">${peliculas.titulo}</h1>
            <div id="nota" class="bg-primary rounded-3">${peliculas.mediaVotos}</div>
          </div>
          <div class="w-100 h-50 justify-content-center ">
            <p>
            ${peliculas.descripcion}
            </p>
          </div>
          <div class="h-25 w-100 d-flex justify-content-center justify-content-center align-items-center gap-5 ">
            <button id="masInfo" value="${peliculas.idPelicula}" class="btn btn-primary w-25 ">Más información</button>
            <button id="anadirFav" value="${peliculas.idPelicula}" class="btn btn-primary w-25 ">Añadir a favoritos</button>
          </div>
        </div>
      </div>
    </div>`;
      });
      
      Array.from(document.querySelectorAll("button#masInfo")).forEach((e)=>{
        e.addEventListener("click", ()=>{
          window.location.href = `./masInfo/masInfo.html?id=${e.value}`;
        })
      })
      Array.from(document.querySelectorAll("button#anadirFav")).forEach((e)=>{
        e.addEventListener("click", ()=>{        
          window.location.href = `./favoritos/favoritos.html?id=${e.value}`;
        })
      })   
    
    });
}


let numPagActual = 3;

crearEnlacesPaginacion(numPagActual);

function crearEnlacesPaginacion(numPagActual) {
  paginacion.innerHTML = "";

  const prevButton = document.createElement("a");
  prevButton.href = "#";
  prevButton.textContent = "Anterior";
  prevButton.classList.add("prev-next");
  prevButton.addEventListener("click", function () {
    if (numPagina > 1) {
      numPagina--;
      obtenerDatosPeliculas(numPagina);
      crearEnlacesPaginacion(numPagina);
    }
  });
  paginacion.appendChild(prevButton);

  const nextButton = document.createElement("a");
  nextButton.href = "#";
  nextButton.textContent = "Siguiente";
  nextButton.classList.add("prev-next");
  nextButton.addEventListener("click", function () {
    if (numPagina < totalPaginas) {
      numPagina++;
      obtenerDatosPeliculas(numPagina);
      crearEnlacesPaginacion(numPagina);
    }
  });

  const tresPuntos = document.createElement("a");
  tresPuntos.href = "#";
  tresPuntos.textContent = "...";
  tresPuntos.classList.add("prev-next");

  const tresPuntosInicio = document.createElement("a");
  tresPuntosInicio.href = "#";
  tresPuntosInicio.textContent = "...";
  tresPuntosInicio.classList.add("prev-next");
  

  const primeraPag = document.createElement("a");
  primeraPag.href = "#";
  primeraPag.textContent = "1";
  paginacion.appendChild(primeraPag);
  primeraPag.addEventListener("click", function () {
    
      numPagActual = 3;
      obtenerDatosPeliculas(1);
      crearEnlacesPaginacion(3);
   
  });
  paginacion.appendChild(tresPuntosInicio);
  const ultimaPag = document.createElement("a");
  ultimaPag.href = "#";
  ultimaPag.textContent = "500";
  ultimaPag.addEventListener("click", function () {
      numPagActual = 498;
      obtenerDatosPeliculas(500);
      crearEnlacesPaginacion(498);
  });


  for (let i = numPagActual -1; i <= numPagActual + 1; i++) {
    const enlace = document.createElement("a");
    enlace.href = "#";
    enlace.textContent = i;
    if (i === numPagina) {
      enlace.classList.add("active");
    }
    enlace.addEventListener("click", function () {
      numPagina = i;
      numPagActual = i + 1;
      obtenerDatosPeliculas(numPagina);
      crearEnlacesPaginacion(numPagina);
    });
    paginacion.appendChild(enlace);
  }
  paginacion.appendChild(tresPuntos);
  paginacion.appendChild(ultimaPag);
  paginacion.appendChild(nextButton);
}


document.addEventListener("DOMContentLoaded", function () {
  const inputNumPag = document.getElementById("inputNumPag");
  const buscar = document.getElementById("icono");

  buscar.addEventListener("click", function () {
    const paginaIntroducida = parseInt(inputNumPag.value);
    if (paginaIntroducida > 0 && paginaIntroducida <= totalPaginas) {
      numPagina = paginaIntroducida;
      obtenerDatosPeliculas(numPagina);
      crearEnlacesPaginacion(numPagina);
    } else {
      alert("Por favor, introduce un número de página válido (1-500).");
    }
  });
});



