// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod command;
mod database;
mod error;
mod license;
mod models;
mod sql;

use command::{update_table, TableUpdate};
use database::test_connection;
use license::{write_license_file, is_trial_valid, initialize_trial_file};
use std::collections::HashMap;
use database::ConnectionConfig;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .manage(HashMap::<String, ConnectionConfig>::new())
        .invoke_handler(tauri::generate_handler![
            update_table,
            test_connection,
            is_trial_valid,
            write_license_file,
            initialize_trial_file
        ])
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}