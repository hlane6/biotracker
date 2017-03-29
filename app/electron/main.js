import {app} from 'app';
import {BrowerWindow} from 'browser-window';

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadUrl('file://' + __dirname + 'public/index.html');
    mainWindow.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
