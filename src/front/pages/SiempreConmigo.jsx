import React from "react";
import { useNavigate } from "react-router-dom";

export const SiempreConmigo = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
      <div className="green-light rounded shadow p-4 back-login text-center w-100" style={{ maxWidth: "500px" }}>
        <h2 className="mb-3">Siempre conmigo</h2>
        <p className="lead mb-4">Esta sección está en construcción 🚧</p>
        <p className="text-muted">Muy pronto podrás ver aquí un lugar especial para recordar a tus mascotas.</p>
        <button className="btn btn-outline-secondary mt-4" onClick={() => navigate("/profile")}>
          Regresar
        </button>
      </div>
    </div>
  );
};
