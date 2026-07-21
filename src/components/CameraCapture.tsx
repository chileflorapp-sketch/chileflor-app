'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setErrorMsg(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefers back camera on mobile
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setErrorMsg(
        'No se pudo acceder a la cámara. Por favor, asegúrate de haber dado los permisos necesarios al navegador.'
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]); 

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 JPEG
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      stopCamera();
      onCapture(base64Image);
    } else {
      setErrorMsg('Error al procesar la imagen.');
      setIsCapturing(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden w-full max-w-lg border border-gray-800 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#111111] flex justify-between items-center border-b border-gray-800">
          <h3 className="text-white font-bold flex items-center gap-2">
            <span>📷</span> Captura de Evidencia
          </h3>
          <button 
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            X
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative w-full aspect-square bg-black flex items-center justify-center">
          {errorMsg ? (
            <div className="text-red-400 p-6 text-center font-bold text-sm">
              <span className="text-3xl block mb-4">📸🚫</span>
              {errorMsg}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Optional: Add crosshairs or guides here */}
              <div className="absolute inset-0 border-2 border-primary/30 m-8 rounded-xl pointer-events-none"></div>
            </>
          )}
          
          {/* Hidden Canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="p-6 bg-[#111111] flex justify-center gap-4 border-t border-gray-800">
          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors flex-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleCapture}
            disabled={!!errorMsg || isCapturing || !stream}
            className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
          >
            {isCapturing ? 'Procesando...' : 'Tomar Foto'}
          </button>
        </div>
      </div>
    </div>
  );
}
