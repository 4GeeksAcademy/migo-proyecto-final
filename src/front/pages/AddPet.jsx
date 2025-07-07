import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialStatePet = {
  name: "",
  species: "",
  breed: "",
  age: "",
  wheight: "",
};

export const AddPet = () => {
  const [pet, setPet] = useState(initialStatePet);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function handleChange({ target }) {
    const { name, value, type } = target;

    setPet((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    let imageUrl = "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "ml_default");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dhhbxwsi2/image/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        imageUrl = data.secure_url;
      } catch {
        setMessage({ type: "danger", text: "Error al subir imagen" });
        return;
      }
    }

    try {
      const response = await fetch(`${url}/pet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pet,
          age: parseInt(pet.age),
          wheight: parseFloat(pet.wheight),
          image: imageUrl
        }),
      });

      if (response.status === 201) {
        setPet(initialStatePet);
        setImageFile(null);
        setMessage({ type: "success", text: "Mascota registrada correctamente" });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else if (response.status === 400) {
        setMessage({ type: "danger", text: "La mascota ya existe" });
      } else {
        setMessage({ type: "danger", text: "Error al registrar la mascota" });
      }
    } catch {
      setMessage({ type: "danger", text: "Ha ocurrido un error al registrar la mascota" });
    }
  }


  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100">
        <h2 className="text-center mb-4">Añadir una mascota</h2>

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
              onChange={handleChange}
              required
              value={pet.name}
            />
            <label htmlFor="nameInput">Nombre</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="speciesInput"
              name="species"
              placeholder="Especie"
              onChange={handleChange}
              value={pet.species}
            />
            <label htmlFor="speciesInput">Especie</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="breedInput"
              name="breed"
              placeholder="Raza"
              onChange={handleChange}
              value={pet.breed}
            />
            <label htmlFor="breedInput">Raza</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="ageInput"
              name="age"
              placeholder="Edad"
              onChange={handleChange}
              value={pet.age}
            />
            <label htmlFor="ageInput">Edad</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              step="0.1"
              className="form-control"
              id="wheightInput"
              name="wheight"
              placeholder="Peso"
              onChange={handleChange}
              value={pet.wheight}
            />
            <label htmlFor="wheightInput">Peso</label>
          </div>

          <div className="mb-3">
            <label className="form-label">Foto de la mascota (opcional)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            Añadir
          </button>
        </form>

        <div className="d-flex justify-content-center mt-3 small">
          <Link to="/home" className="text-dark text-decoration-none">
            Regresar
          </Link>
        </div>
      </div>
    </div>
  );

};
