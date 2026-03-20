from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import os, uuid
from datetime import datetime

app = FastAPI(title="CommunityShield API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ── In-memory store ──────────────────────────────────────────────
alerts_db: List[dict] = []
alert_counter = {"id": 1}


# ── WebSocket manager ────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active_connections:
            self.active_connections.remove(ws)

    async def broadcast(self, message: dict):
        dead = []
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                dead.append(conn)
        for d in dead:
            self.disconnect(d)


manager = ConnectionManager()


# ── AI risk classifier ────────────────────────────────────────────
def classify_risk(disaster_type: str, details: str = "") -> str:
    combined = (disaster_type + " " + (details or "")).lower()
    high_keywords = ["flood", "fire", "earthquake", "cyclone", "hurricane",
                     "wildfire", "tsunami", "explosion", "chemical", "gas leak",
                     "trapped", "unconscious", "bleeding", "collapse", "drowning"]
    medium_keywords = ["landslide", "storm", "accident", "medical", "injury", "fallen"]
    for kw in high_keywords:
        if kw in combined:
            return "HIGH"
    for kw in medium_keywords:
        if kw in combined:
            return "MEDIUM"
    return "LOW"


# ── Pydantic models ───────────────────────────────────────────────
class AlertCreate(BaseModel):
    disaster_type: str
    location: str
    details: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    citizen_name: Optional[str] = "Anonymous"


# ── Routes ───────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "CommunityShield API v2.0 is running", "total_alerts": len(alerts_db)}


@app.post("/alert")
async def create_alert(alert: AlertCreate):
    risk = classify_risk(alert.disaster_type, alert.details or "")
    new_alert = {
        "id":           alert_counter["id"],
        "disaster_type":alert.disaster_type,
        "location":     alert.location,
        "details":      alert.details,
        "latitude":     alert.latitude,
        "longitude":    alert.longitude,
        "citizen_name": alert.citizen_name,
        "image_url":    None,
        "risk_level":   risk,
        "status":       "pending",
        "timestamp":    datetime.now().isoformat(),
        "created_at":   datetime.now().strftime("%H:%M:%S"),
    }
    alerts_db.append(new_alert)
    alert_counter["id"] += 1
    await manager.broadcast({"event": "new_alert", "alert": new_alert})
    return new_alert


@app.get("/alerts")
def get_alerts(status: Optional[str] = None):
    if status:
        return [a for a in alerts_db if a["status"] == status]
    return alerts_db


@app.get("/alerts/{alert_id}")
def get_alert(alert_id: int):
    for a in alerts_db:
        if a["id"] == alert_id:
            return a
    return {"error": "Alert not found"}


@app.post("/accept-rescue/{alert_id}")
async def accept_rescue(alert_id: int):
    for a in alerts_db:
        if a["id"] == alert_id:
            a["status"] = "accepted"
            a["accepted_at"] = datetime.now().isoformat()
            await manager.broadcast({"event": "alert_accepted", "alert_id": alert_id, "alert": a})
            return {"message": "Rescue accepted", "alert": a}
    return {"error": "Alert not found"}


@app.post("/resolve/{alert_id}")
async def resolve_alert(alert_id: int):
    for a in alerts_db:
        if a["id"] == alert_id:
            a["status"] = "resolved"
            a["resolved_at"] = datetime.now().isoformat()
            await manager.broadcast({"event": "alert_resolved", "alert_id": alert_id})
            return {"message": "Alert resolved", "alert": a}
    return {"error": "Alert not found"}


@app.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"image_url": f"/uploads/{filename}", "filename": filename}


@app.get("/stats")
def get_stats():
    return {
        "total":     len(alerts_db),
        "pending":   sum(1 for a in alerts_db if a["status"] == "pending"),
        "accepted":  sum(1 for a in alerts_db if a["status"] == "accepted"),
        "resolved":  sum(1 for a in alerts_db if a["status"] == "resolved"),
        "high_risk": sum(1 for a in alerts_db if a["risk_level"] == "HIGH"),
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_json({"event": "connected", "message": "CommunityShield WebSocket active"})
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"event": "pong", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)