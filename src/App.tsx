import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import CameraFeed from './CameraFeed';
import { SignupForm } from './SignUpForm';

const App: React.FC = () => {
  // we need to change this state to a string so that we can go from 
  // component to component 
  const [scan, setScan] = useState(false) 
  const handleScanComplete = () => {
    setScan(true)
  }
  
  return (
    <div className="App">
      <SignupForm />
      {/* Comment this code when running the experiment that does not take into account customer details
      {scan === false ?
        <CameraFeed onScanComplete={handleScanComplete}/> :
        <ChatInterface />
      } */}

      {/* Uncomment the line below when running the experiment that does not take into account customer details */}
      {/* <ChatInterface */}
    </div>


  );
}

export default App;