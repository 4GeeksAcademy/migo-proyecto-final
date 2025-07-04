import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { PetCard } from "../components/PetCard";
import { getAllPets } from "../services/api";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const location = useLocation();

    async function fetchPets() {
        const data = await getAllPets();
        if (data) {
            dispatch({ type: 'SET_PETS', payload: data });
        }
    }

    useEffect(() => {
        fetchPets();
    }, [location.key]);

    return (
        <div className="container justify-content-center">
            <h1 className="text-center my-4">Mis Mascotas</h1>
            <div className="row g-4">
                {store.pets.length > 0 ? (
                    store.pets.map(pet => (
                        <div key={pet.id} className="col mb-4">
                            <PetCard pet={pet} />
                        </div>
                    ))
                ) : (
                    <p>No tienes mascotas registradas.</p>
                )}
            </div>
            <div className="d-flex justify-content-center my-3">
                <Link to={'/add-pet'} className="btn btn-dark rounded-circle">
                    <i className="fa-solid fa-plus fa-xl"></i>
                </Link>
            </div>
        </div>
    );
};
