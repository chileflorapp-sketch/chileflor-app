'use client';
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { useRouter } from 'next/navigation';

export default function ScannerQR() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [detectedUrl, setDetectedUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    let isActive = true;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });

        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // Stop any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          animationFrameId = requestAnimationFrame(tick);
        }
      } catch (err) {
        if (isActive) {
          setError('No se pudo acceder a la cámara. Revisa los permisos.');
        }
      }
    };

    const tick = () => {
      if (!isActive) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          
          if (code && code.data) {
            const qrData = code.data;
            
            // Validate: Only navigate if it's a Chileflor tarjeta link
            const isValidTarjetaUrl = qrData.includes('/t/');
            
            if (isValidTarjetaUrl) {
              setScanning(false);
              setScanSuccess(true);
              
              // Extract the path: get everything from /t/ onwards
              let targetPath: string;
              try {
                const url = new URL(qrData);
                targetPath = url.pathname; // e.g., /t/abc1234
              } catch {
                // If it's not a full URL, use it as-is
                targetPath = qrData;
              }
              
              setDetectedUrl(targetPath);
              
              // Vibrate for haptic feedback
              if (navigator.vibrate) navigator.vibrate(200);

              // Stop camera
              if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
              }

              setTimeout(() => {
                router.push(targetPath);
              }, 2000);
              return;
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    startCamera();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [router]);

  const handleClose = () => {
    // Stop camera before navigating
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Visor de Cámara */}
        <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${scanSuccess ? 'blur-md scale-110 opacity-40' : 'opacity-80'}`} playsInline muted></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {/* UI Overlay superior */}
        <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-500 ${scanSuccess ? 'opacity-0' : 'opacity-100'}`}>
          <button onClick={handleClose} className="text-white bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md">
            ✕
          </button>
          <span className="text-white font-medium tracking-widest uppercase">Escanear</span>
          <div className="w-10"></div>
        </div>

        {/* Guía de Encuadre */}
        <div className={`relative z-10 w-64 h-64 transition-all duration-700 ${scanSuccess ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
           <div className="absolute inset-0 border-2 border-primary/50 rounded-3xl"></div>
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-3xl"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-3xl"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-3xl"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-3xl"></div>
           
           {/* Línea de escaneo láser animada */}
           {!scanSuccess && (
             <div className="absolute top-0 left-4 right-4 h-0.5 bg-primary/80 shadow-[0_0_10px_rgba(255,38,81,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
           )}
        </div>
        
        {/* Animación de Éxito */}
        {scanSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)] mb-6">
                <span className="text-white text-5xl">✓</span>
             </div>
             <h2 className="text-white text-2xl font-bold tracking-wide">¡Dedicatoria Encontrada!</h2>
             <p className="text-gray-300 mt-2">Preparando tu mensaje...</p>
          </div>
        )}

        <p className={`relative z-10 text-white mt-12 text-center font-medium px-8 drop-shadow-md transition-opacity duration-500 ${scanSuccess ? 'opacity-0' : 'opacity-100'}`}>
          Apunta la cámara hacia el código QR de la tarjeta para ver la dedicatoria.
        </p>

        {error && (
          <div className="relative z-10 bg-red-500/80 backdrop-blur-md text-white p-4 rounded-xl mt-8 mx-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
