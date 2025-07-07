import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialStateNote = {
  event_date: getTodayDate(),
  event_name: "",
  place: "",
  note: "",
  pet_id: "",
};

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

export const EditNote = () => {
  const [note, setNote] = useState(initialStateNote);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    async function fetchNote() {
      const url = import.meta.env.VITE_BACKEND_URL;

      try {
        const response = await fetch(`${url}/note/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setNote({
            ...data,
            event_date: convertDateToDDMMYYYY(data.event_date),
          });
        } else {
          setMessage({ type: "danger", text: "Error al cargar la nota" });
        }
      } catch {
        setMessage({ type: "danger", text: "Error al cargar la nota" });
      }
    }

    fetchNote();
  }, [navigate, id]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function handleChange({ target }) {
    const { name, value, type } = target;
    setNote((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  }

  const convertDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const convertDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${url}/note/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...note,
          event_date: convertDateToISO(note.event_date),
        }),
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: "Nota actualizada exitosamente" });
        setTimeout(() => {
          if (note.pet_id) {
            navigate(`/pet-detail/${note.pet_id}`);
          } else {
            navigate("/home");
          }
        }, 1500);
      } else {
        setMessage({ type: "danger", text: "Error al actualizar la nota" });
      }
    } catch {
      setMessage({ type: "danger", text: "Error al actualizar la nota" });
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100">
        <h3 className="text-center mb-4">Actualizar nota</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="event_nameInput"
              name="event_name"
              placeholder="Nombre del evento"
              onChange={handleChange}
              value={note.event_name}
            />
            <label htmlFor="event_nameInput">Nombre del evento</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="placeInput"
              name="place"
              placeholder="Lugar"
              onChange={handleChange}
              value={note.place}
            />
            <label htmlFor="placeInput">Lugar del evento</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="event_dateInput"
              name="event_date"
              placeholder="dd/mm/aaaa"
              onChange={handleChange}
              value={note.event_date}
            />
            <label htmlFor="event_dateInput">Fecha</label>
          </div>

          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="noteInput"
              name="note"
              placeholder="Notas"
              onChange={handleChange}
              value={note.note}
            />
            <label htmlFor="noteInput">Notas</label>
          </div>
          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            Actualizar
          </button>
        </form>

        <div className="d-flex justify-content-center my-3 justify-content-evenly">
          <button
            onClick={() => navigate(`/pet-detail/${note.pet_id}`)}
            className="btn btn-link text-dark text-decoration-none"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};
