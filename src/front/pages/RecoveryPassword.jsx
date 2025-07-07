import { useState, useEffect } from "react";
import logo from '../assets/img/logo-migo-claro.png';
import { Link } from "react-router-dom";

export const RecoveryPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000); 
      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    if (!isValidEmail) {
      alert("Por favor ingrese un correo electrónico válido");
      return;
    }

    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true); 

      const response = await fetch(`${url}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Un link de restauración de la contraseña fue mandado correctamente a su correo." });
      } else {
        setMessage({ type: "danger", text: data.message || "Error en la solicitud. Por favor, intente nuevamente." });
      }

    } catch (error) {
      setMessage({ type: "danger", text: "Error en la solicitud. Por favor, intente nuevamente." });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-body">
      <div className="py-5 text-center">
        <img src={logo} alt="Migo logo" className="my-logo" />
      </div>

      <div className="d-flex justify-content-center">
        <div className="p-4 bg-yellow rounded shadow aut-form">
          <h3 className="text-center mb-4">Recuperar contraseña</h3>
          
          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="form-control"
                id="btnEmail"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                required
              />
              <label htmlFor="btnEmail">Correo electrónico</label>
            </div>

            <button
              className="btn w-100 text-white fw-bold bg-secondary"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de recuperación"}
            </button>
          </form>

          <div className="d-flex justify-content-center mt-3 small">
            <Link to="/" className="text-dark text-decoration-none">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
