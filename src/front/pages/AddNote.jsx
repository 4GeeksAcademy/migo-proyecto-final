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

export const AddNote = () => {
  const [note, setNote] = useState(initialStateNote);
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { petId } = useParams();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    async function fetchPets() {
      const url = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${url}/pets`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        }
      } catch {
        setMessage({ type: "danger", text: "Error al cargar mascotas" });
      }
    }

    fetchPets();
  }, [navigate]);

  useEffect(() => {
    if (pets.length === 1) {
      setNote((prev) => ({
        ...prev,
        pet_id: pets[0].id,
      }));
    }
  }, [pets]);

  useEffect(() => {
    if (petId) {
      setNote((prev) => ({
        ...prev,
        pet_id: petId
      }));
    }
  }, [petId]);

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

  const isValidDateFormat = (dateStr) => {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
    return regex.test(dateStr);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    if (!isValidDateFormat(note.event_date)) {
      setMessage({ type: "danger", text: "El formato de la fecha debe ser dd/mm/aaaa" });
      return;
    }

    try {
      const response = await fetch(`${url}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...note,
          event_date: convertDateToISO(note.event_date),
          pet_id: note.pet_id
        }),
      });

      if (response.status === 201) {
        setMessage({ type: "success", text: "Nota añadida correctamente" });
        setTimeout(() => {
          navigate(`/pet-detail/${note.pet_id}`);
        }, 1500);
      } else {
        setMessage({ type: "danger", text: "Error al registrar la nota" });
      }
    } catch {
      setMessage({ type: "danger", text: "Ocurrió un error al registrar la nota" });
    }
  }

  function handleResize(event) {
    const textarea = event.target;
    textarea.style.height = "auto";
  }

  const handleGoBack = () => {
    if (note.pet_id) {
      navigate(`/pet-detail/${note.pet_id}`);
    } else {
      navigate("/home");
    }
  };

  const petName = pets.find(p => p.id === Number(note.pet_id))?.name;

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100">
        <div className="col-12 col-ms-6">
          <form className="rounded m-2 p-4" onSubmit={handleSubmit}>
            <h3 className="text-center mb-1">Añadir una nota</h3>
            <h4 className="text-center text-secondary fw-semibold mb-4">para</h4>


            {message && (
              <div className={`alert alert-${message.type}`} role="alert">
                {message.text}
              </div>
            )}

            {pets.length > 1 && (
              <div className="form-floating mb-3">
                <select
                  id="petSelect"
                  name="pet_id"
                  className="form-control"
                  onChange={handleChange}
                  value={note.pet_id}
                  required
                >
                  <option value="">¿Para quién?</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="petSelect">Mascota</label>
              </div>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="event_nameInput"
                name="event_name"
                placeholder="Nombre del evento"
                onChange={handleChange}
                required
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
                onInput={handleResize}
                style={{ resize: "none" }}
              />
              <label htmlFor="noteInput">Notas</label>
            </div>

            <button className="btn btn-secondary w-100">Añadir</button>
          </form>

          <div className="d-flex justify-content-center mt-3 small">
            <button className="btn btn-link text-dark text-decoration-none" onClick={handleGoBack}>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
