import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getPetById } from "../services/api";
import { useState, useEffect } from "react";

export function PetDetail() {
    const { store } = useGlobalReducer();
    const { theId } = useParams();
    const [pet, setPet] = useState(null);

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

    if (!pet) return <p>Mascota no encontrada</p>;

    const defaultImage = "https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg";

    return (
        <div className="container mt-4">
            <div className="row align-items-center mb-3">
                <div className="col-10">
                    <h2 className="mb-0">{pet.name}</h2>
                </div>
                <div className="col-2 d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-dark btn-sm">
                        <i className="fa-solid fa-pen-to-square me-1"></i> Editar
                    </button>
                    <button className="btn btn-outline-dark btn-sm">
                        <i className="fa-solid fa-trash me-1"></i> Borrar
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
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item fs-5"><strong>Especie</strong> {pet.species}</li>
                        <li className="list-group-item fs-5"><strong>Raza</strong> {pet.breed}</li>
                        <li className="list-group-item fs-5"><strong>Edad</strong> {pet.age}</li>
                        <li className="list-group-item fs-5"><strong>Peso</strong> {pet.weight}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
