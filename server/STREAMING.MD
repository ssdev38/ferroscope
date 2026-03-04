# Ferroscop Streaming API

Ferroscop provides real-time system metrics streaming using Server-Sent Events (SSE). These endpoints allow clients to receive continuous updates for node metrics such as CPU usage and RAM usage.

All streaming endpoints return data using the `text/event-stream` content type.

---

## Query Parameter

| Parameter | Type    | Required | Description                   |
| --------- | ------- | -------- | ----------------------------- |
| node      | integer | Yes      | Unique identifier of the node |

Example:

```
/stream/cpu?node=1
```

---

# CPU Metrics Stream

Streams real-time CPU usage updates for a specific node.

## Endpoint

```
GET /stream/cpu
```

## Query Parameters

| Parameter | Type    | Required | Description     |
| --------- | ------- | -------- | --------------- |
| node      | integer | Yes      | Node identifier |

Example request:

```
/stream/cpu?node=1
```

## Response Format


Each event contains a JSON payload with the latest CPU metric.

### JSON Structure

| Field     | Type                  | Description                            |
| --------- | --------------------- | -------------------------------------- |
| value     | number                | CPU usage value                        |
| date_time | string (ISO 8601 UTC) | Timestamp when the metric was recorded |

### Example Event

```
data: {"value": 12.4, "date_time": "2026-03-08T10:12:31Z"}
```

---

# RAM Metrics Stream

Streams real-time RAM usage updates for a specific node.

## Endpoint

```
GET /stream/ram
```

## Query Parameters

| Parameter | Type    | Required | Description     |
| --------- | ------- | -------- | --------------- |
| node      | integer | Yes      | Node identifier |

Example request:

```
/stream/ram?node=1
```

## Response Format


Each event contains a JSON payload with the latest RAM metric.

### JSON Structure

| Field     | Type                  | Description                            |
| --------- | --------------------- | -------------------------------------- |
| free      | string                | Amount of free RAM                     |
| total     | string                | Total RAM available                    |
| timestamp | string (ISO 8601 UTC) | Timestamp when the metric was recorded |

### Example Event

```
data: {"free": "3.2GB", "total": "8GB", "timestamp": "2026-03-08T10:12:31Z"}
```

---

# Example Usage

## JavaScript (Browser)

```javascript
const source = new EventSource("/stream/cpu?node=1");

source.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("CPU usage:", data.value);
};
```

---

## Curl

```
curl http://localhost:8000/stream/cpu?node=1
```

Example output:

```
data: {"value": 15.4, "date_time": "2026-03-08T10:15:01Z"}

data: {"value": 16.1, "date_time": "2026-03-08T10:15:02Z"}
```

---

# Connection Behaviour

* The connection remains open and continuously streams updates.
* The server sends keep-alive events to prevent connection timeout.
* Clients should reconnect automatically if the connection drops.

---

# Error Responses

| Status Code | Description                                    |
| ----------- | ---------------------------------------------- |
| 503         | Stream for the requested node is not available |
