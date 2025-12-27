/**
 * Electron Main Process
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs/promises';
import Store from 'electron-store';

let mainWindow: BrowserWindow | null = null;

// Initialize electron-store for persistent settings
const store = new Store({
  defaults: {
    settings: {
      theme: 'system',
      recentProjects: [],
      installedPlugins: [],
      pluginDirectory: path.join(app.getPath('userData'), 'plugins'),
      autoSave: true,
      autoSaveInterval: 300,
      defaultPlatform: 'forge',
      defaultMinecraftVersion: '1.20.4',
      javaPackagePrefix: 'com.example',
    },
    currentProject: null,
  },
});

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
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePaths && filePaths[0]) {
      const exportDir = filePaths[0];
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
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePaths && filePaths[0]) {
      const exportDir = filePaths[0];
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

// ============ ITEM MANAGEMENT ============

// Save Item
ipcMain.handle('item:save', async (_, itemData) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Item',
      defaultPath: `${itemData.id}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (filePath) {
      await fs.writeFile(filePath, JSON.stringify(itemData, null, 2), 'utf-8');
      return { success: true, path: filePath };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Generate and Export Item Code
ipcMain.handle('item:export', async (_, itemData, modId) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePaths && filePaths[0]) {
      const exportDir = filePaths[0];
      const itemName = itemData.id;

      // Create item directory
      const itemDir = path.join(exportDir, 'items', itemName);
      await fs.mkdir(itemDir, { recursive: true });

      // Save the item data
      await fs.writeFile(
        path.join(itemDir, `${itemName}.json`),
        JSON.stringify(itemData, null, 2),
        'utf-8'
      );

      // Create placeholder for generated files
      const readmePath = path.join(itemDir, 'README.md');
      await fs.writeFile(
        readmePath,
        `# ${itemData.name}\n\nItem Type: ${itemData.type}\n\nGenerated item class files will be created here.\n\nProperties:\n- Max Stack Size: ${itemData.maxStackSize}\n- Rarity: ${itemData.rarity}\n- Fireproof: ${itemData.fireproof}`,
        'utf-8'
      );

      return { success: true, path: itemDir };
    }
    return { success: false, error: 'No directory selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// ============ RECIPE MANAGEMENT ============

// Save Recipe
ipcMain.handle('recipe:save', async (_, recipeData) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Recipe',
      defaultPath: `${recipeData.id}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (filePath) {
      await fs.writeFile(filePath, JSON.stringify(recipeData, null, 2), 'utf-8');
      return { success: true, path: filePath };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Generate and Export Recipe Code
ipcMain.handle('recipe:export', async (_, recipeData, modId) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Select Export Directory',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (filePaths && filePaths[0]) {
      const exportDir = filePaths[0];
      const recipeName = recipeData.id;

      // Create recipe directory
      const recipeDir = path.join(exportDir, 'recipes', recipeName);
      await fs.mkdir(recipeDir, { recursive: true });

      // Save the recipe data
      await fs.writeFile(
        path.join(recipeDir, `${recipeName}.json`),
        JSON.stringify(recipeData, null, 2),
        'utf-8'
      );

      // Create placeholder for generated files
      const readmePath = path.join(recipeDir, 'README.md');
      await fs.writeFile(
        readmePath,
        `# ${recipeData.name}\n\nRecipe Type: ${recipeData.type}\n\nGenerated recipe JSON files will be created here.\n\nResult: ${recipeData.result.item} x${recipeData.result.count}`,
        'utf-8'
      );

      return { success: true, path: recipeDir };
    }
    return { success: false, error: 'No directory selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// ============ PROJECT MANAGEMENT ============

// Create New Project
ipcMain.handle('project:new', async (_, projectName) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Create New Project',
      defaultPath: `${projectName}.soupmod`,
      filters: [
        { name: 'SoupModMaker Project', extensions: ['soupmod'] },
      ],
    });

    if (filePath) {
      const newProject = {
        id: Date.now().toString(),
        metadata: {
          name: projectName,
          modId: projectName.toLowerCase().replace(/\s+/g, '_'),
          namespace: projectName.toLowerCase().replace(/\s+/g, '_'),
          version: '1.0.0',
          authors: [],
        },
        targets: [{
          platform: 'forge',
          minecraftVersion: '1.20.4',
          primary: true,
        }],
        features: [],
        settings: {
          javaVersion: 17,
          build: {
            outputDir: 'build',
            includeSources: false,
            obfuscate: false,
          },
          development: {
            hotReload: false,
            debug: true,
          },
          export: {
            autoIncrementVersion: false,
            includeJavadocs: false,
          },
        },
        assets: [],
        timestamps: {
          created: Date.now(),
          modified: Date.now(),
        },
        content: {
          mobs: [],
          events: [],
          blocks: [],
          items: [],
          biomes: [],
          dimensions: [],
        },
        plugins: {
          enabled: [],
          settings: {},
        },
      };

      const projectFile = {
        version: '1.0.0',
        project: newProject,
      };

      await fs.writeFile(filePath, JSON.stringify(projectFile, null, 2), 'utf-8');

      // Update recent projects
      const settings = store.get('settings') as any;
      const recentProjects = settings.recentProjects || [];
      recentProjects.unshift({
        name: projectName,
        path: filePath,
        lastOpened: new Date().toISOString(),
        minecraftVersion: '1.20.4',
        platform: 'forge',
      });
      store.set('settings.recentProjects', recentProjects.slice(0, 10));
      store.set('settings.lastOpenedProject', filePath);
      store.set('currentProject', projectFile);

      return { success: true, path: filePath, project: projectFile };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Open Project
ipcMain.handle('project:open', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Open Project',
      filters: [
        { name: 'SoupModMaker Project', extensions: ['soupmod'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile'],
    });

    if (filePaths && filePaths[0]) {
      const filePath = filePaths[0];
      const content = await fs.readFile(filePath, 'utf-8');
      const projectFile = JSON.parse(content);

      // Update recent projects
      const settings = store.get('settings') as any;
      const recentProjects = settings.recentProjects || [];
      const existingIndex = recentProjects.findIndex((p: any) => p.path === filePath);

      const projectEntry = {
        name: projectFile.project.metadata.name,
        path: filePath,
        lastOpened: new Date().toISOString(),
        minecraftVersion: projectFile.project.targets[0]?.minecraftVersion || '1.20.4',
        platform: projectFile.project.targets[0]?.platform || 'forge',
      };

      if (existingIndex >= 0) {
        recentProjects.splice(existingIndex, 1);
      }
      recentProjects.unshift(projectEntry);
      store.set('settings.recentProjects', recentProjects.slice(0, 10));
      store.set('settings.lastOpenedProject', filePath);
      store.set('currentProject', projectFile);

      return { success: true, path: filePath, project: projectFile };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Save Project
ipcMain.handle('project:save', async (_, projectData) => {
  try {
    const currentPath = store.get('settings.lastOpenedProject') as string;

    if (currentPath) {
      // Save to existing path
      projectData.project.timestamps.modified = Date.now();
      await fs.writeFile(currentPath, JSON.stringify(projectData, null, 2), 'utf-8');
      store.set('currentProject', projectData);
      return { success: true, path: currentPath };
    } else {
      // Save as
      const { filePath } = await dialog.showSaveDialog({
        title: 'Save Project',
        defaultPath: `${projectData.project.metadata.name}.soupmod`,
        filters: [
          { name: 'SoupModMaker Project', extensions: ['soupmod'] },
        ],
      });

      if (filePath) {
        projectData.project.timestamps.modified = Date.now();
        await fs.writeFile(filePath, JSON.stringify(projectData, null, 2), 'utf-8');
        store.set('settings.lastOpenedProject', filePath);
        store.set('currentProject', projectData);
        return { success: true, path: filePath };
      }
      return { success: false, error: 'No file selected' };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Get Current Project
ipcMain.handle('project:getCurrent', () => {
  return store.get('currentProject');
});

// ============ PLUGIN MANAGEMENT ============

// Get Settings
ipcMain.handle('settings:get', () => {
  return store.get('settings');
});

// Update Settings
ipcMain.handle('settings:update', (_, settings) => {
  store.set('settings', settings);
  return { success: true };
});

// Import Plugin
ipcMain.handle('plugin:import', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Import Plugin',
      filters: [
        { name: 'Plugin Files', extensions: ['zip', 'jar', 'js'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile'],
    });

    if (filePaths && filePaths[0]) {
      const pluginPath = filePaths[0];
      const pluginDir = store.get('settings.pluginDirectory') as string;

      // Create plugin directory if it doesn't exist
      await fs.mkdir(pluginDir, { recursive: true });

      // Copy plugin file
      const fileName = path.basename(pluginPath);
      const destPath = path.join(pluginDir, fileName);
      await fs.copyFile(pluginPath, destPath);

      // Create plugin metadata (simplified - in real app, parse from plugin manifest)
      const pluginMeta = {
        id: fileName.replace(/\.(zip|jar|js)$/, ''),
        name: fileName.replace(/\.(zip|jar|js)$/, ''),
        version: '1.0.0',
        description: 'Imported plugin',
        author: 'Unknown',
        enabled: false,
        installed: true,
        filePath: destPath,
        category: 'tools' as const,
      };

      // Add to installed plugins
      const settings = store.get('settings') as any;
      const installedPlugins = settings.installedPlugins || [];
      installedPlugins.push(pluginMeta);
      store.set('settings.installedPlugins', installedPlugins);

      return { success: true, plugin: pluginMeta };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Toggle Plugin
ipcMain.handle('plugin:toggle', (_, pluginId, enabled) => {
  try {
    const settings = store.get('settings') as any;
    const installedPlugins = settings.installedPlugins || [];

    const pluginIndex = installedPlugins.findIndex((p: any) => p.id === pluginId);
    if (pluginIndex >= 0) {
      installedPlugins[pluginIndex].enabled = enabled;
      store.set('settings.installedPlugins', installedPlugins);
      return { success: true, message: 'Plugin will be ' + (enabled ? 'enabled' : 'disabled') + ' on next restart' };
    }
    return { success: false, error: 'Plugin not found' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Remove Plugin
ipcMain.handle('plugin:remove', async (_, pluginId) => {
  try {
    const settings = store.get('settings') as any;
    const installedPlugins = settings.installedPlugins || [];

    const pluginIndex = installedPlugins.findIndex((p: any) => p.id === pluginId);
    if (pluginIndex >= 0) {
      const plugin = installedPlugins[pluginIndex];

      // Delete plugin file
      if (plugin.filePath) {
        try {
          await fs.unlink(plugin.filePath);
        } catch (err) {
          // File might not exist, ignore
        }
      }

      // Remove from list
      installedPlugins.splice(pluginIndex, 1);
      store.set('settings.installedPlugins', installedPlugins);

      return { success: true };
    }
    return { success: false, error: 'Plugin not found' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Get Recent Projects
ipcMain.handle('project:getRecent', () => {
  const settings = store.get('settings') as any;
  return settings.recentProjects || [];
});
