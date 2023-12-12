const DB_NAME = 'miBaseDeDatos';
const STORE_NAME = 'comentariosStore';

const URLId = `https://api.themoviedb.org/3/movie/`;
const apiKeyEs = `?language=es-ES&api_key=55ea98affd7c0e06727d66ee478d4107`;
const imagenesDeApi = "https://image.tmdb.org/t/p/original";

var parametros = new URLSearchParams(window.location.search);
var idPelicula = parametros.get(`id`);
const volver = document.getElementById("volverBoton");
const imagen = document.getElementById("imagen");
const contenido = document.getElementById("contenido");
const comentarioPuesto = document.getElementById(idPelicula);
let comentarioEscrito = comentarioPuesto ? comentarioPuesto.value : "Comentario...";

guardarComentarioEnIndexedDB(idPelicula, null)

async function guardarComentarioEnIndexedDB(idPelicula, comentario) {
    try {
        const db = await abrirIndexedDB(DB_NAME, STORE_NAME);

        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const existingObject = await getObjectFromStore(idPelicula, store);

        if (existingObject) {
            existingObject.comentario = comentario;
            store.put(existingObject);
        } else {
            store.add({ id: idPelicula, comentario: comentario });
        }

        console.log('Datos guardados o actualizados en IndexedDB');
    } catch (error) {
        console.error('Error al guardar o actualizar en IndexedDB', error);
    }
}

async function abrirIndexedDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: 'id' });
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

async function getObjectFromStore(idPelicula, store) {
    return new Promise((resolve, reject) => {
        const getRequest = store.get(idPelicula);

        getRequest.onsuccess = function () {
            resolve(getRequest.result);
        };

        getRequest.onerror = function (event) {
            reject(event.target.error);
        };
    });
}


function obtenerIdsDesdeIndexedDB() {

    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        // Obtener todos los objetos almacenados en el almacén
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function () {
            const todosLosDatos = getAllRequest.result;

            todosLosDatos.forEach(function (dato) {
                let urlFinal = `${URLId}${dato.id}${apiKeyEs}`;
                fetch(urlFinal)
                    .then(response => response.json())
                    .then(informacionApi => {
                        let resultado = informacionApi.results || [informacionApi];

                        resultado.forEach((todaInformacion) => {
                            let generos = todaInformacion.genres;
                            let titulo = todaInformacion.title;
                            let imagenFondo = `${imagenesDeApi}${todaInformacion.backdrop_path}`;

                            // Obtener el comentario existente de IndexedDB
                            const request = indexedDB.open('miBaseDeDatos', 1);
                            request.onsuccess = function (event) {
                                const db = event.target.result;
                                const transaction = db.transaction('comentariosStore', 'readonly');
                                const store = transaction.objectStore('comentariosStore');

                                const getRequest = store.get(dato.id);

                                getRequest.onsuccess = function () {

                                    let comentarioEscrito = dato.comentario ? dato.comentario : "Comentario...";

                                    contenido.innerHTML += `<div id="pelicula${dato.id}" class="d-flex w-90 h-50 flex-wrap p-0 m-0">
                                                <div id="informacion" class="row w-100 p-0 m-0">
                                                    <div id="imagenDiv" class="col-3 d-flex align-content-center align-items-center justify-content-center">
                                                        <div id="imagen" style="background-image: url('${imagenFondo}')"></div>
                                                    </div>
                                                    <div id="contenidoInformacion"
                                                        class="col-8 d-flex align-content-center align-items-center justify-content-center">
                                                        <div id="titulo" class="d-flex flex-wrap">
                                                        <div class=" d-flex w-100 align-content-center align-items-center justify-content-center">
                                                            <h1>${titulo}</h1>
                                                        </div>
                                                        <div id="generoDiv" class="w-100 d-flex  ">
                                                            <div id="generos" class="d-flex p-3">
                                                                <h4>Generos: ${generos.map((genero) => genero.name).join(", ")}</h4>
                                                            </div>
                                                            
                                                            <button id="masInfo" onclick="window.location.href='../masInfo/masInfo.html?id=${dato.id}'" class="btn btn-primary w-25">Más información</button>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div id="iconos"
                                                        class="col-1 p-0 m-0 d-flex align-content-center align-items-center justify-content-center ">
                                                        <div class="d-flex">
                                                            <div id="imagenIconos" class="d-flex">
                                                                <div id="guardar" onclick="guardarComentarioEnIndexedDB('${dato.id}', document.getElementById('${dato.id}').value)"></div>
                                                                <div id="eliminar" onclick="eliminarPelicula('${dato.id}')"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="comentario" class="row w-100 p-0 m-0">
                                                    <div class="col-12 d-flex align-content-center align-items-center justify-content-center ">
                                                        <div class="w-75"><input id="${dato.id}" type="text" class="form-control"
                                                                placeholder="${comentarioEscrito}">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
                                };
                            };
                        });
                    });
            });
        };

        transaction.oncomplete = function () {
            db.close();
        };
        transaction.onerror = function (event) {
            console.error('Error al obtener los ids en IndexedDB', event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la conexión con IndexedDB', event.target.error);
    };
}


async function eliminarPelicula(idPelicula) {
    try {

        const elementoHTML = document.getElementById(`pelicula${idPelicula}`);

        if (elementoHTML) {
            elementoHTML.remove();
        }


        const db = await abrirIndexedDB(DB_NAME, STORE_NAME);
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);


        store.delete(idPelicula);

        console.log(`Película con id ${idPelicula} eliminada del HTML y de IndexedDB`);
    } catch (error) {
        console.error('Error al eliminar la película', error);
    }
}

obtenerIdsDesdeIndexedDB(); 