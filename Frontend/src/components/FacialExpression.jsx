import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css';
import axiosInstance from '../axios.jsx';

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const loadModels = async () => {
    const MODEL_URL = './models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Webcam error: ", err));
  };

  const detectMood = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (!detections || detections.length === 0) {
      console.log("No face detected");
      return;
    }

    let highestValue = 0;
    let mood = '';

    for (const [expression, value] of Object.entries(detections[0].expressions)) {
      if (value > highestValue) {
        highestValue = value;
        mood = expression;
      }
    }

    console.log("Detected mood:", mood);

    try {
      const response = await axiosInstance.get(`/songs?mood=${mood}`);
      console.log("Fetched songs:", response.data?.songs);
      setSongs(response.data?.songs || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    loadModels().then(() => {
      startVideo();
    });
  }, []);

  return (
    <div className='VideoElement' style={{ position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        className='user-video-feed'
        onPlay={async () => {
          const interval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
              const video = videoRef.current;
              const canvas = canvasRef.current;

              const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
              };

              faceapi.matchDimensions(canvas, displaySize);

              const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

              const resizedDetections = faceapi.resizeResults(detections, displaySize);
              canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            }
          }, 100); 
        }}
      />
      <canvas ref={canvasRef} className='overlay-canvas' />
      </div>
      <button onClick={detectMood}>Detect Mood</button>
    </div>
  );
}
