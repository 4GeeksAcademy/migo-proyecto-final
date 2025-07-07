import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditPet() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [wheight, setWheight] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [message, setMessage] = useState(null);

    const DEFAULT_IMAGE = "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPet = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pet/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setPet(data);
                    setName(data.name || "");
                    setSpecies(data.species || "");
                    setBreed(data.breed || "");
                    setAge(data.age || "");
                    setWheight(data.wheight || "");
                    setCurrentImage(data.image || "");
                } else {
                    setMessage({ type: "danger", text: "No se pudo cargar la mascota" });
                }
            } catch {
                setMessage({ type: "danger", text: "Ocurrió un error al cargar la mascota" });
            }
        };

        fetchPet();
    }, [id]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        let imageUrl = currentImage;

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

        if (!imageUrl || imageUrl.trim() === "") {
            imageUrl = DEFAULT_IMAGE;
        }

        const updatedPet = {
            name,
            species,
            breed,
            age: parseInt(age),
            wheight: parseFloat(wheight),
            image: imageUrl
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pet/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedPet),
            });

            if (!response.ok) {
                const responseBody = await response.text();
                setMessage({ type: "danger", text: "No se pudo actualizar la mascota" });
                return;
            }

            setMessage({ type: "success", text: "Mascota actualizada correctamente" });
            setTimeout(() => navigate(`/pet-detail/${id}`), 1500);
        } catch {
            setMessage({ type: "danger", text: "Error de red al actualizar la mascota" });
        }
    };

    const handleDeleteImage = () => {
        setCurrentImage("");
        setImageFile(null);
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="green-light rounded shadow p-4 back-login w-100">
                <h2 className="text-center mb-4">Editar Mascota</h2>

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
                            id="nameEdit"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="nameEdit">Nombre</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="speciesEdit"
                            placeholder="Especie"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                        />
                        <label htmlFor="speciesEdit">Especie</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="breedEdit"
                            placeholder="Raza"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                        <label htmlFor="breedEdit">Raza</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            id="ageEdit"
                            placeholder="Edad"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <label htmlFor="ageEdit">Edad</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            id="wheightEdit"
                            placeholder="Peso"
                            value={wheight}
                            onChange={(e) => setWheight(e.target.value)}
                        />
                        <label htmlFor="wheightEdit">Peso (kg)</label>
                    </div>

                    {currentImage && (
                        <div className="mb-3 text-center">
                            <label className="form-label">Foto actual</label>
                            <div>
                                <img
                                    src={currentImage}
                                    alt="Foto actual"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "150px" }}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-danger mt-2"
                                onClick={handleDeleteImage}
                            >
                                Eliminar foto actual
                            </button>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Cambiar foto actual (opcional)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}