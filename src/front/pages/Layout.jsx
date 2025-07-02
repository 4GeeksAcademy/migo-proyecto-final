import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const token = localStorage.getItem("token");

    return (
        <ScrollToTop>
            {token && <Navbar />}
            <div style={{ paddingTop: token ? "60px" : "0" }}>
                <Outlet />
            </div>
            {/* <Footer /> */}
        </ScrollToTop>
    );
};
