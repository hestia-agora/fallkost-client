import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/app-layout/app-layout"; 
import MainDashboard from "./pages/main-dashboard"; 
import Form from "./components/Form"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Form />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;