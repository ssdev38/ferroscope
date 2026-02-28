# Ferroscope Agent

## Overview

Ferroscope Agent is a  Linux-based system monitoring agent written entirely in Rust. It is designed for performance, reliability, and minimal resource overhead.

The agent runs directly on target infrastructure and reports system-level telemetry and task execution results to the Ferroscope backend.

> **Platform Support:** Linux (x86_64). Additional platforms are planned.

---

## Architecture Principles

Ferroscope Agent is built with the following goals:

* **Performance-first design** — Low CPU and memory footprint.
* **Memory safety** — Leveraging Rust’s ownership model to eliminate runtime memory vulnerabilities.
* **Concurrency without compromise** — Efficient async execution model.
* **Extensibility** — Task system designed to support future monitoring capabilities.
* **Deterministic behavior** — Predictable execution intervals and structured reporting.

---

## Core Capabilities

The agent collects and reports the following system metrics:

### System Telemetry

* CPU usage
* RAM usage
* Kernel version
* Operating system name
* System uptime
* CPU thread count
* CPU vendor information

These metrics provide a lightweight but actionable overview of system health and runtime environment.

Additional telemetry modules will be introduced in upcoming releases.

---

## Task Execution System

Beyond telemetry, the Ferroscope Agent supports a configurable task system.

Tasks are defined via a configuration file and executed locally by the agent.

### Currently Supported Task Type

#### 1. Service Tracking (Host Monitoring)

The agent can monitor a host or service at a fixed interval.

When enabled, the agent will:

1. Read tracking rules from the configuration file.
2. Perform health checks at a defined interval.
3. Determine whether the service is alive or unreachable.
4. Report status results to the backend.

This capability is especially valuable for:

* Monitoring services running inside VPNs or private networks.
* Observing internal infrastructure without exposing it publicly.
* Detecting downtime in restricted environments.

More task types (process monitoring, port checks, advanced health validation, etc.) are planned.

---

# Configuration

Ferroscope Agent uses TOML-based configuration files to define tracking tasks.

Configuration files must follow a strict directory structure relative to the agent binary.

### Directory Structure

The configuration directory must be placed in the **same directory where the agent binary resides**.

Required structure:

```
<binary_directory>/
│
├── ferroscope-agent
├── CONF/
│   ├── Web/
│   └── Host/
```

* `CONF/` — Root configuration directory (must be created manually).
* `Web/` — Contains web tracking configuration files.
* `Host/` — Contains host tracking configuration files.

The agent reads configurations dynamically from these directories.

---

## Web Checking Configuration

Web tracking allows monitoring HTTP/HTTPS endpoints.

Each web tracking configuration must:

* Be a `.toml` file
* Be placed inside `CONF/Web/`

### Required Fields

| Field         | Type    | Description                                                                    |
| ------------- | ------- | ------------------------------------------------------------------------------ |
| `name`        | String  | Logical identifier for the check                                               |
| `url`         | String  | Full URL including protocol (e.g., [https://example.com](https://example.com)) |
| `status_code` | Integer | Expected HTTP status code                                                      |

### Example

```toml
name = "example-home"
url = "https://example.com"
status_code = 200
```

### Behavior

The agent will:

* Send an HTTP request to the specified URL
* Compare the returned status code with the expected value
* Mark the check as failed if the status does not match
* Report the result to the backend

---

## Host Checking Configuration

Host tracking allows monitoring TCP connectivity to a specific host and port.

Each host tracking configuration must:

* Be a `.toml` file
* Be placed inside `CONF/Host/`

### Required Fields

| Field  | Type    | Description                                           |
| ------ | ------- | ----------------------------------------------------- |
| `name` | String  | Logical identifier for the check                      |
| `host` | String  | Target IPv4 address (IPv6 not supported at this time) |
| `port` | Integer | Port number to test connectivity                      |

### Example

```toml
name = "internal-api"
host = "192.168.1.10"
port = 8080
```

### Behavior

The agent will:

* Attempt to establish a TCP connection to the specified host and port
* Mark the check as successful if connection succeeds
* Mark the check as failed if connection cannot be established
* Report the result to the backend

---

### Important Notes

* Configuration files must be valid TOML.
* Files placed outside the required directory structure will be ignored.
* IPv6 is not supported for host checks at this stage.
* Misconfigured files may cause the check to fail validation.

This configuration model is intentionally simple and deterministic. More advanced options (timeouts, retries, intervals, alert rules) will be introduced in future releases.

---

## Installation

The agent must be installed directly on the target Linux machine.

Installation options will include:

### 1. Download or Build

- **Option A: Download Compiled Binary (Linux x86_64)**
  
  [Download Latest Release](./WooDns-linux-amd64)

  ```sh
  chmod +x ferroscope-agent
  ```

- **Option B: Build from Source**

    ferroscope requires **Rust 1.89.0 or later**.

    ```sh
    git clone https://github.com/Subhodip1307/ferroscope.git
                or,
    git clone git@github.com:Subhodip1307/ferroscope.git  
    cd ferroscope/agent
    cargo build --release
    # The binary will be at target/release/agent
    ```

---

## Deployment with systemd

For production environments, the Ferroscope Agent should be managed using `systemd` to ensure automatic startup, controlled restarts, and process supervision.

### Step 1: Move Binary to a Standard Location

Place the compiled binary in a stable path such as:

```
/usr/local/bin/ferroscope-agent
```

Ensure execution permissions are set:

```
chmod +x /usr/local/bin/ferroscope-agent
```

The `CONF/` directory must remain in the same directory as the binary unless future versions introduce configurable paths.

---

### Step 2: Create systemd Service File

Create a service file:

```
/etc/systemd/system/ferroscope-agent.service
```

Example configuration:

```
[Unit]
Description=Ferroscope Monitoring Agent
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ferroscope-agent
WorkingDirectory=/usr/local/bin
User=woodns
Group=woodns
Restart=on-failure
Environment="BASEAPI=<your server url>"
Environment="AUTH=<your server AUTH TOKEN>"

[Install]
WantedBy=multi-user.target
```

---

### Environment Variables

Ferroscope Agent requires the following environment variables:

| Variable  | Description                               |
| --------- | ----------------------------------------- |
| `BASEAPI` | Base URL of the Ferroscope backend server |
| `AUTH`    | Authentication token used by the agent    |


### Step 3: Reload and Enable Service

Reload systemd:

```
systemctl daemon-reload
```

Enable the service to start on boot:

```
systemctl enable ferroscope-agent
```

Start the service:

```
systemctl start ferroscope-agent
```

---

### Step 4: Verify Status

Check service status:

```
systemctl status ferroscope-agent
```

View logs:

```
journalctl -u ferroscope-agent -f
```

---

### Production Recommendations

* Avoid running as `root` unless required. Create a dedicated system user for the agent.
* Restrict filesystem permissions on the `CONF/` directory.
* Monitor restart frequency to detect crash loops.
* Consider resource limits (`LimitNOFILE`, `MemoryMax`) for hardened environments.

Using systemd ensures the Ferroscope Agent remains resilient, supervised, and automatically recovered in case of failure.


## Security Considerations
* No unnecessary ports are exposed.
* Communication with backend services should be secured using TLS.
* Sensitive configuration values should be protected at the filesystem level.

---

## Roadmap

Planned enhancements include:

* Expanded telemetry metrics
* Advanced health validation
* Alerting integrations
* Multi-platform support
* Plugin-based task system
* Performance optimizations for large-scale deployments

---

Ferroscope Agent is designed to be a foundational infrastructure component — lightweight, deterministic, and production-ready.
