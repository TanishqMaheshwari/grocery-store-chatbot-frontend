import React, { useState, useRef, useEffect, useCallback } from "react";
import { playAudio } from "./playAudio";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000"; // this might not be correct, we will see afterwards

export const AudioInterface: React.FC<{
  audioFunction: (data: any) => void;
}> = ({ audioFunction }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // const [chunks, setChunks] = useState<Blob[]>([]);

  const sendAudioToBackend = async (audioBlob: Blob) => {
    if (audioBlob) {
      console.log("data being sent");
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("message_type", "audio");

      try {
        const response = await fetch("http://127.0.0.1:5000/audio", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
        playAudio(data.chatbot_audio);
        audioFunction(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder?.stop();
      setRecording(false)
    } else {
       // Start the recording
       navigator.mediaDevices.getUserMedia({ audio: true })
       .then(stream => {
           const newMediaRecorder = new MediaRecorder(stream);
          const currentChunks: Blob[] = [];

           // Collect chunks of audio data as they become available
           newMediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
              currentChunks.push(event.data);
            }   
           };

           // When recording stops, create a blob from the chunks and send it to the server
           newMediaRecorder.onstop = async () => {
               const audioBlob = new Blob(currentChunks, { type: 'audio/webm' });
               await sendAudioToBackend(audioBlob);
           };

           newMediaRecorder.start();
           setMediaRecorder(newMediaRecorder);
           setRecording(true);
       });
    }
  };

  // OLD FUNCTION IS HERE
  // const [recording, setRecording] = useState(false);
  // const [mediaRecorder, setMediaRecorder] = useState<null | any>(null);
  // const [audio, setAudio] = useState(null);
  // const [audioSrc, setAudioSrc] = useState("");
  // const audioRef = useRef<HTMLAudioElement>(null);

  // const getRecordingButtonText = () => {
  //   if (recording) {
  //     return "Send Audio Message";
  //   }
  //   return "Record Audio Message";
  // };

  // const sendAudioToBackend = useCallback(async () => {
  //   if (audio) {
  //     console.log("data being sent");
  //     const formData = new FormData();
  //     formData.append("audio", audio, "audio.webm");
  //     formData.append("message_type", "audio");

  //     try {
  //       const response = await fetch("http://127.0.0.1:5000/audio", {
  //         method: "POST",
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       // Decode base64 audio data
  //       console.log(data.chatbot_audio);
  //       playAudio(data.chatbot_audio);
  //       audioFunction(data);
  //       console.log(data);
  //       console.log(data.user_message);
  //       console.log(data.chatbot_response);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  // }, [audio, audioFunction]);

  // const handleAudio = (e: any) => {
  //   setAudio(e.data);
  // };

  // const startRecording = async () => {
  //   try {
  //     // request permission to the users microphone
  //     // stream holds the MediaStream object if the user grants permission
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  //     const recorder = new MediaRecorder(stream);
  //     recorder.ondataavailable = handleAudio;
  //     recorder.start();
  //     setMediaRecorder(recorder);
  //     setRecording(true);
  //   } catch (err) {
  //     console.error("Error accessing the microphone", err);
  //   }
  // };

  // const stopRecording = () => {
  //   if (mediaRecorder) {
  //     mediaRecorder.stop();
  //     setRecording(false);
  //   }
  // };

  // const handleMessageLogic = () => {
  //   if (recording) {
  //     stopRecording();
  //   } else {
  //     startRecording();
  //   }
  // }

  // // const handleMessageLogic = async () => {
  // //   if (recording) {
  // //     // we wait for a Promise to be returned to ensure that audio data is set before the audio is sent to the backend
  // //     await stopRecording();
  // //     sendAudioToBackend();
  // //   } else {
  // //     startRecording();
  // //   }
  // // };

  // // useEffect(() => {
  // //   if (audioSrc && audioRef.current) {
  // //     audioRef.current.play().catch((e) => console.error("Play failed:", e));
  // //   }
  // // }, [audioSrc]);

  // useEffect(() => {
  //   if (!recording && audio) {
  //     sendAudioToBackend();
  //   }
  // }, [recording, audio, sendAudioToBackend]);

  return (
    <div>
      <button onClick={toggleRecording}>
        {recording ? "Send audio message" : "Record audio message"}
      </button>
      {/* <button onClick={handleMessageLogic}>{getRecordingButtonText()}</button> */}
      {/* <audio ref={audioRef} src={audioSrc} controls autoPlay></audio> */}
    </div>
  );
};
