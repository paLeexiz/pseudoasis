"use client";
import { useEffect, useState } from "react";
import "@/styles/registro.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageCaptcha from "@/components/ImageCaptcha";


export default function RegisterForm() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [imageCaptchaValid, setImageCaptchaValid] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    telefono: "",
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

    const nombreLimpio = form.nombre.trim();

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombreLimpio)) {
      e.nombre = "El nombre solo debe contener letras";
    } else if (nombreLimpio.replace(/\s/g, "").length < 3) {
      e.nombre = "El nombre debe tener al menos 3 letras";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Correo inválido";

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password))
      e.password =
        "Debe tener 8 caracteres, una mayúscula, un número y un símbolo";

    if (form.password !== form.confirmar)
      e.confirmar = "Las contraseñas no coinciden";

    if (!/^\d{10}$/.test(form.telefono))
      e.telefono = "Teléfono inválido (10 dígitos)";

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

    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, captchaResultado: num1 + num2 }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="form-box">
          <h2>Registro de Usuario</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                name="nombre"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>Nombre</label>
              <span className="error">{errors.nombre}</span>
            </div>

            <div className="input-group">
              <input
                name="email"
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
                type="password"
                name="confirmar"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>Confirmar contraseña</label>
              <span className="error">{errors.confirmar}</span>
            </div>

            <div className="input-group">
              <input
                name="telefono"
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label>Teléfono</label>
              <span className="error">{errors.telefono}</span>
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

            <button type="submit">Registrarse</button>

            <p className="login-text">
              ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}