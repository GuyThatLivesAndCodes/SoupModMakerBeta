use tauri::AppHandle;
use std::fs;
use serde_json::Value;

// State management
pub struct AppState {
    pub current_project: std::sync::Mutex<Option<Value>>,
    pub settings: std::sync::Mutex<Value>,
    pub plugins: std::sync::Mutex<Vec<Value>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            current_project: std::sync::Mutex::new(None),
            settings: std::sync::Mutex::new(serde_json::json!({
                "theme": "dark",
                "autoSave": true
            })),
            plugins: std::sync::Mutex::new(Vec::new()),
        }
    }
}

// App commands
#[tauri::command]
fn app_get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn app_get_platform() -> String {
    std::env::consts::OS.to_string()
}

// Mob commands
#[tauri::command]
async fn mob_save(mob_data: Value, app: AppHandle) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Save Mob")
        .set_file_name(&format!("{}.json", mob_data["id"].as_str().unwrap_or("mob")))
        .add_filter("JSON Files", &["json"])
        .blocking_save_file()
        .ok_or("User cancelled")?;

    fs::write(&file_path, serde_json::to_string_pretty(&mob_data).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": file_path.to_str()
    }))
}

#[tauri::command]
async fn mob_export(mob_data: Value, mod_id: String, app: AppHandle) -> Result<serde_json::Value, String> {
    let dir_path = app.dialog()
        .file()
        .set_title("Select Export Directory")
        .set_directory(true)
        .blocking_pick_folder()
        .ok_or("User cancelled")?;

    let mob_id = mob_data["id"].as_str().unwrap_or("mob");
    let class_name = format!("{}Entity", mob_id.split('_').map(|s| {
        let mut c = s.chars();
        match c.next() {
            None => String::new(),
            Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
        }
    }).collect::<Vec<_>>().join(""));

    let java_code = format!(
        "package com.{}.entity;\n\nimport net.minecraft.world.entity.EntityType;\nimport net.minecraft.world.entity.Mob;\n\npublic class {} extends Mob {{\n    // Entity implementation\n}}\n",
        mod_id, class_name
    );

    let export_dir = dir_path.join("src/main/java/com").join(&mod_id).join("entity");
    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    fs::write(export_dir.join(format!("{}.java", class_name)), java_code)
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": export_dir.to_str()
    }))
}

// Event commands
#[tauri::command]
async fn event_save(event_data: Value, app: AppHandle) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Save Event")
        .set_file_name(&format!("{}.json", event_data["id"].as_str().unwrap_or("event")))
        .add_filter("JSON Files", &["json"])
        .blocking_save_file()
        .ok_or("User cancelled")?;

    fs::write(&file_path, serde_json::to_string_pretty(&event_data).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": file_path.to_str()
    }))
}

#[tauri::command]
async fn event_export(event_data: Value, mod_id: String, app: AppHandle) -> Result<serde_json::Value, String> {
    let dir_path = app.dialog()
        .file()
        .set_title("Select Export Directory")
        .set_directory(true)
        .blocking_pick_folder()
        .ok_or("User cancelled")?;

    let event_id = event_data["id"].as_str().unwrap_or("event");
    let class_name = format!("{}EventHandler", event_id.split('_').map(|s| {
        let mut c = s.chars();
        match c.next() {
            None => String::new(),
            Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
        }
    }).collect::<Vec<_>>().join(""));

    let java_code = format!(
        "package com.{}.event;\n\nimport net.minecraftforge.eventbus.api.SubscribeEvent;\nimport net.minecraftforge.fml.common.Mod;\n\n@Mod.EventBusSubscriber(modid = \"{}\")\npublic class {} {{\n    // Event handler implementation\n}}\n",
        mod_id, mod_id, class_name
    );

    let export_dir = dir_path.join("src/main/java/com").join(&mod_id).join("event");
    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    fs::write(export_dir.join(format!("{}.java", class_name)), java_code)
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": export_dir.to_str()
    }))
}

// Item commands
#[tauri::command]
async fn item_save(item_data: Value, app: AppHandle) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Save Item")
        .set_file_name(&format!("{}.json", item_data["id"].as_str().unwrap_or("item")))
        .add_filter("JSON Files", &["json"])
        .blocking_save_file()
        .ok_or("User cancelled")?;

    fs::write(&file_path, serde_json::to_string_pretty(&item_data).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": file_path.to_str()
    }))
}

#[tauri::command]
async fn item_export(item_data: Value, mod_id: String, app: AppHandle) -> Result<serde_json::Value, String> {
    let dir_path = app.dialog()
        .file()
        .set_title("Select Export Directory")
        .set_directory(true)
        .blocking_pick_folder()
        .ok_or("User cancelled")?;

    let item_id = item_data["id"].as_str().unwrap_or("item");
    let class_name = format!("{}Item", item_id.split('_').map(|s| {
        let mut c = s.chars();
        match c.next() {
            None => String::new(),
            Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
        }
    }).collect::<Vec<_>>().join(""));

    let java_code = format!(
        "package com.{}.item;\n\nimport net.minecraft.world.item.Item;\nimport net.minecraft.world.item.Rarity;\n\npublic class {} extends Item {{\n    public {}() {{\n        super(new Item.Properties()\n            .stacksTo(64)\n            .rarity(Rarity.COMMON)\n        );\n    }}\n}}\n",
        mod_id, class_name, class_name
    );

    let export_dir = dir_path.join("src/main/java/com").join(&mod_id).join("item");
    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    fs::write(export_dir.join(format!("{}.java", class_name)), java_code)
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": export_dir.to_str()
    }))
}

// Recipe commands
#[tauri::command]
async fn recipe_save(recipe_data: Value, app: AppHandle) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Save Recipe")
        .set_file_name(&format!("{}.json", recipe_data["id"].as_str().unwrap_or("recipe")))
        .add_filter("JSON Files", &["json"])
        .blocking_save_file()
        .ok_or("User cancelled")?;

    fs::write(&file_path, serde_json::to_string_pretty(&recipe_data).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": file_path.to_str()
    }))
}

#[tauri::command]
async fn recipe_export(recipe_data: Value, mod_id: String, app: AppHandle) -> Result<serde_json::Value, String> {
    let dir_path = app.dialog()
        .file()
        .set_title("Select Export Directory")
        .set_directory(true)
        .blocking_pick_folder()
        .ok_or("User cancelled")?;

    let recipe_id = recipe_data["id"].as_str().unwrap_or("recipe");
    let recipe_json = serde_json::to_string_pretty(&recipe_data).unwrap();

    let export_dir = dir_path.join("src/main/resources/data").join(&mod_id).join("recipes");
    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    fs::write(export_dir.join(format!("{}.json", recipe_id)), recipe_json)
        .map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "success": true,
        "path": export_dir.to_str()
    }))
}

// Project commands
#[tauri::command]
async fn project_new(project_name: String, state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let project_data = serde_json::json!({
        "name": project_name,
        "version": "1.0.0",
        "minecraftVersion": "1.20.1",
        "mods": [],
        "createdAt": chrono::Utc::now().to_rfc3339()
    });

    *state.current_project.lock().unwrap() = Some(project_data.clone());

    Ok(project_data)
}

#[tauri::command]
async fn project_open(app: AppHandle, state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Open Project")
        .add_filter("SoupModMaker Project", &["soup", "json"])
        .blocking_pick_file()
        .ok_or("User cancelled")?;

    let content = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    let project_data: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    *state.current_project.lock().unwrap() = Some(project_data.clone());

    Ok(project_data)
}

#[tauri::command]
async fn project_save(project_data: Value, app: AppHandle, state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Save Project")
        .set_file_name(&format!("{}.soup", project_data["name"].as_str().unwrap_or("project")))
        .add_filter("SoupModMaker Project", &["soup"])
        .blocking_save_file()
        .ok_or("User cancelled")?;

    fs::write(&file_path, serde_json::to_string_pretty(&project_data).unwrap())
        .map_err(|e| e.to_string())?;

    *state.current_project.lock().unwrap() = Some(project_data.clone());

    Ok(serde_json::json!({
        "success": true,
        "path": file_path.to_str()
    }))
}

#[tauri::command]
fn project_get_current(state: tauri::State<'_, AppState>) -> Result<Option<serde_json::Value>, String> {
    Ok(state.current_project.lock().unwrap().clone())
}

#[tauri::command]
fn project_get_recent() -> Result<Vec<serde_json::Value>, String> {
    // Return empty for now - would need to implement storage
    Ok(Vec::new())
}

// Settings commands
#[tauri::command]
fn settings_get(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    Ok(state.settings.lock().unwrap().clone())
}

#[tauri::command]
fn settings_update(settings: Value, state: tauri::State<'_, AppState>) -> Result<(), String> {
    *state.settings.lock().unwrap() = settings;
    Ok(())
}

// Plugin commands
#[tauri::command]
async fn plugin_import(app: AppHandle, state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let file_path = app.dialog()
        .file()
        .set_title("Import Plugin")
        .add_filter("Plugin Files", &["zip", "jar"])
        .blocking_pick_file()
        .ok_or("User cancelled")?;

    let plugin_data = serde_json::json!({
        "id": file_path.file_name().unwrap().to_str(),
        "name": file_path.file_stem().unwrap().to_str(),
        "enabled": true,
        "path": file_path.to_str()
    });

    state.plugins.lock().unwrap().push(plugin_data.clone());

    Ok(plugin_data)
}

#[tauri::command]
fn plugin_toggle(plugin_id: String, enabled: bool, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut plugins = state.plugins.lock().unwrap();
    for plugin in plugins.iter_mut() {
        if plugin["id"].as_str() == Some(&plugin_id) {
            plugin["enabled"] = serde_json::json!(enabled);
            break;
        }
    }
    Ok(())
}

#[tauri::command]
fn plugin_remove(plugin_id: String, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut plugins = state.plugins.lock().unwrap();
    plugins.retain(|p| p["id"].as_str() != Some(&plugin_id));
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            app_get_version,
            app_get_platform,
            mob_save,
            mob_export,
            event_save,
            event_export,
            item_save,
            item_export,
            recipe_save,
            recipe_export,
            project_new,
            project_open,
            project_save,
            project_get_current,
            project_get_recent,
            settings_get,
            settings_update,
            plugin_import,
            plugin_toggle,
            plugin_remove,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
