import { Link } from "react-router-dom";

export function PetCard({ pet }) {
    const defaultImage = "https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg";

    return (
        <div className="card my-card h-100 shadow">
            <Link to={`/pet-detail/${pet.id}`} className="text-decoration-none text-dark">
                <img
                src={pet.image || defaultImage}
                className="card-img-top pet-image"
                alt={pet.name || "Mascota"}
                />
                <div className="card-body text-center">
                    <h3 className="card-title">{pet.name}</h3>
                </div>
            </Link>
        </div>
    );
}
