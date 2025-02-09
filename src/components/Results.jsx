import React from "react";
import "./results.css";

function Results({ result }) {
  if (!result) {
    return <p>Något gick fel. Ingen data från servern.</p>;
  }
  return (
    <div className="result">
      <h2 className="resultHeader">Resultat </h2>
      <p><strong>Total befolkning:</strong> {result.totalPopulation}</p>
      <p><strong>Antal fall utan insats:</strong> {result.fallsWithoutIntervention}</p>
      <p><strong>Totala sjukvårdskostnader utan insats:</strong> {result.totalCostWithoutIntervention} kr</p>
      <p><strong>Antal fall med insats:</strong> {result.fallsWithIntervention}</p>
      <p><strong>Totala sjukvårdskostnader med insats:</strong> {result.totalCostWithIntervention} kr</p>
      <p><strong>Besparing:</strong> {result.savingsPerYear} kr</p>
    </div>
  );
}

export default Results;
