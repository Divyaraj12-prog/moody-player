import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import "./FacialExpression.css";
import axiosInstance from "../axios.jsx";

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
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood() {
        const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        
        if (!detections || detections.length === 0) {
            console.log("No face detected");
            return;
        }

        let mostProableExpression = 0;
        let _expression = '';

        for (const expression of Object.keys(detections[0].expressions)) {
            if (detections[0].expressions[expression] > mostProableExpression) {
                mostProableExpression = detections[0].expressions[expression];
                _expression = expression;
            }
        }

        try {
            const response = await axiosInstance.get(`/songs?mood=${_expression}`);
            console.log(response.data);
            setSongs(response.data?.songs || []);
        } catch (error) {
            console.error("Failed to fetch songs:", error);
        }
    }

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
