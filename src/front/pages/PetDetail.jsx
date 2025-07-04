import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getPetById, deletePetById } from "../services/api";
import { useState, useEffect } from "react";
import { PetMedicalRecord } from "../components/PetMedicalRecord";

export function PetDetail() {
    const { theId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchPet() {
            setIsLoading(true);
            const petFromApi = await getPetById(theId);
            if (petFromApi) {
                setPet(petFromApi);
            } else {
                setPet(null);
            }
            setIsLoading(false);
        }

        fetchPet();
    }, [theId]);

    const handleDelete = async () => {
        try {
            await deletePetById(theId);
            alert("Mascota eliminada con éxito");
            navigate("/home");
        } catch (error) {
            alert(`Error al eliminar la mascota: ${error.message}`);
        }
    };

    if (isLoading) return null;

    if (!pet) return <p>Mascota no encontrada</p>;

    return (
        <div className="container mt-4">
            <div className="row align-items-center mb-3">
                <div className="col-10">
                    <h2 className="mb-0 fs-1 ">{pet.name}</h2>
                </div>
                <div className="col-2 d-flex justify-content-end gap-2">
                    <Link to={`/edit-pet/${theId}`} className="btn btn-outline-dark btn-sm">
                        <i className="fa-solid fa-pen me-1"></i>
                    </Link>
                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa-solid fa-trash me-1"></i>
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <img
                        src={
                            pet.image?.trim()
                                ? pet.image
                                : "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg"
                        }
                        alt={pet.name}
                        className="img-fluid rounded shadow object-fit-cover"
                        style={{ width: "100%", aspectRatio: "1 / 1" }}
                    />
                </div>
                <div className="col-md-8">
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item fs-5"><strong>Especie</strong> {pet.species}</li>
                        <li className="list-group-item fs-5"><strong>Raza</strong> {pet.breed}</li>
                        <li className="list-group-item fs-5"><strong>Edad</strong> {pet.age}</li>
                        <li className="list-group-item fs-5"><strong>Peso</strong> {pet.wheight}</li>
                    </ul>
                    <PetMedicalRecord petId={theId} />
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">¿Estás segura/o?</h5>
                                <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>¿Deseas eliminar el perfil de {pet.name}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
