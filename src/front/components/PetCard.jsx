import { Link } from "react-router-dom";

export function PetCard({ pet }) {
    const defaultImage = "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg";

    return (
        <div className="card my-card h-100 shadow">
            <Link to={`/pet-detail/${pet.id}`} className="text-decoration-none text-dark">
                <div className="position-relative" style={{ width: "100%", paddingTop: "100%", overflow: "hidden" }}>
                    <img
                        src={pet.image || defaultImage}
                        alt={pet.name || "Mascota"}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center"
                        }}
                    />
                </div>
                <div className="card-body text-center">
                    <h3 className="card-title">{pet.name}</h3>
                </div>
            </Link>
        </div>
    );
}
