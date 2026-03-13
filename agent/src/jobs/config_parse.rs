// Executor
use super::structures::{Host, Web};
use reqwest::Client;
use tokio::net::TcpStream;
use tokio::time::{Duration, timeout};

pub async fn host_check(host: &Host) -> bool {
    timeout(Duration::from_secs(2), TcpStream::connect(host.addr()))
        .await
        .is_ok()
}

pub async fn web_check(web: &Web, client: &Client) -> (String, u16) {
    match client.head(web.get_url()).send().await {
        Ok(value) => ("Success".to_string(), value.status().as_u16()),
        Err(e) => (e.to_string(), 1),
    }
}
