import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

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
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    async function fetchNote() {
      const url = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${url}/note/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNote({
            ...data,
            event_date: convertDateToDDMMYYYY(data.event_date), 
          });
        } else {
          alert("Error al cargar la nota");
        }
      } catch (error) {
        alert("Error al cargar la nota");
      }
    }

    fetchNote();
  }, [navigate, id]);

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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...note,
          event_date: convertDateToISO(note.event_date),
        }),
      });

      if (response.status === 200) {
        alert("Nota actualizada exitosamente");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        alert("Error al actualizar la nota");
      }
    } catch (error) {
      alert("Error al actualizar la nota");
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-ms-6">
          <form className="border rounded m-2 p-4" onSubmit={handleSubmit}>
            <h3 className="text-center mt-3">Actualizar nota</h3>

            <div className="mb-3">
              <label className="form-label">Mascota</label>
              <input
                type="text"
                className="form-control"
                value={note.pet_name || "Nombre no disponible"}
                readOnly
              />
              <input
                type="hidden"
                name="pet_id"
                value={note.pet_id}
              />
            </div>

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
                rows="10"
              />
              <label htmlFor="noteInput">Notas</label>
            </div>

            <button className="btn btn-outline-primary w-100">Actualizar</button>
          </form>
          <div className="d-flex justify-content-center my-3 justify-content-evenly">
            <Link to="/home">Regresar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
