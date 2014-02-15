var gui = require('nw.gui');

/* Botón en la barra superior para recargar toda la aplicación. */
window.actualizar = function() {
  document.location.reload();
}
  
/* Botón en la barra superior para mostrar las herramientas de desarrollo. */
window.mostrar_herramientas_de_desarrollo = function() {
  gui.Window.get().showDevTools();
}

window.abrir_url = function(url) {
  gui.Shell.openExternal(url);
}
    
window.abrir_github_en_el_navegador = function() {
  gui.Shell.openExternal('http://github.com/hugoruscitti/pilas.git');
}

window.abrir_pilas_en_el_navegador = function() {
  gui.Shell.openExternal('http://www.pilas-engine.com.ar');
}

window.abrir_herramientas_desarrollo = function() {
  gui.Window.get().showDevTools();
}