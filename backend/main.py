from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import time
import random

from ai_detector import detect_disaster

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create uploads folder if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

alerts = []
alert_id = 1


@app.get("/")
def home():
    return {"message": "CommunityShield Backend Running"}


@app.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):

    filename = f"{random.random()}_{int(time.time())}_{file.filename}"
    path = f"uploads/{filename}"

    with open(path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "file": f"http://127.0.0.1:8000/uploads/{filename}"
    }


@app.post("/alert")
async def create_alert(data: dict):

    global alert_id

    disaster_type = data.get("disaster_type")

    # run AI detection
    ai_result = detect_disaster(data.get("photo"), disaster_type)

    new_alert = {
        "id": alert_id,
        "disaster_type": disaster_type,
        "description": data.get("description"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "photo": data.get("photo"),
        "ai_prediction": ai_result["prediction"],
        "severity": ai_result["severity"],
        "assigned_rescuer": None
    }

    alerts.append(new_alert)

    alert_id += 1

    return {"status": "alert created", "alert": new_alert}


@app.get("/alerts")
def get_alerts():
    return alerts


@app.post("/accept-rescue/{id}")
def accept_rescue(id: int):

    for alert in alerts:

        if alert["id"] == id:
            alert["assigned_rescuer"] = "Rescue Team Assigned"
            return {"status": "rescuer assigned"}

    return {"error": "alert not found"}