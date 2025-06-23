
import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("No autorizado");
            return res.json();
        })
        .then(data => setMessage(data.message))
        .catch(err => {
            console.error(err);
            setMessage("No autorizado. Inicia sesión nuevamente.");
        });
    }, []);

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <p>{message}</p>
        </div>
    );
};

export default Dashboard;
