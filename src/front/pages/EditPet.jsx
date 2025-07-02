import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditPet() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);

    // Estados separados por campo
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [wheight, setWheight] = useState("");

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const token = localStorage.getItem("token");
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

        const updatedPet = {
            name,
            species,
            breed,
            age: parseInt(age),
            wheight: parseFloat(wheight),
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pet/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updatedPet),
            });

            const responseBody = await response.text();  // Para mostrar aunque no sea JSON

            if (!response.ok) {
                console.error("Error completo:", responseBody);
                alert("Error: No se pudo actualizar la mascota\n" + responseBody);
                return;
            }

            alert("Mascota actualizada correctamente");
            navigate("/home");
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red al actualizar la mascota");
        }
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
                <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
            </form>
        </div>
    );
}
