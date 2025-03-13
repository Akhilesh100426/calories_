function calculateBMI() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    document.getElementById('result').innerHTML = '';
    document.getElementById('comment').innerHTML = '';
    document.getElementById('ponderal').innerHTML = '';
    const error = document.getElementById('error');
    error.innerHTML = '';

    if (!age || !height || !weight) {
        error.innerHTML = 'Please fill in all fields.';
        return;
    }

    if (isNaN(age) || isNaN(height) || isNaN(weight)) {
        error.innerHTML = 'Please enter valid numbers.';
        return;
    }

    if (age <= 0 || height <= 0 || weight <= 0) {
        error.innerHTML = 'Values must be greater than zero.';
        return;
    }

    if (age < 2 || age > 120) {
        error.innerHTML = 'Please enter a valid age (2-120 years).';
        return;
    }

    if (height < 50 || height > 300) {
        error.innerHTML = 'Please enter a valid height (50-300 cm).';
        return;
    }

    if (weight < 2 || weight > 500) {
        error.innerHTML = 'Please enter a valid weight (2-500 kg).';
        return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    const ponderalIndex = (parseFloat(weight) / Math.pow(heightInMeters, 3)).toFixed(2);

    document.getElementById('result').innerHTML = `Your BMI is: ${bmi}`;
    document.getElementById('ponderal').innerHTML = `Ponderal Index is: ${ponderalIndex}`;

    let bmiCategory = "";
    let color = "";

    if (bmi < 18.5) {
        bmiCategory = "Underweight";
        color = "blue";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiCategory = "Normal";
        color = "green";
    } else if (bmi >= 25 && bmi <= 29.9) {
        bmiCategory = "Overweight";
        color = "orange";
    } else {
        bmiCategory = "Obese";
        color = "red";
    }

    document.getElementById('comment').innerHTML = `Category: ${bmiCategory}`;
    document.getElementById('comment').style.color = color;
    document.getElementById('result').style.color = color;
    document.getElementById('ponderal').style.color = color;

    document.getElementById('graphBtn').style.display = 'block';

    generateBMIChart(heightInMeters, weight, bmi, bmiCategory);
}

function generateBMIChart(height, weight, bmi, bmiCategory) {
    const ctx = document.getElementById('bmiChart').getContext('2d');

    if (window.bmiChartInstance) {
        window.bmiChartInstance.destroy();
    }

    let color = bmiCategory === "Underweight" ? "blue" :
                bmiCategory === "Normal" ? "green" :
                bmiCategory === "Overweight" ? "orange" : "red";

    window.bmiChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: `Your BMI: ${bmi} (${bmiCategory})`,
                data: [{ x: weight, y: height }],
                backgroundColor: color,
                borderColor: 'black',
                borderWidth: 2,
                pointRadius: 8
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Weight (kg)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Height (m)'
                    }
                }
            }
        }
    });
}
