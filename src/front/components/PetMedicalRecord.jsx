import { Link } from "react-router-dom"
import { SingleRecord } from "../components/SingleRecord";
import { useEffect, useState } from "react";
import { getMedicalRecords } from "../services/api";

export function PetMedicalRecord({ petId }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecords() {
            const data = await getMedicalRecords(petId);
            setRecords(data);
            setLoading(false);
        }

        fetchRecords();
    }, [petId]);

    return (
        <div className="container border border-success-subtle p-3 rounded">
            <div className="row d-flex justify-content-between pb-3">
                <div className="col-4">
                    <h3 className="text-success">Historial medico</h3>
                </div>
                <div className="col-1">
                    <Link to={'/add-note'} className="btn btn-success rounded-circle"><i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>
            {loading ? (
                <p>Cargando registros médicos...</p>
            ) : records.length === 0 ? (
                <p>No hay registros clínicos aún.</p>
            ) : (
                <ul className="list-group">
                    {records.map(record => (
                        <SingleRecord key={record.id} record={record} />
                    ))}
                </ul>
            )}
        </div>
    )
}