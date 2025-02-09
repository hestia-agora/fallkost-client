export const fetchResults = async (formData, riskCategories, interventions) => {
  console.log("Sending request with data:", formData); // Debugging
  
  const selectedRiskCategory = riskCategories.find(cat => cat.name === formData.riskCategoryName);
  const selectedIntervention = interventions.find(int => int.name === formData.interventionName);

  if (!selectedRiskCategory || !selectedIntervention) {
    throw new Error("Ogiltigt val av riskkategori eller åtgärd.");
  }

  const data = {
    totalPopulation: parseFloat(formData.totalPopulation),
    riskCategoryEffect: selectedRiskCategory.effect,
    costPerFall: parseFloat(formData.costPerFall),
    interventionEffect: selectedIntervention.effect,
  };

  try {
    const response = await fetch("http://localhost:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("Server Response Status:", response.status); // Debugging

    if (!response.ok) {
      throw new Error(`API error, status: ${response.status}`);
    }

    const resultData = await response.json();
    console.log("Received result data:", resultData); // Debugging
    return resultData;
  } catch (error) {
    console.error("Fetch error:", error); // Log errors
    throw error;
  }
};
