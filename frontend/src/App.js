import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UploadDrawing from './UploadDrawing';
import TrainModel from './TrainModel';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/upload" component={UploadDrawing} />
        <Route path="/train" component={TrainModel} />
      </Switch>
    </Router>
  );
}

export default App;
