import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import Styles from "./app-layout.module.css";

function AppLayout() {
    const [results, setResults] = useState(null); 

    return (
        <div className={Styles.application}>
            <Sidebar setResults={setResults} /> 
            <div className={Styles.content}>
                <Header />
                <div className={Styles.main}>
                    <Outlet context={{ results }} />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
