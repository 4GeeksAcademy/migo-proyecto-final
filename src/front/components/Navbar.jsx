import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm px-4">
            <div className="container-fluid">

                <Link to="/home" className="navbar-brand fw-bold fs-4 text-secondary">
                    Migo
                </Link>

                <div className="ms-auto d-flex align-items-center gap-4">
                    <Link to="/home" className="text-secondary text-decoration-none">
                        <i className="fa fa-home fs-5"></i>
                    </Link>
                    {/* <Link to="/profile" className="text-secondary text-decoration-none"> */}
                    <i className="fas fa-user fs-5 text-secondary"></i>
                    {/* </Link> */}
                    <Link to="/consejos" className="text-secondary text-decoration-none">
                    <i className="fas fa-comments fs-5 text-secondary"></i>
                    </Link>
                    <button className="text-secondary text-decoration-none border-0" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt fs-5"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};
