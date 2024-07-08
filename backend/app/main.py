import time
from typing import List
import zipfile
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
                "id": 2,
                "article": "tb-s-315-3p",
                "name": "Рубильник 315A 3P без рукоятки управления TwinBlock EKF",
                "amount": 1.000,
                "price": "21,718.00",
                "totalPrice": "21,718.00"
            },
            {
                "id": 3,
                "article": "tb-315-400-fh",
                "name": "Рукоятка управления для прямой установки на рубильники TwinBlock 315-400А EKF",
                "amount": 1.000,
                "price": "679.73",
                "totalPrice": "679.73"
            },
            {
                "id": 4,
                "article": "mcb47100-1-25C-pro",
                "name": "Авт. выкл. 1P 25А (C) 10kA ВА 47-100 EKF PROxima",
                "amount": 1.000,
                "price": "1,128.53",
                "totalPrice": "1,128.53"
            },
            {
                "id": 5,
                "article": "mccb-33-315-TR-av",
                "name": "AV POWER-3/3 315А 35kA TR",
                "amount": 1.000,
                "price": "61,025.11",
                "totalPrice": "61,025.11"
            },
            {
                "id": 6,
                "article": "tte-30-300",
                "name": "ТТЕ-30-300/5А класс точности 0,5 EKF",
                "amount": 3.000,
                "price": "1,228.32",
                "totalPrice": "3,684.96"
            },
            {
                "id": 7,
                "article": "mccb-23-200-TR-av",
                "name": "AV POWER-2/3 200А 35kA TR",
                "amount": 1.000,
                "price": "37,749.33",
                "totalPrice": "37,749.33"
            },
            {
                "id": 8,
                "article": "mccb-13-80-TR-av",
                "name": "AV POWER-1/3 80А 35kA TR",
                "amount": 2.000,
                "price": "21,379.25",
                "totalPrice": "42,758.50"
            },
            {
                "id": 9,
                "article": "mccb-13-32-TR-av",
                "name": "AV POWER-1/3 32А 35kA TR",
                "amount": 1.000,
                "price": "20,185.15",
                "totalPrice": "20,185.15"
            },
            {
                "id": 10,
                "article": "mccb-13-25-TR-av",
                "name": "AV POWER-1/3 25А 35kA TR",
                "amount": 2.000,
                "price": "19,713.00",
                "totalPrice": "39,426.00"
            },
            {
                "id": 11,
                "article": "mccb-13-125-TR-av",
                "name": "AV POWER-1/3 125А 35kA TR",
                "amount": 1.000,
                "price": "21,870.26",
                "totalPrice": "21,870.26"
            },
            {
                "id": 12,
                "article": "mb15-08-00m",
                "name": "Каркас ВРУ-1 Unit S сварной (2000х600х450) IP31 EKF PROxima",
                "amount": 2.000,
                "price": "43,352.91",
                "totalPrice": "86,705.82"
            },
            {
                "id": 13,
                "article": "mb15-04-01m",
                "name": "Боковая панель (2шт) для ВРУ-1 и ВРУ-2 (2000хШх450) Unit S/R EKF PROxima",
                "amount": 1.000,
                "price": "11,066.69",
                "totalPrice": "11,066.69"
            },
            {
                "id": 14,
                "article": "mb15-04-05p",
                "name": "Вертикальный П-образный профиль для ВРУ Unit и ЩО-70 (2000хШхГ) EKF PROxima",
                "amount": 4.000,
                "price": "2,407.45",
                "totalPrice": "9,629.80"
            },
            {
                "id": 15,
                "article": "mb15-08-01-05s",
                "name": "Панель монтажная (480х510х2) к ВРУ Unit и ЩО-70 (Bх600хГ) EKF PROxima",
                "amount": 1.000,
                "price": "4,130.07",
                "totalPrice": "4,130.07"
            },
            {
                "id": 16,
                "article": "mb-15-rl-60n",
                "name": "Комплект реек монтажных для литого корпуса для ВРУ Unit шириной 600мм (2шт)EKF PROxima",
                "amount": 3.000,
                "price": "1,376.40",
                "totalPrice": "4,129.20"
            },
            {
                "id": 17,
                "article": "mb-15-rp-45n",
                "name": "Комплект реек боковых для ВРУ Unit глубиной 450мм (4шт) EKF PROxima",
                "amount": 3.000,
                "price": "1,655.60",
                "totalPrice": "4,966.80"
            },
            {
                "id": 18,
                "article": "mb15-08-02-04",
                "name": "Цоколь к ВРУ Unit S IP31 (Вх600х450) EKF PROxima",
                "amount": 2.000,
                "price": "3,171.17",
                "totalPrice": "6,342.34"
            },
            {
                "id": 19,
                "article": "mb15-05-02",
                "name": "Рейка монтажная (50x510) перфорированная к ВРУ Unit и ЩО-70 (Вх600хГ) EKF PROxima",
                "amount": 6.000,
                "price": "306.38",
                "totalPrice": "1,838.28"
            },
            {
                "id": 20,
                "article": "adr-60",
                "name": "DIN-рейка перфорир. (600мм.) EKF PROxima",
                "amount": 1.000,
                "price": "141.13",
                "totalPrice": "141.13"
            },
            {
                "id": 21,
                "article": "mb-kar-a4",
                "name": "Карман для документации пластиковый А4 EKF",
                "amount": 1.000,
                "price": "483.10",
                "totalPrice": "483.10"
            },
            {
                "id": 22,
                "article": "SM-4x30",
                "name": "Шина М1T 4х30х4000 мм EKF PROxima",
                "amount": 1.000,
                "price": "15,925.50",
                "totalPrice": "15,925.50"
            },
            {
                "id": 23,
                "article": "SMG-17",
                "name": "ШМГИ 3x32x1 EKF PROxima",
                "amount": 4.000,
                "price": "12,684.08",
                "totalPrice": "50,736.32"
            },
            {
                "id": 24,
                "article": "plc-sm-40",
                "name": "Изолятор SM-40 475А 12кВ EKF",
                "amount": 2.000,
                "price": "113.53",
                "totalPrice": "227.06"
            },
            {
                "id": 25,
                "article": "plc-sl-450",
                "name": "Изолятор шинный 450А 9кВ Лесенка EKF",
                "amount": 2.000,
                "price": "632.29",
                "totalPrice": "1,264.58"
            }
        ]
    }
]

@app.get("/mock_data")
async def get_mock_data():
    return mock_data

@app.post("/upload")
async def upload_drawing(files: List[UploadFile] = File(...)):
    for file in files:
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
        csv_file_path = os.path.join("upload", f"{file.filename}_estimate.csv")
        df.to_csv(csv_file_path, index=False)
    
    return {"filenames": [file.filename for file in files]}



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