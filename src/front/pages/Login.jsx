
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                navigate("/dashboard");
            } else {
                alert(data.msg || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error en el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
