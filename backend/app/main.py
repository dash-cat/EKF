import time
from typing import List
from fastapi import BackgroundTasks, FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from . import models, crud
from . import utils
from .database import engine, SessionLocal
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

training_in_progress = False
training_progress = 0

@app.post("/upload")
async def upload_drawing(file: UploadFile = File(...)):
    content = await file.read()
    drawing_data = utils.process_drawing(content)
    estimate = utils.calculate_estimate(drawing_data)
    
    df = pd.DataFrame(estimate)
    
    if not os.path.exists("upload"):
        os.makedirs("upload")
    
    # Сохранение оригинального файла
    original_file_path = os.path.join("upload", file.filename)
    with open(original_file_path, "wb") as f:
        f.write(content)
    
    # Сохранение CSV файла с оценкой
    csv_file_path = os.path.join("upload", "estimate.csv")
    df.to_csv(csv_file_path, index=False)
    
    return {"filename": file.filename, "original_file_path": original_file_path, "csv_file_path": csv_file_path}


@app.post("/train_model/")
async def train_model(files: List[UploadFile] = File(...), background_tasks: BackgroundTasks):
    global training_in_progress, training_progress
    if training_in_progress:
        return JSONResponse(content={"message": "Training already in progress"}, status_code=400)
    
    training_in_progress = True
    training_progress = 0

    def train():
        global training_in_progress, training_progress
        for file in files:
            content = file.read()
            utils.add_drawing_to_training_data(content)
        
        for i in range(10):
            if not training_in_progress:
                break
            training_progress += 10
            time.sleep(1)
        
        utils.train_model()
        training_in_progress = False

    background_tasks.add_task(train)
    return {"status": "Training started"}

@app.get("/train_progress/")
async def get_train_progress():
    return {"progress": training_progress}

@app.get("/models/")
async def get_models():
    models_list = utils.get_trained_models()
    return {"models": models_list}

@app.post("/stop_training/")
async def stop_training():
    global training_in_progress
    if not training_in_progress:
        return JSONResponse(content={"message": "No training in progress"}, status_code=400)
    
    training_in_progress = False
    return {"status": "Training stopped"}