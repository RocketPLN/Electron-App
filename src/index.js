const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const exec = require("child_process").exec;
const path = require("path");
require("electron");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  // disable resizing windows
  mainWindow.setResizable(false);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("menu", (event, args) => {
    if (args === "close") {
      app.quit();
    } else {
      mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

ipcMain.on("command", (event, command, location) => {
  if (location !== undefined && location !== "null") {
    const pathArg = `--location "${location}"`;
    execute(`${command} ${pathArg}`, (output) => {
      console.log(output);
      console.log("dziala", pathArg);
    });
  } else {
    execute(command, (output) => {
      console.log(output);
      console.log("nie posiada");
    });
  }
});

ipcMain.on("dir", (event) => {
  var dirs = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });

  event.sender.send(
    "selectedDirectory",
    dirs && dirs.length > 0 ? dirs[0] : null
  );
});
