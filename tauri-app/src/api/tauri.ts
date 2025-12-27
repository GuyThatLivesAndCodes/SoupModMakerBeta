import { invoke } from '@tauri-apps/api/core';

// Mock window.electron for compatibility with existing code
export const tauriAPI = {
  app: {
    getVersion: () => invoke('app_get_version'),
    getPlatform: () => invoke('app_get_platform'),
  },
  mob: {
    save: (mobData: any) => invoke('mob_save', { mobData }),
    export: (mobData: any, modId: string) => invoke('mob_export', { mobData, modId }),
  },
  event: {
    save: (eventData: any) => invoke('event_save', { eventData }),
    export: (eventData: any, modId: string) => invoke('event_export', { eventData, modId }),
  },
  item: {
    save: (itemData: any) => invoke('item_save', { itemData }),
    export: (itemData: any, modId: string) => invoke('item_export', { itemData, modId }),
  },
  recipe: {
    save: (recipeData: any) => invoke('recipe_save', { recipeData }),
    export: (recipeData: any, modId: string) => invoke('recipe_export', { recipeData, modId }),
  },
  project: {
    new: (projectName: string) => invoke('project_new', { projectName }),
    open: () => invoke('project_open'),
    save: (projectData: any) => invoke('project_save', { projectData }),
    getCurrent: () => invoke('project_get_current'),
    getRecent: () => invoke('project_get_recent'),
  },
  settings: {
    get: () => invoke('settings_get'),
    update: (settings: any) => invoke('settings_update', { settings }),
  },
  plugin: {
    import: () => invoke('plugin_import'),
    toggle: (pluginId: string, enabled: boolean) => invoke('plugin_toggle', { pluginId, enabled }),
    remove: (pluginId: string) => invoke('plugin_remove', { pluginId }),
  },
};

// Export as window.electron for compatibility
if (typeof window !== 'undefined') {
  (window as any).electron = tauriAPI;
}

export default tauriAPI;
