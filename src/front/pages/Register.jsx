import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const initialStateUser = {
    name: "",
    lastname: "",
    email: "",
    password: ""
}

export function Register() {
    const [user, setUser] = useState(initialStateUser)
    const navigate = useNavigate()

    function handleChange({target}){
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    async function handleSubmit(event){
        event.preventDefault()

        const url = import.meta.env.VITE_BACKEND_URL;
        
        const response = await fetch(`${url}/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (response.status === 201){
            setUser(initialStateUser)
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } else if (response.status === 400){
            alert('El usuario ya existe')
        } else {
            alert('Error al registrar el usuario')
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Registrate</h2>
                <div className="col-12 col-md-6">
                    <form className="border rounded m-2 p-4" onSubmit={handleSubmit} >
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nameInput"
                                name="name"
                                placeholder="nombre"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="nameInput">Nombre</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="lastnameInput"
                                name="lastname"
                                placeholder="apellido"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="lastnameInput">Apellido</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                name="email"
                                placeholder="email"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="emailInput">Email</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                name="password"
                                placeholder="contraseña"
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="passwordInput">Contraseña</label>
                        </div>
                        <button className="btn btn-outline-primary w-100">Registrarme</button>
                    </form>
                    <div className="d-flex justify-content-center my-3 justify-content-evenly">
                        <Link to="/login">Ya tengo una cuenta</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
