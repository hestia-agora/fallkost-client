import React, { useState } from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, onAddRiskCategory, onAddIntervention }) => {
  const [activeTab, setActiveTab] = useState("riskCategory");
  const [newRiskCategory, setNewRiskCategory] = useState({ name: "", effect: "" });
  const [newIntervention, setNewIntervention] = useState({ name: "", effect: "" });
  const [successMessage, setSuccessMessage] = useState(""); 

  if (!isOpen) return null;

  const handleAddRiskCategory = () => {
    if (!newRiskCategory.name || !newRiskCategory.effect) return;
    onAddRiskCategory(newRiskCategory);
    setSuccessMessage("Riskkategori tillagd!");
    setNewRiskCategory({ name: "", effect: "" }); 

    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleAddIntervention = () => {
    if (!newIntervention.name || !newIntervention.effect) return;
    onAddIntervention(newIntervention);
    setSuccessMessage("Åtgärd tillagd!");
    setNewIntervention({ name: "", effect: "" }); 

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Lägg till Ny Data</h2>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>

        <ul className="nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === "riskCategory" ? "active" : ""}`} 
              onClick={() => setActiveTab("riskCategory")}
            >
              Lägg till Andel 
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === "intervention" ? "active" : ""}`} 
              onClick={() => setActiveTab("intervention")}
            >
              Lägg till Åtgärd
            </button>
          </li>
        </ul>

        <div className="modal-body">
          {successMessage && <p className="success-message">{successMessage}</p>}

          {activeTab === "riskCategory" ? (
            <div className="modal-section">
              <h3>Lägg till Ny Riskkategori</h3>
              <label className="form-label">Namn</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ange namn"
                value={newRiskCategory.name}
                onChange={(e) => setNewRiskCategory({ ...newRiskCategory, name: e.target.value })}
              />
              <label className="form-label">Effekt i %</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ange effekt"
                value={newRiskCategory.effect}
                onChange={(e) => setNewRiskCategory({ ...newRiskCategory, effect: e.target.value })}
              />
              <button className="btn btn-primary" onClick={handleAddRiskCategory}>
                Lägg till Riskkategori
              </button>
            </div>
          ) : (
            <div className="modal-section">
              <h3>Lägg till Ny Åtgärd</h3>
              <label className="form-label">Namn</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ange namn"
                value={newIntervention.name}
                onChange={(e) => setNewIntervention({ ...newIntervention, name: e.target.value })}
              />
              <label className="form-label">Effekt i %</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ange effekt"
                value={newIntervention.effect}
                onChange={(e) => setNewIntervention({ ...newIntervention, effect: e.target.value })}
              />
              <button className="btn btn-primary" onClick={handleAddIntervention}>
                Lägg till Åtgärd
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
