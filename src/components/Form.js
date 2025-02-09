import React, { useState } from "react";
import "./form.css"; 
import Modal from "./Modal"; 

function Calculator() {
  const [formData, setFormData] = useState({
    totalPopulation: "",
    riskCategoryName: "",
    costPerFall: "",
    interventionName: "", 
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [riskCategories, setRiskCategories] = useState([
    { name: "Risk för lindrigt skadade", effect: 2.4 },
    { name: "Risk för svårt skadade", effect: 1.8 },
    { name: "Risk för död", effect: 0.10 },
  ]);

  const [interventions, setInterventions] = useState([
    { name: "Fysisk träning", effect: 0.15 },
    { name: "Miljöanpassning hemtjänst", effect: 0.12 },
    { name: "Miljöanpassning Fysioterapeut", effect: 0.21 },
  ]);

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

    // Find the effect values for the selected category and intervention
    const selectedRiskCategory = riskCategories.find(cat => cat.name === formData.riskCategoryName);
    const selectedIntervention = interventions.find(int => int.name === formData.interventionName);

    if (!selectedRiskCategory || !selectedIntervention) {
      alert("Ogiltigt val av riskkategori eller åtgärd.");
      return;
    }

    const data = {
      totalPopulation: parseFloat(formData.totalPopulation),
      riskCategoryEffect: selectedRiskCategory.effect, // Send the effect value instead of name
      costPerFall: parseFloat(formData.costPerFall),
      interventionEffect: selectedIntervention.effect, // Send the effect value instead of name
    };

    try {
      const response = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(errorData.error || "Något gick fel. Försök igen.");
        return;
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (error) {
      console.error("Network or server error:", error);
      alert("Kunde inte ansluta till servern.");
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
          Total befolkning (antal personer mellan 65 - 99+ ):
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
          <select
            name="riskCategoryName"
            value={formData.riskCategoryName}
            onChange={handleChange}
            className="select"
          >
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
          <select
            name="interventionName" 
            value={formData.interventionName}
            onChange={handleChange}
            className="select"
          >
            <option value="">-- Välj en åtgärd --</option>
            {interventions.map((intervention) => (
              <option key={intervention.name} value={intervention.name}>
                {intervention.name} ({intervention.effect}% effekt)
              </option>
            ))}
          </select>
          {errors.interventionName && <p className="error-message">{errors.interventionName}</p>}
        </label>

        <button type="submit" className="button">
          Beräkna
        </button>
      </form>

      {result && (
        <div className="result">
          <h2 className="resultHeader">Resultat</h2>
          <p>Total befolkning: {result.totalPopulation}</p>
          <p>Antal fall utan insats: {result.fallsWithoutIntervention}</p>
          <p>Totala sjukvårdskostnader utan insats: {result.totalCostWithoutIntervention} kr</p>
          <p>Antal fall med insats: {result.fallsWithIntervention}</p>
          <p>Totala sjukvårdskostnader med insats: {result.totalCostWithIntervention} kr</p>
          <p>Besparing: {result.savingsPerYear} kr</p>
        </div>
      )}
    </div>
  );
}

export default Calculator;
