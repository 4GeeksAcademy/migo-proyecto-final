import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/img/logo-migo-claro.png';

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
                navigate("/home");
            } else {
                alert(data.msg || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error en el servidor");
        }
    };

    return (
        <div className="login-body">

            <div className="py-5 text-center">
                <img src={logo} alt="Migo logo" className="my-logo" />
            </div>

            <div className="d-flex justify-content-center">
                <div className="p-4 bg-yellow rounded shadow aut-form" >
                    <h3 className="text-center mb-4">Iniciar sesión</h3>

                    <form onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Correo</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="pass"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="pass">Contraseña</label>
                        </div>

                        <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
                            Ingresar
                        </button>
                    </form>

                    <div className="d-flex justify-content-between mt-3 small">
                        <Link to="/register" className="text-dark text-decoration-none">No tengo cuenta</Link>
                        <Link to="/recovery-password" className="text-dark text-decoration-none">¿Olvidaste tu contraseña?</Link>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Login;
