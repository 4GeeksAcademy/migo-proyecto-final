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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

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
        console.log("Imagen subida:", imageUrl);
      } catch (err) {
        alert("Error al subir imagen");
        console.error(err);
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
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (response.status === 400) {
        alert("La mascota ya existe");
      } else {
        alert("Error al registrar la mascota");
      }
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      alert("Ha ocurrido un error");
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2 className="text-center my-3">Añadir una mascota</h2>
        <div className="col-12 col-md-6">
          <form className="border rounded m-2 p-4" onSubmit={handleSubmit}>
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

            <button className="btn btn-outline-primary w-100">Añadir</button>
          </form>

          <div className="d-flex justify-content-center my-3 justify-content-evenly">
            <Link to="/home">Regresar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
