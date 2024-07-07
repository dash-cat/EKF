from typing import List
from fastapi import FastAPI, UploadFile, File
from . import models, crud
from . import utils
from .database import engine, SessionLocal
import pandas as pd

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.post("/upload")
async def upload_drawing(file: UploadFile = File(...)):
    content = await file.read()
    drawing_data = utils.process_drawing(content)
    estimate = utils.calculate_estimate(drawing_data)
    
    df = pd.DataFrame(estimate)
    df.to_csv("estimate.csv", index=False)
    
    return {"filename": file.filename}

@app.post("/train_model/")
async def train_model(files: List[UploadFile] = File(...)):
    for file in files:
        content = await file.read()
        utils.add_drawing_to_training_data(content)
    
    training_progress = utils.train_model()
    
    return {"status": "Training started", "progress": training_progress}
