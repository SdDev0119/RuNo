use crate::sql::{execute_query, SqlResult};
use crate::database::ConnectionConfig;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct TableUpdate {
    pub table_id: String,
    pub sql_formula: String,
    pub connection_name: String,
}

#[tauri::command]
pub async fn update_table(
    table_update: TableUpdate,
    connections: State<'_, HashMap<String, ConnectionConfig>>,
) -> Result<SqlResult, String> {
    // Extract connection name and query from SQL formula
    let sql_regex = Regex::new(r#"SQL\("([^"]+)",\s*"([^"]+)"\)"#).unwrap();
    let captures = sql_regex
        .captures(&table_update.sql_formula)
        .ok_or("Invalid SQL formula format")?;

    let connection_name = captures.get(1).unwrap().as_str();
    let query = captures.get(2).unwrap().as_str();

    // Get connection config
    let config = connections
        .get(connection_name)
        .ok_or("Connection not found")?;

    // Execute query
    execute_query(config, query).await
}