import { Link } from "react-router-dom";

export function PetCard({ pet }) {
    const defaultImage = "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg";

    return (
        <div className="card my-card h-100 shadow overflow-hidden rounded-4" style={{ border: "none" }}>
            <Link to={`/pet-detail/${pet.id}`} className="text-decoration-none text-dark">
                <div className="img-container">
                    <img
                        src={pet.image || defaultImage}
                        alt={pet.name || "Mascota"}
                        className="card-image "
                    />
                </div>
                <div className="card-body text-center">
                    <h3 className="card-title dynapuff">{pet.name}</h3>
                </div>
            </Link>
        </div>
    );
}
