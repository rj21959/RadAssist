from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
import cv2
from PIL import Image
import io
import os
from datetime import datetime
import uuid

app = FastAPI(title="RadAssist API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock AI Model - Replace with actual trained model
class RadiologyModel:
    def __init__(self):
        self.conditions = [
            "Normal", "Pneumonia", "Fracture", "Cardiomegaly", 
            "Pleural Effusion", "Pneumothorax"
        ]
    
    def preprocess_image(self, image_data):
        """Preprocess the uploaded image"""
        image = Image.open(io.BytesIO(image_data))
        image = image.convert('RGB')
        image = np.array(image)
        
        # Resize to standard size
        image = cv2.resize(image, (224, 224))
        
        # Normalize
        image = image / 255.0
        image = np.expand_dims(image, axis=0)
        
        return image
    
    def predict(self, image_data):
        """Mock prediction - replace with actual model inference"""
        try:
            processed_image = self.preprocess_image(image_data)
            
            # Mock AI analysis (replace with real model prediction)
            predictions = np.random.dirichlet(np.ones(len(self.conditions)), size=1)[0]
            predicted_class = np.argmax(predictions)
            confidence = predictions[predicted_class]
            
            # Generate mock findings based on prediction
            condition = self.conditions[predicted_class]
            findings = self.generate_findings(condition, confidence)
            
            return {
                "diagnosis": condition,
                "confidence": float(confidence),
                "findings": findings,
                "recommendations": self.generate_recommendations(condition),
                "conditions_probabilities": {
                    cond: float(pred) for cond, pred in zip(self.conditions, predictions)
                }
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
    def generate_findings(self, condition, confidence):
        """Generate mock clinical findings based on condition"""
        findings_map = {
            "Normal": [
                "Clear lung fields",
                "Normal cardiac silhouette",
                "No acute cardiopulmonary process"
            ],
            "Pneumonia": [
                "Consolidation in right lower lobe",
                "Air bronchograms present",
                "Increased pulmonary markings"
            ],
            "Fracture": [
                "Cortical discontinuity at mid-clavicle",
                "Alignment abnormality",
                "Soft tissue swelling noted"
            ],
            "Cardiomegaly": [
                "Cardiothoracic ratio > 0.5",
                "Enlarged cardiac silhouette",
                "Normal pulmonary vasculature"
            ],
            "Pleural Effusion": [
                "Blunted costophrenic angle",
                "Meniscus sign present",
                "Increased opacity in lower lung zones"
            ],
            "Pneumothorax": [
                "Visceral pleural line visible",
                "Absence of lung markings peripherally",
                "Deep sulcus sign"
            ]
        }
        return findings_map.get(condition, ["No significant findings"])
    
    def generate_recommendations(self, condition):
        """Generate clinical recommendations"""
        recommendations_map = {
            "Normal": ["Routine follow-up as clinically indicated"],
            "Pneumonia": [
                "Antibiotic therapy recommended",
                "Follow-up chest X-ray in 4-6 weeks",
                "Clinical correlation required"
            ],
            "Fracture": [
                "Orthopedic consultation",
                "Appropriate immobilization",
                "Follow-up X-ray in 2 weeks"
            ],
            "Cardiomegaly": [
                "Echocardiogram recommended",
                "Cardiology consultation",
                "Evaluate for heart failure"
            ],
            "Pleural Effusion": [
                "Consider thoracentesis if symptomatic",
                "Evaluate for underlying cause",
                "Follow-up imaging as needed"
            ],
            "Pneumothorax": [
                "Urgent surgical consultation",
                "Consider chest tube placement",
                "Monitor for tension physiology"
            ]
        }
        return recommendations_map.get(condition, ["Clinical correlation advised"])

# Initialize model
model = RadiologyModel()

@app.get("/")
async def root():
    return {"message": "RadAssist API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Analyze uploaded medical image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Perform AI analysis
        result = model.predict(image_data)
        
        # Generate unique analysis ID
        analysis_id = str(uuid.uuid4())
        
        return JSONResponse({
            "analysis_id": analysis_id,
            "filename": file.filename,
            "timestamp": datetime.now().isoformat(),
            **result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/results/{analysis_id}")
async def get_results(analysis_id: str):
    """Retrieve previous analysis results"""
    # In a real application, you'd fetch from database
    return {"message": "Results retrieval endpoint", "analysis_id": analysis_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)