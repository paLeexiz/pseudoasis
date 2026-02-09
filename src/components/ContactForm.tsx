"use client";
import React, { useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import '../styles/contact.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    name: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    subject: '',
    name: '',
    message: ''
  });

  const validate = () => {
    const newErrors = { email: '', subject: '', name: '', message: '' };
    let isValid = true;

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo válido';
      isValid = false;
    }
    if (!formData.subject) {
      newErrors.subject = 'El asunto es requerido';
      isValid = false;
    }
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }
    if (!formData.message) {
      newErrors.message = 'El mensaje es requerido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ email: '', subject: '', name: '', message: '' });
        alert('¡Mensaje enviado correctamente!');
      } else {
        alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <section>
      <Breadcrumbs />
    <section className="contact-section">
      <div className="contact-overlay" />
      <div className="contact-card-wrapper">
        <div className="contact-card">
          <div className="contact-card-inner">
            <h2 className="contact-title">Buzón</h2>

            <p className="contact-subtitle">
              ¿Tienes alguna pregunta o quieres saber más? Déjanos un mensaje.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Tu correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="nombre@ejemplo.com"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="¿En qué podemos ayudarte?"
                />
                {errors.subject && <p className="form-error">{errors.subject}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tu nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tu nombre completo"
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Tu mensaje
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Deja tu comentario..."
                />
                {errors.message && <p className="form-error">{errors.message}</p>}
              </div>

              <button type="submit" className="form-submit-btn">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    </section>
  );
};

export default ContactForm;