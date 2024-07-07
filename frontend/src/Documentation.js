import React from 'react';

function Documentation() {
  return (
    <div className="documentation">
      <h2>Документация</h2>
      <div className="section">
        <h3>Загрузка данных</h3>
        <p>
          В этом разделе описывается процесс загрузки данных для дообучения модели. Вы можете выбрать файлы для загрузки и отправить их на сервер для дальнейшей обработки.
        </p>
      </div>
      <div className="section">
        <h3>Тренировка модели</h3>
        <p>
          В этом разделе описывается процесс тренировки модели. Вы можете начать тренировку, следить за прогрессом и остановить процесс при необходимости.
        </p>
      </div>
      <div className="section">
        <h3>Описание API</h3>
        <p>
          В этом разделе приводится описание доступных API эндпоинтов для загрузки данных и тренировки модели.
        </p>
      </div>
    </div>
  );
}

export default Documentation;
