import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaHeart,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";

export const Profile = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm p-4 profile-card">
        <h2 className="text-center mb-4">Mi Perfil</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/profile-form")}>
            <FaUserEdit className="icon" />
            Mis datos
          </li>
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/siempre-conmigo")}>
            <FaHeart className="icon" />
            Siempre conMigo
          </li>
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => handleNavigate("/faqs")}>
            <FaQuestionCircle className="icon" />
            FAQs
          </li>
          <li className="list-group-item d-flex align-items-center option-item" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className="icon" />
            Cerrar sesión
          </li>
          <li
            className="list-group-item d-flex align-items-center option-item"
            onClick={() => handleNavigate("/eliminar-cuenta")}
            style={{ color: "#e57373" }}
          >
            <FaTrash className="me-2" style={{ color: "#e57373" }} />
            Eliminar cuenta
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Estás segura/o?</h5>
                <button type="button" className="close btn" onClick={() => setShowLogoutModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Deseas cerrar sesión?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
