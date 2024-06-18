const { app, BrowserWindow } = require("electron");
const { createWindow } = require("./scripts/electron/window");

// 🖐️ Manejar la creación/eliminación de accesos directos en Windows al instalar/desinstalar.
if (require("electron-squirrel-startup")) app.quit();

// ⚡ Arranque
app.whenReady().then(() => {
	createWindow();

	// 🍏 macOS
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// ❌ Cerrar - 🍏 macOS
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
