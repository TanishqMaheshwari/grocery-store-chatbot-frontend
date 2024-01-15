import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { CameraFeed } from './CameraFeed';
import { SignupForm } from './SignUpForm';

const App: React.FC = () => {
  const [component, setComponent] = useState("chat") // or qrcode and chat
  
  const switchComponent = () => {
    if (component === "signup") {
      setComponent("qrcode")
    } else if (component === "qrcode") {
      setComponent("chat")
    }
  }
  
  return (
    <div className="App">
      {component === "signup" && <SignupForm onSignupComplete={switchComponent}/>}
      {component === "qrcode" && <CameraFeed onScanComplete={switchComponent}/>}
      {component === "chat" && <ChatInterface/>}
    </div>


  );
}

export default App;