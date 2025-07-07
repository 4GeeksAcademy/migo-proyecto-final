import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("No se pudo eliminar la cuenta");

      localStorage.removeItem("token");
      setMessage({ type: "success", text: "Cuenta eliminada con éxito" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage({ type: "danger", text: "Error al eliminar cuenta" });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
      <div className="green-light rounded shadow p-4 back-login w-100 text-center" style={{ maxWidth: "500px" }}>
        <h2 className="mb-3">Eliminar cuenta</h2>
        <p className="mb-4">¿Estás segura/o de que deseas eliminar tu cuenta?</p>
        <button className="btn btn-danger fw-bold" onClick={() => setShowModal(true)}>
          Sí, eliminar mi cuenta
        </button>

        <div className="mt-3">
          <button className="btn btn-outline-dark" onClick={() => navigate("/profile")}>
            Cancelar
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type} mt-4`} role="alert">
            {message.text}
          </div>
        )}

        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">¿Confirmas esta acción?</h5>
                  <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Eliminar tu cuenta eliminará todos tus datos y mascotas asociadas.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
