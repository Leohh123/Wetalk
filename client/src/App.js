import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Box from "@mui/material/Box";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
    const navigate = useNavigate();

    const initUid = cookies.get("uid");
    const [uid, setUid] = React.useState(initUid ? initUid : null);

    function handleLogin(newUid) {
        setUid(newUid);
        cookies.set("uid", newUid);
    }

    function handleLogout() {
        setUid(null);
        cookies.remove("uid");
    }

    return (
        <Box sx={{ height: 1 }}>
            <NavBar
                navigate={navigate}
                uid={uid}
                onLogout={handleLogout}
            ></NavBar>
            <Box sx={{ height: "calc(100% - 70px)", width: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/login"
                        element={
                            <Login navigate={navigate} onLogin={handleLogin} />
                        }
                    ></Route>
                    <Route path="/dashboard" element={<Dashboard />}></Route>
                </Routes>
            </Box>
        </Box>
    );
}

export default App;
