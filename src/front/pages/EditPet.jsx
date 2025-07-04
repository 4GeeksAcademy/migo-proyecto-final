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
                    alert("No se pudo cargar la mascota");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error al cargar la mascota");
            }
        };

        fetchPet();
    }, [id]);

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
            } catch (err) {
                alert("Error al subir imagen");
                console.error(err);
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
                console.error("Error completo:", responseBody);
                alert("Error: No se pudo actualizar la mascota\n" + responseBody);
                return;
            }

            alert("Mascota actualizada correctamente");
            navigate(`/pet-detail/${id}`);
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red al actualizar la mascota");
        }
    };

    const handleDeleteImage = () => {
        setCurrentImage("");
        setImageFile(null);
    };

    return (
        <div className="container mt-5">
            <h2>Editar Mascota</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nombre</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Especie</label>
                    <input type="text" className="form-control" value={species} onChange={e => setSpecies(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Raza</label>
                    <input type="text" className="form-control" value={breed} onChange={e => setBreed(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Edad</label>
                    <input type="number" className="form-control" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" className="form-control" value={wheight} onChange={e => setWheight(e.target.value)} />
                </div>

                {currentImage && (
                    <div className="mb-3">
                        <label>Foto actual</label>
                        <div>
                            <img src={currentImage} alt="Foto actual" className="img-fluid rounded" style={{ maxWidth: "150px" }} />
                        </div>
                        <button type="button" className="btn btn-outline-danger mt-2" onClick={handleDeleteImage}>
                            Eliminar foto actual
                        </button>
                    </div>
                )}

                <div className="mb-3">
                    <label>Cambiar foto actual (opcional)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>

                <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
            </form>
        </div>
    );
}
