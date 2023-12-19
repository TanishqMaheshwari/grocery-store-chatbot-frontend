import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import CameraFeed from './CameraFeed';

const App: React.FC = () => {
  return (
    <div className="App">
      <CameraFeed />
      {/*<ChatInterface />*/}
    </div>
  );
}

export default App;