import React, { useState, useRef, useEffect, useCallback } from "react";
import { playAudio } from "./playAudio";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000"; // this might not be correct, we will see afterwards


export const AudioInterface: React.FC<{
  audioFunction: (data: any) => void;
}> = ({ audioFunction }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<null | any>(null);
  const [audio, setAudio] = useState(null);
  const [audioSrc, setAudioSrc] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const getRecordingButtonText = () => {
    if (recording) {
      return "Send Audio Message";
    }
    return "Record Audio Message";
  };

  const sendAudioToBackend = useCallback(async () => {
    if (audio) {
      console.log("data being sent");
      const formData = new FormData();
      formData.append("audio", audio, "audio.webm");
      formData.append("message_type", "audio");

      try {
        const response = await fetch("http://127.0.0.1:5000/audio", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        // Decode base64 audio data
        console.log(data.chatbot_audio);
        playAudio(data.chatbot_audio);
        // all of the commented code is now in the playAudio function 
        // let audioData = atob(data.chatbot_audio);

        // // Convert decoded data to Uint8Array
        // let uint8Array = new Uint8Array(audioData.length);
        // for (let i = 0; i < audioData.length; i++) {
        //   uint8Array[i] = audioData.charCodeAt(i);
        // }

        // // Create Blob from Uint8Array
        // let blob = new Blob([uint8Array], { type: "audio/mp3" });

        // // Create URL from Blob
        // let url = URL.createObjectURL(blob);

        // // Create new Audio object and play it
        // let audioxxx = new Audio(url);
        // audioxxx.playbackRate = 1.25;
        // audioxxx.play()

        audioFunction(data);
        console.log(data);
        console.log(data.user_message);
        console.log(data.chatbot_response);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }, [audio, audioFunction]);

  const handleAudio = (e: any) => {
    setAudio(e.data);
  };

  const startRecording = async () => {
    try {
      // request permission to the users microphone 
      // stream holds the MediaStream object if the user grants permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleAudio; 
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
    // return new Promise((resolve, reject)=> {
    //   mediaRecorder.onstop = () => {
    //     setRecording(false);
    //   };
    //   mediaRecorder.ondataavailable = async (e: any) => {
    //     setAudio(e.data);
    //     resolve(void 0);
    //   };
    //   mediaRecorder.stop();
    // })
  };

  const handleMessageLogic = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  // const handleMessageLogic = async () => {
  //   if (recording) {
  //     // we wait for a Promise to be returned to ensure that audio data is set before the audio is sent to the backend
  //     await stopRecording();
  //     sendAudioToBackend();
  //   } else {
  //     startRecording();
  //   }
  // };

  // useEffect(() => {
  //   if (audioSrc && audioRef.current) {
  //     audioRef.current.play().catch((e) => console.error("Play failed:", e));
  //   }
  // }, [audioSrc]);

  useEffect(() => {
    if (!recording && audio) {
      sendAudioToBackend();
    }
  }, [recording, audio, sendAudioToBackend]);

  return (
    <div>
      <button onClick={handleMessageLogic}>{getRecordingButtonText()}</button>
      {/* <audio ref={audioRef} src={audioSrc} controls autoPlay></audio> */}
    </div>
  );
};

// export const AudioInterface: React.FC = () =>  {
//   const [audio, setAudio] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.on("audio", (data) => {
//       setAudio(data.data);
//     });

//     return () => { socket.disconnect() };
//   }, []);

//   const sendAudio = () => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.emit("audio", audio);
//   };

//   return (
//     <div>
//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         type="text"
//       />
//       <button onClick={sendAudio}>Send</button>
//       <p>Response: {audio}</p>
//     </div>
//   );
// }
