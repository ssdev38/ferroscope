// execute the logics
use super::config_parse::{host_check, web_check};
use super::config_reader::{file_name_list, load_config};
use super::structures::{BaseFormat, Host, Web};
use crate::set_up::BaseConFig;
use reqwest::Client;
use std::sync::Arc;
use tokio::time::{Duration, interval};
use std::sync::LazyLock;
use std::env;

static CONFDIR:LazyLock<String>=LazyLock::new(||
    env::var("CONF_DIR").unwrap_or("/etc/ferroscope_agent".to_string())
);



pub async fn run(api_client: Arc<Client>, config: Arc<BaseConFig>) {
    let web_client = Arc::clone(&api_client);
    let web_config = Arc::clone(&config);
    tokio::spawn(async move {
        let mut ticker = interval(Duration::from_secs(web_config.get_web_interval()));
        loop {
            web_runner(Arc::clone(&web_client), Arc::clone(&web_config)).await;
            ticker.tick().await;
            // TODO: handel error and if get error then exit the loop
        }
    });
    let mut ticker = interval(Duration::from_secs(config.get_host_interval()));
    loop {
        host_runner(Arc::clone(&api_client), Arc::clone(&config)).await;
        ticker.tick().await;
    }
}

async fn host_runner(api_client: Arc<Client>, config: Arc<BaseConFig>) {
    let all_files = match file_name_list(&format!("{}/Host",*CONFDIR)).await {
        Ok(value) => value,
        Err(e) => {
            println!("no config founnd err: {}", e);
            Vec::new()
        }
    };
    let baseapi = config.get_service_url();
    for file in all_files {
        let a: config::Config = match load_config(file).await {
            Ok(value) => value,
            Err(e) => {
                println!("error is {}", e);
                continue;
            }
        };

        let value: Host = match a.try_deserialize() {
            Ok(value) => value,
            Err(e) => {
                println!("error is {}", e);
                continue;
            }
        };
        let host_status = host_check(&value).await;
        let res = api_client
            .post(&baseapi)
            .json(&BaseFormat {
                service_name: value.name,
                status: if host_status {
                    "up".to_string()
                } else {
                    "down".to_string()
                },
                error_msg: "".to_string(),
            })
            .send()
            .await
            .unwrap();
        println!("the res is {:?}", res);
    } //endfor
}

async fn web_runner(api_client: Arc<Client>, config: Arc<BaseConFig>) {
    let all_files = match file_name_list(&format!("{}/Web",*CONFDIR)).await {
        Ok(value) => value,
        Err(e) => {
            println!("no config founnd err: {}", e);
            Vec::new()
        }
    };
    let baseapi = config.get_service_url();

    let _client = Client::builder()
        .timeout(Duration::from_secs(5)) //get this value from config
        .build()
        .unwrap();
    for file in all_files {
        let a: config::Config = match load_config(file).await {
            Ok(value) => value,
            Err(e) => {
                println!("error is {}", e);
                continue;
            }
        };

        let value: Web = match a.try_deserialize() {
            Ok(value) => value,
            Err(e) => {
                println!("error is {}", e);
                continue;
            }
        };
        let (status, code) = web_check(&value, &_client).await;
        if status == "Success".to_string() && value.match_status(code) {
            let res = api_client
                .post(&baseapi)
                .json(&BaseFormat {
                    service_name: value.name,
                    status: "up".to_string(),
                    error_msg: "".to_string(),
                })
                .send()
                .await
                .unwrap();
            println!("the res is {:?}", res);
        } else {
            let res = api_client
                .post(&baseapi)
                .json(&BaseFormat {
                    service_name: value.name,
                    status: "down".to_string(),
                    error_msg: format!("The status code is {}", code),
                })
                .send()
                .await
                .unwrap();
            println!("the res is {:?}", res);
        }
    } //endfor
}
