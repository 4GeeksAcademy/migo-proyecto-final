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
        <div className="container justify-content-center padding-top">
            <div className="my-4">
                {store.pets.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center gap-4">
                        {store.pets.map(pet => (
                            <div key={pet.id} className="pet-card-wrapper">
                                <PetCard pet={pet} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "30vh" }}>
                        <p className="text-center text-muted fs-5">No tienes mascotas registradas.</p>
                    </div>
                )}

                <div className="d-flex justify-content-center my-5">
                    <Link to={'/add-pet'} className="btn btn-secondary rounded-circle">
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};
