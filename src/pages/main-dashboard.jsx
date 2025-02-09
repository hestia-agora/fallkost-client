import React from "react";
import { useOutletContext } from "react-router-dom";
import Results from "../components/Results";


function MainDashboard() {
    const { results } = useOutletContext(); 

    return (
        <div>
            <Results results={results} />
        </div>
    );
}

export default MainDashboard;