use actix_web::{get, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct KillProcessRequest {
    pid: i32,
}

use sysinfo::System;

#[derive(Serialize)]
struct ProcessInfo {
    pid: String,
    name: String,
    disk_usage: DiskUsageData,
}

#[derive(Serialize)]
struct DiskUsageData {
    read_bytes: u64,
    written_bytes: u64,
}

#[derive(Serialize)]
pub struct SystemDetails {
    total_memory: u64,
    used_memory: u64,
    total_swap: u64,
    used_swap: u64,
    os_name: String,
    os_version: String,
    host_name: String,
    cpu_count: usize,
    processes: Vec<ProcessInfo>,
}

impl SystemDetails {
    pub fn new() -> SystemDetails {
        let mut system = System::new_all();
        system.refresh_all();

        let processes = system
            .processes()
            .iter()
            .map(|(&pid, process)| ProcessInfo {
                pid: pid.to_string(),
                name: process.name().to_string(),
                disk_usage: DiskUsageData {
                    read_bytes: process.disk_usage().total_read_bytes,
                    written_bytes: process.disk_usage().total_written_bytes,
                },
            })
            .collect();

        SystemDetails {
            total_memory: system.total_memory(),
            used_memory: system.used_memory(),
            total_swap: system.total_swap(),
            used_swap: system.used_swap(),
            os_name: System::name().unwrap_or_else(|| "Unknown".to_string()),
            os_version: System::os_version().unwrap_or_else(|| "Unknown".to_string()),
            host_name: System::host_name().unwrap_or_else(|| "Unknown".to_string()),
            cpu_count: system.cpus().len(),
            processes,
        }
    }
}

#[get("/system")]
pub async fn get_system_info() -> impl Responder {
    let system_info = SystemDetails::new();
    HttpResponse::Ok().json(system_info)
}

#[post("/kill_process")]
pub async fn kill_process(req: web::Json<KillProcessRequest>) -> impl Responder {
    let mut system = System::new_all();
    system.refresh_all();

    match system.process(sysinfo::Pid::from(req.pid as usize)) {
        Some(process) => {
            if process.kill() {
                HttpResponse::Ok().json("Process killed successfully")
            } else {
                HttpResponse::InternalServerError().json("Failed to kill process")
            }
        }
        None => HttpResponse::InternalServerError().json("Failed to kill process"),
    }
}
