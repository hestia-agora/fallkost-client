import React from "react";
import { useOutletContext } from "react-router-dom";
import Results from "../components/Results"; 

function MainDashboard() {
    const { results } = useOutletContext();

    return (
        <div>
            {results ? (
                <Results result={results} />
            ) : (
                <p>Ingen data än.</p>
            )}
        </div>
    );
}

export default MainDashboard;