import React, { useState } from "react";
import "./form.css";
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

    // Validate form input
    let validationErrors = {};
    if (!formData.totalPopulation) {
      validationErrors.totalPopulation = "Du måste ange en total befolkning.";
    }
    if (!formData.riskCategoryName) {
      validationErrors.riskCategoryName = "Du måste välja en skadekategori.";
    }
    if (!formData.costPerFall) {
      validationErrors.costPerFall = "Du måste ange sjukvårdskostnad per fall.";
    }
    if (!formData.interventionName) { 
      validationErrors.interventionName = "Du måste välja en åtgärd.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Use the API function to send data
      const resultData = await fetchResults(formData, riskCategories, interventions);
      setResults(resultData); // Update parent state with results
    } catch (error) {
      alert(error.message); // Display the error to the user
    }
  };

  return (
    <div className="container">
      <button className="button" onClick={() => setShowModal(true)}> Lägg till Riskkategori / Åtgärd</button>
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onAddRiskCategory={addRiskCategory} 
        onAddIntervention={addIntervention} 
      />

      <h1 className="header">Fallförebyggande-Kostnadskalkyl</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          Total befolkning:
          <input
            type="number"
            name="totalPopulation"
            value={formData.totalPopulation}
            onChange={handleChange}
            className="input"
          />
          {errors.totalPopulation && <p className="error-message">{errors.totalPopulation}</p>}
        </label>

        <label className="label">
          Välj andel med skador:
          <select name="riskCategoryName" value={formData.riskCategoryName} onChange={handleChange} className="select">
            <option value="">-- Välj en kategori --</option>
            {riskCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.effect}%)
              </option>
            ))}
          </select>
          {errors.riskCategoryName && <p className="error-message">{errors.riskCategoryName}</p>}
        </label>

        <label className="label">
          Sjukvårdskostnad per fall (kr):
          <input
            type="number"
            name="costPerFall"
            value={formData.costPerFall}
            onChange={handleChange}
            className="input"
          />
          {errors.costPerFall && <p className="error-message">{errors.costPerFall}</p>}
        </label>

        <label className="label">
          Välj åtgärd:
          <select name="interventionName" value={formData.interventionName} onChange={handleChange} className="select">
            <option value="">-- Välj en åtgärd --</option>
            {interventions.map((intervention) => (
              <option key={intervention.name} value={intervention.name}>
                {intervention.name} ({intervention.effect}% effekt)
              </option>
            ))}
          </select>
          {errors.interventionName && <p className="error-message">{errors.interventionName}</p>}
        </label>

        <button type="submit" className="button">Beräkna</button>
      </form>
    </div>
  );
}

export default Calculator;
