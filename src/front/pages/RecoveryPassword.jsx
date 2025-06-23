import { useState } from "react"

export const RecoveryPassword = () => {

    const [email, setEmail] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email || !email.includes('@')) {
            alert("Por favor ingrese un correo válido")
            return
        }

        const url = import.meta.env.VITE_BACKEND_URL;


        try {
            const response = await fetch(`${url}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(email),  
                mode: 'cors'
            });
        

            if (response.ok) {
                alert("Un link de restauración de la contraseña fue mandado correctamente a su correo.")
            } else {
                alert("Hubo un error al intentar enviar el correo de restauración.")
            }
        } catch (error) {
            console.error("Error al hacer la solicitud:", error)
            alert("Error en la solicitud. Por favor, intente nuevamente.")
        }
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Recuperar contraseña</h2>
                <div className="col-12 col-md-6" >
                    <form
                        className="border m-2 p-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group mb-3">
                            <label htmlFor="btnEmail">Correo electrónico: </label>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="form-control"
                                id="btnEmail"
                                name="email"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                            />
                        </div>

                        <button
                            className="btn btn-outline-primary w-100"
                        >Enviar link de recuperación</button>
                    </form>
                </div>
            </div>
        </div>
    )
}