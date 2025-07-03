import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

export const PasswordUpdate = () => {
    const [newPassword, setNewPassword] = useState("")
    const [searchParams, _] = useSearchParams()
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
    event.preventDefault()

    const passwordToSend = String(newPassword);

    if (!passwordToSend) {
        alert("Necesita una contraseña");
        return;
    }

    const url = import.meta.env.VITE_BACKEND_URL
       
    const response = await fetch(`${url}/update-password`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${searchParams.get("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: passwordToSend }),
    })
    
    if (response.ok) {
        alert("Contraseña actualizada");
        navigate("/");
    } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error || "Ocurio un error"}`);
    }
}

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Actualizar Contraseña</h2>
                <div className="col-12 col-md-6" >
                    <form
                        className="border m-2 p-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group mb-3">
                            <label htmlFor="btnPassword">Nueva contraseña </label>
                            <input
                                type="password"
                                className="form-control"
                                id="btnPassword"
                                name="newPassword"
                                onChange={(event) => setNewPassword(event.target.value)}
                                value={newPassword}
                            />
                        </div>

                        <button
                            className="btn btn-outline-primary w-100"
                        >Actualizar contraseña</button>
                    </form>
                </div>

                <div className="w-100"></div>


            </div>
        </div>
    )
    }