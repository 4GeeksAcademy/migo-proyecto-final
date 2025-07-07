import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteMedicalRecord } from "../services/api";

export function SingleRecord({ record, onDeleteSuccess, onDeleteError }) {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteMedicalRecord(record.id);
            onDeleteSuccess();
        } catch (error) {
            onDeleteError();
        }
    };

    return (
        <li className="list-group-item border-0 bg-yellow">
            <div className="card border-0 shadow-sm">
                <div className="card-body rounded-3 green-light text-dark">
                    <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title mb-0 fw-bold">{record.event_name}</h5>
                        <div className="d-flex">
                            <Link to={`/edit-note/${record.id}`} className="btn btn-sm">
                                <i className="fas fa-pen" role="button" title="Editar"></i>
                            </Link>
                            <button className="btn btn-sm" onClick={() => setShowModal(true)}>
                                <i className="fa-solid fa-trash me-1"></i>
                            </button>
                        </div>
                    </div>

                    <p className="card-text mb-1"><strong>Lugar</strong> {record.place}</p>
                    <p className="card-text mb-1"><strong>Fecha</strong> {new Date(record.event_date).toLocaleDateString()}</p>
                    <p className="card-text mb-1"><strong>Nota</strong> {record.note}</p>
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
                                    <p>¿Deseas eliminar este registro?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        setShowModal(false);
                                        handleDelete();
                                    }}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}
