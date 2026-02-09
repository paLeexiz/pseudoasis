"use client";
import { useEffect, useRef, useState } from "react";

interface ImageCaptchaProps {
  onChange: (isValid: boolean) => void;
}

export default function ImageCaptcha({ onChange }: ImageCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  // Generar texto aleatorio para el CAPTCHA
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  // Dibujar el CAPTCHA en el canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo con gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f0f0f0");
    gradient.addColorStop(1, "#e0e0e0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Líneas de ruido
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Puntos de ruido
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Dibujar texto
    ctx.font = "bold 36px Arial";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 20 + i * 35;
      const y = canvas.height / 2;

      // Rotación aleatoria
      const angle = (Math.random() - 0.5) * 0.4;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Color aleatorio para cada letra
      const r = Math.floor(Math.random() * 100);
      const g = Math.floor(Math.random() * 100);
      const b = Math.floor(Math.random() * 100);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      // Sombra
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  // Generar nuevo CAPTCHA
  const refreshCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    drawCaptcha(newText);
    setUserInput("");
    setError("");
    onChange(false);
  };

  // Verificar input del usuario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value.toLowerCase() === captchaText.toLowerCase()) {
      setError("");
      onChange(true);
    } else if (value.length >= captchaText.length) {
      setError("CAPTCHA incorrecto");
      onChange(false);
    } else {
      setError("");
      onChange(false);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={240}
          height={80}
          style={{
            border: "2px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            background: "white",
          }}
          onClick={refreshCaptcha}
        />
        <button
          type="button"
          onClick={refreshCaptcha}
          style={{
            padding: "10px 15px",
            background: "white",
            border: "2px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "20px",
          }}
          title="Refrescar CAPTCHA"
        >
          🔄
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder=" "
          required
          maxLength={6}
          style={{ textTransform: "none" }}
        />
        <label>Escribe el texto de la imagen</label>
        {error && <span className="error">{error}</span>}
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#ffffff",
          marginTop: "5px",
          opacity: 0.8,
        }}
      >
        Haz clic en la imagen para generar un nuevo código
      </p>
    </div>
  );
}