import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getPetById, deletePetById } from "../services/api";
import { useState, useEffect } from "react";
import { PetMedicalRecord } from "../components/PetMedicalRecord";
import { Link } from "react-router-dom";

export function PetDetail() {
    const { store } = useGlobalReducer();
    const { theId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getPet() {
            const foundPet = store.pets.find(item => item.id === parseInt(theId));
            if (foundPet) {
                setPet(foundPet);
            } else {
                const petFromApi = await getPetById(theId);
                if (petFromApi) {
                    setPet(petFromApi);
                }
            }
        }
        getPet();
    }, [theId, store.pets]);

    const handleDelete = async () => {
        try {
            await deletePetById(theId);
            alert("Mascota eliminada con éxito");
            navigate("/home");
        } catch (error) {
            alert(`Error al eliminar la mascota: ${error.message}`);
        }
    };

    if (!pet) return <p>Mascota no encontrada</p>;

    const defaultImage = "https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg";

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
                        src={pet.image || defaultImage}
                        alt={pet.name}
                        className="img-fluid rounded"
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
