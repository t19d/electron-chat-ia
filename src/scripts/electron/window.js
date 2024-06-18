const { BrowserWindow } = require("electron");
const path = require("path");
const DEFAULT_FILE_PATH = path.join(__dirname, "../../index.html");

/**
 * Crea una ventana del navegador con las opciones especificadas.
 *
 * Si no se proporcionan opciones, se utilizarán valores predeterminados.
 * Por defecto, carga el archivo `index.html` desde el sistema de archivos.
 *
 * @param {string} [filePath=DEFAULT_FILE_PATH] - Nombre del archivo HTML a cargar.
 * @param {Object} [opts={}] - Opciones para configurar la ventana del navegador.
 */
function createWindow(filePath = DEFAULT_FILE_PATH, opts = {}) {
	// Crear la ventana del navegador
	const mainWindow = new BrowserWindow(opts);

	// Cargar el archivo de la app
	mainWindow.loadFile(filePath);

	// Cargar página web externa
	// mainWindow.loadURL("https://t19d.github.io/");

	// Abrir las DevTools
	mainWindow.webContents.openDevTools();
}

module.exports = { createWindow };
