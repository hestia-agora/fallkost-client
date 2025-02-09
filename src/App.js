import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/app-layout/app-layout"; 
import MainDashboard from "./pages/main-dashboard"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<MainDashboard />} />  
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
