import React from 'react';
import '../css/Documentation.css';

const Documentation: React.FC = () => {
  return (
    <div className="documentation">
      <h2>Документация</h2>
      <div className="section">
        <h3>Загрузка данных</h3>
        <p>
          В этом разделе описывается процесс загрузки данных для дообучения модели. Вы можете выбрать файлы для загрузки и отправить их на сервер для дальнейшей обработки.
        </p>
        <ol>
          <li>Перейдите в раздел "Загрузка".</li>
          <li>Выберите необходимые файлы для загрузки.</li>
          <li>Нажмите кнопку "Загрузить".</li>
          <li>Дождитесь завершения процесса загрузки. Статус загрузки будет отображен на экране.</li>
        </ol>
      </div>
      <div className="section">
        <h3>Тренировка модели</h3>
        <p>
          В этом разделе описывается процесс тренировки модели. Вы можете начать тренировку, следить за прогрессом и остановить процесс при необходимости.
        </p>
        <ol>
          <li>Перейдите в раздел "Тренировка".</li>
          <li>Выберите файлы для дообучения модели.</li>
          <li>Нажмите кнопку "Начать тренировку".</li>
          <li>Следите за прогрессом тренировки. Прогресс будет отображаться в процентах.</li>
          <li>Вы можете остановить тренировку в любой момент, нажав кнопку "Остановить тренировку".</li>
          <li>После завершения тренировки выберите обученную модель для дальнейшего использования.</li>
        </ol>
      </div>
      <div className="section">
        <h3>Описание API</h3>
        <p>
          В этом разделе приводится описание доступных API эндпоинтов для загрузки данных и тренировки модели.
        </p>
        <h4>Загрузка данных</h4>
        <pre>
          <code>
            POST /upload
            Параметры:
            - files: List[UploadFile]
            Описание:
            Загружает файлы для дальнейшей обработки и обучения модели.
          </code>
        </pre>
        <h4>Тренировка модели</h4>
        <pre>
          <code>
            POST /train_model
            Параметры:
            - files: List[UploadFile]
            Описание:
            Начинает процесс тренировки модели на основе загруженных данных.
          </code>
        </pre>
        <h4>Прогресс тренировки</h4>
        <pre>
          <code>
            GET /training_progress
            Описание:
            Возвращает текущий прогресс тренировки модели.
          </code>
        </pre>
        <h4>Получение моделей</h4>
        <pre>
          <code>
            GET /models
            Описание:
            Возвращает список обученных моделей.
          </code>
        </pre>
        <h4>Остановка тренировки</h4>
        <pre>
          <code>
            POST /stop_training
            Описание:
            Останавливает текущий процесс тренировки модели.
          </code>
        </pre>
      </div>
    </div>
  );
}

export default Documentation;
