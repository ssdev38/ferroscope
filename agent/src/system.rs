pub mod logic;
pub mod structures;
use crate::set_up;
use reqwest::Client;
use std::collections::HashMap;
use std::sync::Arc;

pub async fn send_cpu(conf: Arc<set_up::BaseConFig>, api_client: Arc<Client>) {
    let send_data = format!("{}/send_cpu", conf.get_server_url());
    let cpu_usage: HashMap<&str, f64> =
        HashMap::from([("cpu", (logic::total_cpu_usage().unwrap() * 100.0).round())]);
    let _ = api_client
        .post(send_data)
        .json(&cpu_usage)
        .send()
        .await
        .unwrap();
}

pub async fn send_uptime(conf: Arc<set_up::BaseConFig>, api_client: Arc<Client>) {
    let uptime: HashMap<&str, u64> = HashMap::from([("uptime_sec", logic::get_uptime().unwrap())]);
    let send_data = format!("{}/send_uptime", conf.get_server_url());
    api_client
        .post(send_data)
        .form(&uptime)
        .send()
        .await
        .unwrap();
}

pub async fn send_memory(conf: Arc<set_up::BaseConFig>, api_client: Arc<Client>) {
    let send_data = format!("{}/send_memory", conf.get_server_url());
    let memory = logic::memory_usage().unwrap();
    memory.get_total();
    let data: HashMap<&str, &str> =
        HashMap::from([("free", memory.get_free()), ("total", memory.get_total())]);
    let _ = api_client.post(send_data).json(&data).send().await.unwrap();
}
