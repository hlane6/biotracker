import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import MenuBuilder from './menu';

let mainWindow = null;
let correctionsWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    // TODO: Use async interation statement.
    //       Waiting on https://github.com/tc39/proposal-async-iteration
    //       Promises will fail silently, which isn't what we want in development
    return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .catch(console.log);
  }
};

app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 750,
    height: 740,
    x: 100,
    y: 50
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  correctionsWindow = new BrowserWindow({
    show: false,
    width: 250,
    height: 325,
    resizeable: false,
    parent: mainWindow,
    title: 'Corrections',
    closable: false,
    x: 850,
    y: 50
  });

  correctionsWindow.loadURL(`file://${__dirname}/corrections.html`);

  correctionsWindow.webContents.on('did-finish-load', () => {
    if (!correctionsWindow) {
      throw new Error('"correctionsWindow" is not defined');
    }
    correctionsWindow.show();
  });

  correctionsWindow.on('closed', () => {
    correctionsWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const correctionsMenuBuilder = new MenuBuilder(correctionsWindow);
  correctionsMenuBuilder.buildMenu();
});

ipcMain.on('open-video-file', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Videos', extensions: ['mp4']}
    ]
  }, (files) => {
    if (files) mainWindow.webContents.send('selected-video-file', files[0]);
  })
});

ipcMain.on('open-csv-file', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Data', extensions: ['csv']}
    ]
  }, (files) => {
    if (files) mainWindow.webContents.send('selected-csv-file', files[0]);
  })
});

ipcMain.on('add-correction', (event, correction) => {
    mainWindow.webContents.send('add-correction', correction);
});

ipcMain.on('update-selection', (event, selection) => {
    correctionsWindow.webContents.send('update-selection', selection);
});
