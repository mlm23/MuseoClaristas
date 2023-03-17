//JSON con los idiomas de los videos y sus respectivas banderas(ruta de la imagen)
//En el JSON el primer ID comienza desde el 1 ya que la posición 0 esta reservada para la primera tecla que sale del video y vuelve al estado inicial de la aplicación
//En el caso de querer agregar más idiomas se deben colocar en el JSON respetando las rutas de las carpetas
import languaje from './../json/languaje.json' assert {type: 'json'};
let listLanguages = languaje;
//Crear las banderas del inicio con las url del JSON(urlBandera)
let containerFlags = document.createElement("div");
containerFlags.setAttribute("id","flags");
function createFlagsStart(url,alt){
  let img = document.createElement("img");
  img.setAttribute("src", url);
  img.setAttribute("alt","Bandera del idioma "+alt);
  img.setAttribute("title","Bandera del idioma "+alt);
  img.className = "imgFlag";
  img.setAttribute("id", "flagStart");
  containerFlags.insertAdjacentElement("beforeend", img);
}
listLanguages.forEach((e)=> createFlagsStart(e.urlBandera,e.name));
let containerVideo = document.getElementsByClassName("oculto");
containerVideo[0].insertAdjacentElement("beforebegin",containerFlags);

//Configuración Gamepad
let haveEvents = 'GamepadEvent' in window;
let haveWebkitEvents = 'WebKitGamepadEvent' in window;
let controllers = {};
let rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

//Cuando se conecta un mando se añade a la variable controllers
function connecthandler(e) {
  //Escribir si el gamepad esta conectado por consola
  console.log("Dispositivo conectado");
  addgamepad(e.gamepad);
}
//Agregar mando a controllers
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  rAF(updateStatus);
}
//Borrar de controller un mando desconectado
function disconnecthandler(e) {
  //Escribir si el gamepad se ha desconectado por consola
  console.log("Dispositivo desconectado");
  removegamepad(e.gamepad);
}
//Eliminar de la variable controller un mando
function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}
//Actualizar mandos y ejecutar acciones dependiendo de la tecla pulsada(Seleccionar idioma del video o salir al estado inicial de la aplicaión)
function updateStatus() {
  scangamepads();
  //Primera posición del joystick conectado al gamepad en el objeto controllers
  let index = 0;
  //Recoger la tecla que se ha pulsado en la posición del mando conectado
  let idLanguage = readKey(controllers[index].buttons);
  //Comprobar que se haya recogido un idioma pulsando la tecla
  if(idLanguage != null){
    let indexKeyOut= 0;//Tecla para salir al estado inicial de la aplicación
    if(idLanguage != indexKeyOut){//Si no es el botón de salir añadimos el video
      let filter = listLanguages.filter((e)=>e.id==idLanguage);
      let urlVideo = filter[0].url;
      let urlFlag = filter[0].urlBandera;
      let alt = filter[0].name;
      dataLanguage(urlVideo,urlFlag,alt);
    }
    else{//Botón de salir, se vuelve al estado de inicio de la aplicación
      finishVideo();
    }
  }
  rAF(updateStatus);
}
//Leer mandos conectados y actualizarlos en controllers
function scangamepads() {
  let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}
//Evento de desconectar o conectar mando
if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {//Establecer que siga buscando si se presiona una tecla
  setInterval(scangamepads, 500);
}
//Agregar evento que detecta la finalización del video y llama a la función que devuelve la aplicación a su estado inicial
document.getElementById('video').addEventListener('ended', finishVideo, false);

//Recoge los datos del idioma seleccionado en el JSON para agregar el video y su respectiva bandera 
function dataLanguage(urlVideo,urlBandera,alt){
  //Recoger el contenedor del video
  let containerMedia = document.getElementById("media");
  //Si esta null es que ha sido ocultado anteriormente
  if(containerMedia == null){
    containerMedia = document.getElementById("contenedorMedia");
  }
  //Agregar a la etiqueta video los datos
  createVideo(urlVideo);
  //Eliminar la clase oculto y colocar su id para agregarle estilos
  containerMedia.className="";
  containerMedia.setAttribute("id","media");
  //Ocultar las banderas del inicio y quitarle sus estilos
  containerFlags.className="oculto";
  containerFlags.setAttribute("id","");
  //Añadir bandera del video, si esta null es que ha sido borrada, si no, se ha cambiado el idioma de un video a otro
  let container = document.getElementById("banderaSeleccionada");
  if(container != null){
    let body = document.getElementsByTagName("body");
    let banderaVideo = document.getElementById("banderaSeleccionada");
    body[0].removeChild(banderaVideo);
  }
  //Crear la bandera del idioma seleccionado
  let containerFlagVideo = document.createElement("div");
  containerFlagVideo.setAttribute("id","banderaSeleccionada");
  let img = document.createElement("img");
  img.setAttribute("src", urlBandera);
  img.setAttribute("alt","Bandera del idioma "+alt);
  img.setAttribute("title","Bandera del idioma "+alt);
  img.className = "imgFlag";
  containerFlagVideo.insertAdjacentElement("beforeend", img);
  containerVideo[0].insertAdjacentElement("beforebegin",containerFlagVideo);
  //Ocultar Titulo
  let title = document.getElementById("titulo");
  if(title == null){
    title = document.getElementById("contenedorTitulo");
  }
  title.setAttribute("id", "contenedorTitulo");
  title.className="oculto";
}

//Agrega al elemento del video sus atributos con la url por parámetro
function createVideo(url){
  let video = document.getElementById("video");
  video.setAttribute("type", "video/mp4");
  video.setAttribute("autoplay", "");
  //Descomentar la linea de abajo si se quiere establecer controladores predefinidos del control del video
  //video.setAttribute("controls", "");
  video.src = url;
  return video
}

//Cambia el id del contenedor del video para ocultar y eliminar la bandera del idioma seleccionado
function finishVideo(){
  //Recoger contenedor del video, si esta null ha sido ocultado antes
  let containerMedia = document.getElementById("media");
  if(containerMedia == null){
    containerMedia = document.getElementById("contenedorMedia");
  }
  containerMedia.className="oculto";
  containerMedia.setAttribute("id","contenedorMedia");
  containerFlags.className="";
  containerFlags.setAttribute("id","flags");
  //Eliminar Bandera del video seleccionado
  let body = document.getElementsByTagName("body");
  let videoFlag = document.getElementById("banderaSeleccionada");
  if(videoFlag != null){
    body[0].removeChild(videoFlag);
  }
  //Quitar el oculto del titulo
  let title = document.getElementById("titulo");
  if(title == null){
    title = document.getElementById("contenedorTitulo");
  }
  title.setAttribute("id", "titulo");
  title.className="";
}

//Función que detecta la tecla pulsada del mando para seleccionar un idioma o salir(en caso de ser la primera), todas las teclas se recogen en la variable "teclasGamepad"
function readKey(keysGamepad){
  let positionKey;
  let size = keysGamepad.length;
  let find = false;
  let counter = 0;
  while(counter < size && !find){ //Bucle para recorrer todas las teclas y salir cuando se encuentre la pulsada
    if(keysGamepad[counter].pressed){
      positionKey = counter;//posicion de la tecla
      find = true;
    }
    counter++;
  }
  return positionKey;
}
