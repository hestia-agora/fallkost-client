import React, { useState } from "react";
import { Button} from 'react-bootstrap'; 
import "./form.css";
import logoImage from '../assets/logos/hestia-agora.png';
import Modal from "./Modal";
import { fetchResults } from "../utils/api"; 
import { riskCategories as initialRiskCategories, interventions as initialInterventions } from "../utils/data";

function Calculator({ setResults }) {
  const [formData, setFormData] = useState({
    totalPopulation: "",
    riskCategoryName: "",
    costPerFall: "",
    interventionName: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [riskCategories, setRiskCategories] = useState(initialRiskCategories);
  const [interventions, setInterventions] = useState(initialInterventions);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const addRiskCategory = (newCategory) => {
    if (!newCategory.name || !newCategory.effect) return;
    setRiskCategories([...riskCategories, { name: newCategory.name, effect: parseFloat(newCategory.effect) }]);
  };

  const addIntervention = (newIntervention) => {
    if (!newIntervention.name || !newIntervention.effect) return;
    setInterventions([...interventions, { name: newIntervention.name, effect: parseFloat(newIntervention.effect) }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!formData.totalPopulation) validationErrors.totalPopulation = "Ange total befolkning.";
    if (!formData.riskCategoryName) validationErrors.riskCategoryName = "Välj en skadekategori.";
    if (!formData.costPerFall) validationErrors.costPerFall = "Ange sjukvårdskostnad per fall.";
    if (!formData.interventionName) validationErrors.interventionName = "Välj en åtgärd.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const resultData = await fetchResults(formData, riskCategories, interventions);
      setResults(resultData);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Kostnadskalkyl</h2>
      <form onSubmit={handleSubmit} className="form">
  
        <Button variant="light" onClick={() => setShowModal(true)}> 
          Lägg till Kategori / Åtgärd 
        </Button>
  
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onAddRiskCategory={addRiskCategory} 
          onAddIntervention={addIntervention} 
        />
  
        <div className="form-group">
          <label htmlFor="befolkning">Total befolkning:</label>
          <input
            type="number"
            name="totalPopulation"
            value={formData.totalPopulation}
            onChange={handleChange}
            className={`form-input ${errors.totalPopulation ? "error" : ""}`}
          />
          {errors.totalPopulation && <p className="error-text">{errors.totalPopulation}</p>}
        </div>
  
        <div className="form-group">
          <label htmlFor="skadekategori">Välj skadekategori:</label>
          <select 
            name="riskCategoryName" 
            value={formData.riskCategoryName} 
            onChange={handleChange} 
            className="form-input"
          >
            <option value="">-- Välj kategori --</option>
            {riskCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.effect}%)
              </option>
            ))}
          </select>
          {errors.riskCategoryName && <p className="error-text">{errors.riskCategoryName}</p>}
        </div>
  
        <div className="form-group">
          <label htmlFor="sjukvårdskostnad">Sjukvårdskostnad per fall (kr):</label>
          <input
            type="number"
            name="costPerFall"
            value={formData.costPerFall}
            onChange={handleChange}
            className={`form-input ${errors.costPerFall ? "error" : ""}`}
          />
          {errors.costPerFall && <p className="error-text">{errors.costPerFall}</p>}
        </div>
  
        <div className="form-group">
          <label htmlFor="åtgärd">Välj åtgärd:</label>
          <select 
            name="interventionName" 
            value={formData.interventionName} 
            onChange={handleChange} 
            className="form-input"
          >
            <option value="">-- Välj en åtgärd --</option>
            {interventions.map((intervention) => (
              <option key={intervention.name} value={intervention.name}>
                {intervention.name} ({intervention.effect}%)
              </option>
            ))}
          </select>
          {errors.interventionName && <p className="error-text">{errors.interventionName}</p>}
        </div>
  
        <button type="submit" className="submit-button">Beräkna</button>
        
        <img className="logoImage" src={logoImage} alt="hestia agora brand logo image" />
      </form>
    </div>
  );
  
}

export default Calculator;