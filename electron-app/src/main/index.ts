/**
 * Electron Main Process
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs/promises';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#1e1e1e',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    frame: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getPlatform', () => {
  return process.platform;
});

// Save Mob Data
ipcMain.handle('mob:save', async (_, mobData) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Mob',
      defaultPath: `${mobData.id}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (filePath) {
      await fs.writeFile(filePath, JSON.stringify(mobData, null, 2), 'utf-8');
      return { success: true, path: filePath };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Generate and Export Mob Code
ipcMain.handle('mob:export', async (_, mobData, modId) => {
  try {
    const { filePath } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePath && filePath[0]) {
      const exportDir = filePath[0];
      const mobName = mobData.id;

      // Import and use the generator (we'll need to make this available)
      // For now, create the structure
      const mobDir = path.join(exportDir, 'mob', mobName);
      await fs.mkdir(mobDir, { recursive: true });

      // Save the mob data
      await fs.writeFile(
        path.join(mobDir, `${mobName}.json`),
        JSON.stringify(mobData, null, 2),
        'utf-8'
      );

      // Create placeholder for generated files
      const readmePath = path.join(mobDir, 'README.md');
      await fs.writeFile(
        readmePath,
        `# ${mobData.name}\n\nGenerated mob files will be created here.\n\nTo generate the code:\n1. Use the code generator\n2. Files will include:\n   - Entity class\n   - Renderer\n   - Model\n   - Registration code\n   - Loot table`,
        'utf-8'
      );

      return { success: true, path: mobDir };
    }
    return { success: false, error: 'No directory selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Save Event Data
ipcMain.handle('event:save', async (_, eventData) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Event',
      defaultPath: `${eventData.id}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (filePath) {
      await fs.writeFile(filePath, JSON.stringify(eventData, null, 2), 'utf-8');
      return { success: true, path: filePath };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Generate and Export Event Code
ipcMain.handle('event:export', async (_, eventData, modId) => {
  try {
    const { filePath } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePath && filePath[0]) {
      const exportDir = filePath[0];
      const eventName = eventData.id;

      // Create event directory
      const eventDir = path.join(exportDir, 'events', eventName);
      await fs.mkdir(eventDir, { recursive: true });

      // Save the event data
      await fs.writeFile(
        path.join(eventDir, `${eventName}.json`),
        JSON.stringify(eventData, null, 2),
        'utf-8'
      );

      // Create placeholder for generated files
      const readmePath = path.join(eventDir, 'README.md');
      await fs.writeFile(
        readmePath,
        `# ${eventData.name}\n\nEvent Type: ${eventData.eventType}\n\nGenerated event handler files will be created here.\n\nConditions: ${eventData.conditions.length}\nActions: ${eventData.actions.length}`,
        'utf-8'
      );

      return { success: true, path: eventDir };
    }
    return { success: false, error: 'No directory selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});
