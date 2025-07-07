import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    country: "",
    city: ""
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) throw new Error("Respuesta no válida: " + res.status);
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Respuesta inesperada:", text);
          throw new Error("Respuesta no es JSON");
        }
        return res.json();
      })
      .then(data => {
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          email: data.email || "",
          country: data.country || "",
          city: data.city || ""
        });
      })
      .catch(err => {
        console.error("Error al cargar datos:", err);
        setMessage({ text: "Error al cargar datos de usuario", type: "danger" });
      });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = ({ target }) => {
    setFormData(prev => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Error al actualizar los datos");
      setMessage({ text: "Datos actualizados correctamente", type: "success" });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error al actualizar", type: "danger" });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Editar mis datos</h3>

        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="nameInput">Nombre</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="lastnameInput"
              name="lastname"
              placeholder="Apellido"
              value={formData.lastname}
              onChange={handleChange}
            />
            <label htmlFor="lastnameInput">Apellido</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="email"
              placeholder="Correo"
              value={formData.email}
              disabled
            />
            <label htmlFor="emailInput">Correo electrónico</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="countryInput"
              name="country"
              placeholder="País"
              value={formData.country}
              onChange={handleChange}
            />
            <label htmlFor="countryInput">País</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control"
              id="cityInput"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
            />
            <label htmlFor="cityInput">Ciudad</label>
          </div>

          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            Actualizar
          </button>
        </form>

        <div className="d-flex justify-content-center my-3 justify-content-evenly">
          <button onClick={() => navigate("/profile")} className="btn btn-link text-dark text-decoration-none">
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
