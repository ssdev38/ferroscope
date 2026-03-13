use super::objects as payload;
use crate::objects::AppState;
use crate::user_views::{LatestCpu, LatestRam};
use axum::http::{ StatusCode};
use axum::{Json, Extension,extract::State};
use chrono::Utc;
use tokio::sync::watch;

pub async fn __system_info(
    State(db_state): State<AppState>,
    Extension(nodes_id):Extension<i64>,
    data: Json<payload::SysInfo>,
) -> StatusCode {

    sqlx::query(
        "INSERT INTO sysinfo (node_id,
                system_name,
                kernel_version,
                os_version,
                uptime,
                cpu_threads,
                cpu_vendor)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (node_id)
                DO UPDATE SET
                system_name   = EXCLUDED.system_name,
                kernel_version = EXCLUDED.kernel_version,
                os_version     = EXCLUDED.os_version,
                uptime         = EXCLUDED.uptime,
                cpu_threads    = EXCLUDED.cpu_threads,
                cpu_vendor     = EXCLUDED.cpu_vendor;
                 ",
    )
    .bind(nodes_id)
    .bind(&data.system_name)
    .bind(&data.kernel_version)
    .bind(&data.os_version)
    .bind(data.uptime)
    .bind(data.cpu_threads)
    .bind(&data.cpu_vendor)
    .execute(&db_state.db)
    .await
    .expect("failed to insert user");
    println!("{:?}", data);
    StatusCode::OK
}

pub async fn __cpu_metrix(
    Extension(nodes_id):Extension<i64>,
    State(db_state): State<AppState>,
    data: Json<payload::CpuStats>,
) -> StatusCode {
    //TODO: change cpu from f64
    sqlx::query("INSERT INTO cpu_stats (value,node_id) VALUES ($1,$2)")
        .bind(data.cpu)
        .bind(nodes_id)
        .execute(&db_state.db)
        .await
        .expect("failed to insert user");
    // putting in the stream
    let node_key = format!("node_cpu_strem_{nodes_id}");
    if db_state.cpu_strem.contains_key(&node_key) {
        let tx = db_state.cpu_strem.get(&node_key).unwrap();
        let _ = tx.send(LatestCpu {
            value: data.cpu,
            date_time: Utc::now(),
        });
    } else {
        let (tx, _) = watch::channel(LatestCpu {
            value: data.cpu,
            date_time: Utc::now(),
        });
        db_state.cpu_strem.insert(node_key, tx);
    };

    StatusCode::OK
}

pub async fn __memory_metrix(
   Extension(nodes_id):Extension<i64>,
    State(db_state): State<AppState>,
    data: Json<payload::MemoryStats>,
) -> StatusCode {
    println!("Memory metrix");
    sqlx::query("INSERT INTO memory_metrics (free,total,node_id) VALUES ($1,$2,$3)")
        .bind(&data.free)
        .bind(&data.total)
        .bind(nodes_id)
        .execute(&db_state.db)
        .await
        .expect("failed to insert user");

    let node_key = format!("node_ram_strem_{nodes_id}");
    if db_state.ram_strem.contains_key(&node_key) {
        let tx = db_state.ram_strem.get(&node_key).unwrap();
        let _ = tx.send(LatestRam {
            timestamp: Utc::now(),
            free: data.free.clone(),
            total: data.total.clone(),
        });
    } else {
        let (tx, _) = watch::channel(LatestRam {
            timestamp: Utc::now(),
            free: data.free.clone(),
            total: data.total.clone(),
        });
        db_state.ram_strem.insert(node_key, tx);
    };

    StatusCode::OK
}

pub async fn __service_monitor(
    Extension(nodes_id):Extension<i64>,
    State(db_state): State<AppState>,
    data: Json<payload::ServiceMonitor>,
) -> StatusCode {
    println!("Service Monitor");
    sqlx::query(
        "INSERT INTO service_monitor (service_name,status,error_msg,node_id) VALUES ($1,$2,$3,$4)
        ON CONFLICT (node_id,service_name)
        DO UPDATE SET   
            status = EXCLUDED.status,
            error_msg = EXCLUDED.error_msg,
            updated_at = NOW();
        ",
    )
    .bind(&data.service_name)
    .bind(&data.status)
    .bind(&data.error_msg)
    .bind(nodes_id)
    .execute(&db_state.db)
    .await
    .expect("failed to insert user");
    StatusCode::OK
}

pub async fn __update_uptime(
    Extension(nodes_id):Extension<i64>,
    State(db_state): State<AppState>,
    data: Json<payload::UpdateUptime>,
) -> StatusCode {
    sqlx::query("UPDATE sysinfo SET uptime=$1 WHERE node_id=$2")
        .bind(data.uptime_sec)
        .bind(nodes_id)
        .execute(&db_state.db)
        .await
        .expect("Unable to update Uptime");
    StatusCode::OK
}
