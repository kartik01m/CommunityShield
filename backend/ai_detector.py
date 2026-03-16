import os


def detect_disaster(image_path, disaster_type):

    disaster_type = disaster_type.lower()

    # severity rules based on disaster type
    severity_map = {
        "flood": "HIGH",
        "fire": "CRITICAL",
        "earthquake": "CRITICAL",
        "landslide": "HIGH"
    }

    severity = severity_map.get(disaster_type, "MEDIUM")

    return {
        "prediction": disaster_type.capitalize(),
        "severity": severity
    }