import React from "react";
import { Accordion } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Faqs = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "¿Qué es Migo?",
      answer: "Migo es una app para acompañarte en el cuidado de la salud de tus mascotas. Puedes registrar vacunas, notas clínicas, ver historial, y más."
    },
    {
      question: "¿Cómo registro a mi mascota?",
      answer: "Desde la sección “Añadir mascota” puedes ingresar todos los datos y una imagen. Es rápido y sencillo."
    },
    {
      question: "¿Puedo editar los datos después?",
      answer: "Sí, puedes editar la información de tus mascotas y tus propios datos desde el perfil de usuario."
    },
    {
      question: "¿Puedo eliminar una mascota o nota clínica?",
      answer: "Sí. Cada ficha de mascota o nota incluye la opción para editar o eliminar la información que ya no necesites."
    },
    {
      question: "¿Qué es “Siempre conmigo”?",
      answer: "Es un espacio especial para recordar a las mascotas que ya no están. Pronto estará disponible."
    }
  ];

  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
      <div className="green-light rounded shadow p-4 back-login w-100" style={{ maxWidth: "700px" }}>
        <h2 className="text-center mb-4">Preguntas Frecuentes</h2>

        <Accordion flush>
          {faqs.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <span style={{ color: "#444", fontWeight: "600" }}>{item.question}</span>
              </Accordion.Header>
              <Accordion.Body style={{ color: "#666" }}>
                {item.answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <div className="text-center mt-4">
          <button className="btn btn-outline-secondary" onClick={() => navigate("/profile")}>
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};
