import React from "react";
import Styles from "./sidebar.module.css";
import Form from "../../components/Form";

function Sidebar({ setResults }) {
    return (
        <div className={Styles.sidebar}>
              <h1>Sidebar</h1>
            <Form setResults={setResults}/>
      </div>
    );
}

export default Sidebar;
