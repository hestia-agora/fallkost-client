import React, { useState } from "react";
import "./Calculator.css"; 

function Calculator() {
  const [formData, setFormData] = useState({
    totalPopulation: "",
    riskCategoryName: "",
    costPerFall: "",
    interventionName: "", 
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const riskCategories = [
    { name: "Risk för lindrigt skadade", effect: 2.4 },
    { name: "Risk för svårt skadade", effect: 1.8 },
    { name: "Risk för död", effect: 0.10 },
  ];

  const interventions = [
    { name: "Fysisk träning", effect: 0.15 },
    { name: "Miljöanpassning hemtjänst", effect: 0.12 },
    { name: "Miljöanpassning Fysioterapeut", effect: 0.21 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
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

  const data = {
    totalPopulation: parseFloat(formData.totalPopulation),
    riskCategoryName: formData.riskCategoryName,
    costPerFall: parseFloat(formData.costPerFall),
    interventionName: formData.interventionName,
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

    if (resultData.totalCostWithoutIntervention !== undefined) {
      setResult(resultData);
    } else {
      console.error("API returned incomplete data:", resultData);
      alert("Beräkningen misslyckades. Försök igen.");
    }
  } catch (error) {
    console.error("Network or server error:", error);
    alert("Kunde inte ansluta till servern.");
  }
};


  return (
    <div className="container">
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
                {intervention.name} ({intervention.effect * 100}% effekt)
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
          <p>
            Totala sjukvårdskostnader för fall utan insats:{" "}
            {result.totalCostWithoutIntervention.toFixed(0)} kr
          </p>
          <p>Antal fall med insats: {result.fallsWithIntervention}</p>
          <p>
            Totala sjukvårdskostnader för fall med insats:{" "}
            {result.totalCostWithIntervention.toFixed(0)} kr
          </p>
          <p>Besparing: {result.savingsPerYear.toFixed(0)} kr</p>
        </div>
      )}
    </div>
  );
}

export default Calculator;
