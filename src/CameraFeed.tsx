import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const CameraFeed: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);

    useEffect(() => {
        const enableStream = async () => {
            try {
                const constraints = {
                    video: {
                        width: { max: 1280 },
                        height: { max: 720 }
                    }
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing the camera: ", err);
            }
        };

        enableStream();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        setQrCode(code.data);
                        clearInterval(intervalId);
                    }
                }
            }
        }, 500); // Scan for QR codes every 500ms

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div>
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ transform: "scaleX(-1)" }}
            />
            <canvas 
                ref={canvasRef} 
                style={{ display: 'none' }} 
                width="1280" 
                height="720"
            />
            {qrCode && <p>QR Code Content: {qrCode}</p>}
        </div>
    );
};

export default CameraFeed;

// import React, { useEffect, useRef, useState } from 'react';
// import jsQR from 'jsqr';

// const CameraFeed: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [qrCode, setQrCode] = useState<string | null>(null);

//     useEffect(() => {
//         // Function to enable the camera stream
//         const enableStream = async () => {
//             try {
//                 const constraints = {
//                     video: {
//                         width: { max: 1280 },
//                         height: { max: 720 }
//                     }
//                 };
//                 const stream = await navigator.mediaDevices.getUserMedia(constraints);

//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             } catch (err) {
//                 console.error("Error accessing the camera: ", err);
//             }
//         };

//         enableStream();

//         // Cleanup function
//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
//                 tracks.forEach(track => track.stop());
//             }
//         };
//     }, []); // Empty dependency array ensures this effect runs only once

//     return (
//         <div>
//             <video ref={videoRef} autoPlay style={{ transform: "scaleX(-1)" }} />
//         </div>
//     );
// };

// export default CameraFeed;
