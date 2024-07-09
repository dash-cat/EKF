import time
from typing import List, Union
import zipfile
from fastapi import BackgroundTasks, FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from . import models, crud
from . import utils
from .database import engine, SessionLocal
import pandas as pd
import os
import pdb

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

mock_data = [
    {
        "id": 1,
        "article": "ВРУ",
        "name": "Схема",
        "amount": 1.000,
        "price": "447,812.26",
        "totalPrice": "447,812.26",
        "subItems": [
            {
                "id": 1,
                "article": "mb24-3",
                "name": "ЩМПг- 65.50.22 (ЩРНМ-3) IP54 EKF PROxima",
                "amount": 1.0,
                "price": "11 931",
                "totalPrice": "13"
            },
            {
                "id": 2,
                "article": "mb-kar-a4",
                "name": "Карман для документации пластиковый А4 EKF",
                "amount": 1.0,
                "price": "436.84",
                "totalPrice": "436.84"
            },
            {
                "id": 3,
                "article": "sn0-125-16-k",
                "name": "Шина PEN \"\"ноль-земля\"\" (8x12мм) 16 отв. латунь крепеж по краям EKF",
                "amount": 2.0,
                "price": "420.12",
                "totalPrice": "840.24"
            },
            {
                "id": 4,
                "article": "ak-1-1",
                "name": "Изолятор угловой \"\"Стойка\"\" синий EKF",
                "amount": 2.0,
                "price": "9.94",
                "totalPrice": "19.88"
            },
            {
                "id": 5,
                "article": "ak-1-1-y",
                "name": "Изолятор угловой \"\"Стойка\"\" желтый EKF",
                "amount": 2.0,
                "price": "9.94",
                "totalPrice": "19.88"
            },
            {
                "id": 6,
                "article": "an-1-01",
                "name": "Наклейка \"\"Молния\"\" (100х100х100мм.) EKF PROxima",
                "amount": 1.0,
                "price": "14.16",
                "totalPrice": "14.16"
            },
            {
                "id": 7,
                "article": "an-1-06",
                "name": "Наклейка \"\"Земля\"\" (d30мм.) EKF PROxima",
                "amount": 1.0,
                "price": "3.4",
                "totalPrice": "3.4"
            },
            {
                "id": 8,
                "article": "ahdw-211",
                "name": "Зажим на DIN-рейку 1 винт HDW-211 EKF PROxima",
                "amount": 2.0,
                "price": "20.24",
                "totalPrice": "40.48"
            },
            {
                "id": 9,
                "article": "kk60-60",
                "name": "Канал кабельный перфорир. (ВхШ: 60х60мм.) EKF PROxima",
                "amount": 1.0,
                "price": "633.98",
                "totalPrice": "633.98"
            },
            {
                "id": 10,
                "article": "kk60-40",
                "name": "Канал кабельный перфорир. (ВхШ: 60х40мм.) EKF PROxima",
                "amount": 1.0,
                "price": "472.44",
                "totalPrice": "472.44"
            },
            {
                "id": 11,
                "article": "rkf-37",
                "name": "Реле контроля фаз RKF-37 EKF",
                "amount": 1.0,
                "price": "3 742",
                "totalPrice": "06"
            },
            {
                "id": 12,
                "article": "mcb10-3-25C-av",
                "name": "AV-10 3P 25A (C) 10kA EKF AVERES",
                "amount": 1.0,
                "price": "2 860",
                "totalPrice": "63"
            },
            {
                "id": 13,
                "article": "M636106B",
                "name": "Авт. выкл. 1P 6А (B) 6кА ВА 47-63N EKF PROxima",
                "amount": 1.0,
                "price": "380.8",
                "totalPrice": "380.8"
            },
            {
                "id": 14,
                "article": "M636116B",
                "name": "Авт. выкл. 1P 16А (B) 6кА ВА 47-63N EKF PROxima",
                "amount": 9.0,
                "price": "381.8",
                "totalPrice": "3 436"
            },
            {
                "id": 15,
                "article": "km-3-20-40",
                "name": "КМ 20А 4NО (3 мод.) EKF",
                "amount": 5.0,
                "price": "3 875",
                "totalPrice": "88"
            },
            {
                "id": 16,
                "article": "ledm-ad16-g",
                "name": "Матрица светодиодная AD16-22HS зеленый 230 В AC EKF",
                "amount": 5.0,
                "price": "138.78",
                "totalPrice": "693.9"
            },
            {
                "id": 17,
                "article": "ledm-ad16-r",
                "name": "Матрица светодиодная AD16-22HS красный 230 В AC EKF",
                "amount": 5.0,
                "price": "139.48",
                "totalPrice": "697.4"
            },
            {
                "id": 18,
                "article": "xb2-bd21",
                "name": "Переключатель BD21 2P короткая ручка NO EKF",
                "amount": 1.0,
                "price": "371.07",
                "totalPrice": "371.07"
            },
            {
                "id": 19,
                "article": "rp-25-3-230",
                "name": "РП 25/3 10А 230В АС EKF",
                "amount": 4.0,
                "price": "629.83",
                "totalPrice": "2 519"
            },
            {
                "id": 20,
                "article": "rm-25-3",
                "name": "РМ 25/3 EKF",
                "amount": 3.0,
                "price": "275.57",
                "totalPrice": "826.71"
            }
        ]
    }
]

@app.get("/mock_data")
async def get_mock_data():
    return mock_data

@app.post("/upload")
async def upload_drawing(files: List[UploadFile] = File(...)):
    filenames = []
    
    if len(files) == 1:
        # Обработка случая, когда передан один файл
        file = files[0]
        content = await file.read()
        try:
            drawing_data = utils.process_drawing(content)
            estimate = utils.calculate_estimate(drawing_data)
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)
        
        df = pd.DataFrame(estimate)
        
        if not os.path.exists("upload"):
            os.makedirs("upload")
        
        original_file_path = os.path.join("upload", file.filename)
        with open(original_file_path, "wb") as f:
            f.write(content)
        
        filenames.append(file.filename)
    
    else:
        # Обработка случая, когда передано несколько файлов
        for file in files:
            content = await file.read()
            try:
                drawing_data = utils.process_drawing(content)
                estimate = utils.calculate_estimate(drawing_data)
            except Exception as e:
                return JSONResponse(content={"error": str(e)}, status_code=500)
            
            df = pd.DataFrame(estimate)
            
            if not os.path.exists("upload"):
                os.makedirs("upload")
            
            original_file_path = os.path.join("upload", file.filename)
            with open(original_file_path, "wb") as f:
                f.write(content)
            
            filenames.append(file.filename)
    
    return {"filenames": filenames}

@app.post("/train_model/")
async def train_model(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    global training_in_progress, training_progress
    if training_in_progress:
        return JSONResponse(content={"message": "Training already in progress"}, status_code=400)
    
    training_in_progress = True
    training_progress = 0

    def train(file_paths: List[str]):
        global training_in_progress, training_progress
        for content in file_paths:
            utils.add_drawing_to_training_data(content)
        
        simulate_training_progress()
        
        utils.train_model()
        training_in_progress = False

    file_paths = []
    upload_folder = "upload_train_zip"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    for file in files:
        file_location = os.path.join(upload_folder, file.filename)
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        file_paths.append(file_location)
    
        # Extract ZIP file
        if zipfile.is_zipfile(file_location):
            with zipfile.ZipFile(file_location, 'r') as zip_ref:
                zip_ref.extractall(upload_folder)

    background_tasks.add_task(train, file_paths)
    return {"status": "Training started", "files": [file.filename for file in files]}

def simulate_training_progress(interval: int = 1):
    global training_progress
    while training_progress < 100 and training_in_progress:
        time.sleep(interval)
        training_progress += 1
        if training_progress > 100:
            training_progress = 100

@app.get("/training_progress")
async def get_training_progress():
    global training_progress, training_in_progress
    if not training_in_progress:
        return JSONResponse(content={"message": "No training in progress"}, status_code=400)
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