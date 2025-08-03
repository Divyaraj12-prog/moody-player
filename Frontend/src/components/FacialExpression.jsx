import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css';
import axiosInstance from '../axios.jsx';

export default function FacialExpression({ setSongs }) {
  const videoRef = useRef();

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
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

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
    loadModels().then(startVideo);
  }, []);

  return (
    <div className='VideoElement'>
      <video
        ref={videoRef}
        autoPlay
        muted
        className='user-video-feed'
      />
      <button onClick={detectMood}>Detect Mood</button>
    </div>
  );
}