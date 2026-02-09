"use client";
import { useEffect, useState } from "react";
import "@/styles/registro.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageCaptcha from "@/components/ImageCaptcha";
export default function LoginForm() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [imageCaptchaValid, setImageCaptchaValid] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
    captcha: "",
  });

  useEffect(() => {
    setMounted(true);
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    let e: any = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Correo inválido";

    if (form.password.length < 8)
      e.password = "La contraseña debe tener al menos 8 caracteres";

    if (parseInt(form.captcha) !== num1 + num2)
      e.captcha = "Captcha incorrecto";

    if (!imageCaptchaValid)
      e.imageCaptcha = "Completa el CAPTCHA de imagen correctamente";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validar()) return;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, captchaResultado: num1 + num2 }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Inicio de sesión exitoso");
      router.push("/inicio");
    } else {
      alert(data.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="form-box">
          <h2>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                name="email"
                type="email"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>Correo</label>
              <span className="error">{errors.email}</span>
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>Contraseña</label>
              <span className="error">{errors.password}</span>
            </div>

            <div className="input-group">
              <input
                name="captcha"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>¿Cuánto es {num1} + {num2}?</label>
              <span className="error">{errors.captcha}</span>
            </div>

            <ImageCaptcha onChange={setImageCaptchaValid} />
            {errors.imageCaptcha && (
              <span className="error" style={{ display: "block", marginTop: "-15px", marginBottom: "15px" }}>
                {errors.imageCaptcha}
              </span>
            )}

            <button type="submit">Iniciar Sesión</button>

            <p className="login-text">
              ¿No tienes cuenta? <Link href="/registro">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}