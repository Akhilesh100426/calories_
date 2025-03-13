async function calculateCalories() {
    const food = document.getElementById("food").value;
    const quantity = document.getElementById("quantity").value;
    const caloriesResult = document.getElementById("calories-result");
    const benefitsResult = document.getElementById("benefits");
    //const disadvantagesResult = document.getElementById("disadvantages");
    
    // Clear previous results
    caloriesResult.innerText = "";
    benefitsResult.innerText = "";
    //disadvantagesResult.innerText = "";
    
    if (!food || !quantity) {
        caloriesResult.innerText = "Please enter food name and quantity.";
        return;
    }
    
    try {
        const response = await fetch("https://calories-gdrm.onrender.com/api/calculate-calories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ food, quantity })
        });
        
        const data = await response.json();
        
        if (data.error) {
            caloriesResult.innerText = "Error: " + data.error;
            return;
        }
        
        caloriesResult.innerText = `Calories: ${data.calories} `;
        benefitsResult.innerText = `Benefits: ${data.benefits}`;
        // disadvantagesResult.innerText = `Disadvantages: ${data.disadvantages}`;
    } catch (error) {
        console.error("Error fetching calorie data:", error);
        caloriesResult.innerText = "Failed to fetch data. Please try again.";
    }
}
