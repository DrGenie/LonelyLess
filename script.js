<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Results by Loneliness Category</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 20px;
        }
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
        }
        h1, h2 {
            text-align: center;
            color: #2c3e50;
        }
        .category-section {
            margin-top: 40px;
        }
        .chart-container {
            width: 100%;
            height: 400px;
            margin-top: 20px;
        }
        button {
            padding: 10px 15px;
            background-color: #27ae60;
            color: #ffffff;
            border: none;
            font-size: 1em;
            cursor: pointer;
            border-radius: 6px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            margin-top: 20px;
        }
        button:hover {
            background-color: #1e8449;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Results by Loneliness Category</h1>

        <!-- Not Lonely Section -->
        <div class="category-section" id="notLonelySection">
            <h2>Not Lonely</h2>
            <canvas id="notLonelyChart"></canvas>
            <div class="chart-container">
                <canvas id="notLonelyCBAChart"></canvas>
            </div>
        </div>

        <!-- Moderately Lonely Section -->
        <div class="category-section" id="moderatelyLonelySection">
            <h2>Moderately Lonely</h2>
            <canvas id="moderatelyLonelyChart"></canvas>
            <div class="chart-container">
                <canvas id="moderatelyLonelyCBAChart"></canvas>
            </div>
        </div>

        <!-- Severely Lonely Section -->
        <div class="category-section" id="severelyLonelySection">
            <h2>Severely Lonely</h2>
            <canvas id="severelyLonelyChart"></canvas>
            <div class="chart-container">
                <canvas id="severelyLonelyCBAChart"></canvas>
            </div>
        </div>

        <!-- Download All CBA Reports Button -->
        <button onclick="downloadAllCBAs()">Download All CBA Reports as PDFs</button>
    </div>

    <script>
        // Model Coefficients by Loneliness Categories based on Table 5
        const categories = {
            "Not Lonely": {
                ASC_alt1: -0.149,
                ASC_optout: 0.151,
                type_comm: 0.369,
                type_psych: -0.019,
                type_vr: -0.375,
                mode_virtual: -0.604,
                mode_hybrid: -0.289,
                freq_weekly: 0.759,
                freq_monthly: 0.540,
                dur_2hrs: 0.031,
                dur_4hrs: 0.243,
                dist_local: -0.041,
                dist_signif: -0.814,
                cost_cont: -0.034
            },
            "Moderately Lonely": {
                ASC_alt1: -0.145,
                ASC_optout: 0.074,
                type_comm: 0.532,
                type_psych: 0.178,
                type_vr: -0.204,
                mode_virtual: -0.320,
                mode_hybrid: -0.402,
                freq_weekly: 0.555,
                freq_monthly: 0.357,
                dur_2hrs: 0.322,
                dur_4hrs: 0.266,
                dist_local: 0.082,
                dist_signif: -0.467,
                cost_cont: -0.042
            },
            "Severely Lonely": {
                ASC_alt1: -0.028,
                ASC_optout: 0.160,
                type_comm: 0.734,
                type_psych: 0.317,
                type_vr: -0.567,
                mode_virtual: -0.353,
                mode_hybrid: -0.151,
                freq_weekly: 0.540,
                freq_monthly: 0.042,
                dur_2hrs: 0.157,
                dur_4hrs: 0.060,
                dist_local: 0.211,
                dist_signif: -0.185,
                cost_cont: -0.033
            }
        };

        // Cost Data remains the same as main script
        const costData = {
            type_comm: {
                personnel: 20000,
                materials: 2000,
                technology: 3000,
                facility: 5000,
                marketing: 5000,
                training: 1000,
                miscellaneous: 1000
            },
            type_psych: {
                personnel: 25000,
                materials: 1500,
                technology: 2000,
                facility: 4000,
                marketing: 4000,
                training: 800,
                miscellaneous: 1200
            },
            type_vr: {
                personnel: 18000,
                materials: 1000,
                technology: 5000,
                facility: 3000,
                marketing: 3000,
                training: 700,
                miscellaneous: 800
            },
            mode_virtual: {
                personnel: 5000,
                materials: 500,
                technology: 4000,
                facility: 0,
                marketing: 1000,
                training: 300,
                miscellaneous: 500
            },
            mode_hybrid: {
                personnel: 7000,
                materials: 800,
                technology: 4500,
                facility: 2000,
                marketing: 1200,
                training: 400,
                miscellaneous: 600
            },
            freq_weekly: {
                personnel: 10000,
                materials: 1200,
                technology: 1500,
                facility: 3000,
                marketing: 1500,
                training: 500,
                miscellaneous: 700
            },
            freq_monthly: {
                personnel: 8000,
                materials: 1000,
                technology: 1200,
                facility: 2500,
                marketing: 1300,
                training: 400,
                miscellaneous: 600
            },
            dur_2hrs: {
                personnel: 3000,
                materials: 500,
                technology: 800,
                facility: 1000,
                marketing: 700,
                training: 200,
                miscellaneous: 300
            },
            dur_4hrs: {
                personnel: 4000,
                materials: 700,
                technology: 1000,
                facility: 1500,
                marketing: 900,
                training: 300,
                miscellaneous: 400
            },
            cost_cont: {
                personnel: 0, // Assuming cost continuum is a scaling factor
                materials: 0,
                technology: 0,
                facility: 0,
                marketing: 0,
                training: 0,
                miscellaneous: 0
            },
            dist_local: {
                personnel: 5000,
                materials: 800,
                technology: 1000,
                facility: 2000,
                marketing: 1000,
                training: 300,
                miscellaneous: 500
            },
            dist_signif: {
                personnel: 6000,
                materials: 900,
                technology: 1100,
                facility: 2200,
                marketing: 1100,
                training: 350,
                miscellaneous: 550
            },
            // Add more attributes as needed
        };

        // Cost-of-Living Multipliers by State remain the same
        const costOfLivingMultipliers = {
            NSW: 1.10, // New South Wales
            VIC: 1.05, // Victoria
            QLD: 1.00, // Queensland
            WA: 1.08,  // Western Australia
            SA: 1.02,  // South Australia
            TAS: 1.03, // Tasmania
            ACT: 1.15, // Australian Capital Territory
            NT: 1.07   // Northern Territory
        };

        // Function to calculate probability for a given category
        function calculateProbabilityCategory(category) {
            const coeff = categories[category];

            // Fetch selections from the main window
            const state = window.opener.document.getElementById('state_select').value;
            const adjustCosts = window.opener.document.getElementById('adjust_costs').value;
            const cost_cont = parseFloat(window.opener.document.getElementById('cost_cont').value);
            const dist_signif = parseFloat(window.opener.document.getElementById('dist_signif').value);
            const dist_local = parseFloat(window.opener.document.getElementById('dist_local').value);
            const freq_monthly = parseFloat(window.opener.document.getElementById('freq_monthly').value);
            const freq_weekly = parseFloat(window.opener.document.getElementById('freq_weekly').value);
            const mode_virtual = parseFloat(window.opener.document.getElementById('mode_virtual').value);
            const mode_hybrid = parseFloat(window.opener.document.getElementById('mode_hybrid').value);
            const dur_2hrs = parseFloat(window.opener.document.getElementById('dur_2hrs').value);
            const dur_4hrs = parseFloat(window.opener.document.getElementById('dur_4hrs').value);
            const type_comm = parseFloat(window.opener.document.getElementById('type_comm').value);
            const type_psych = parseFloat(window.opener.document.getElementById('type_psych').value);
            const type_vr = parseFloat(window.opener.document.getElementById('type_vr').value);

            // Validate that if 'Adjust Costs for Living Expenses' is 'Yes', a state is selected
            if (adjustCosts === 'yes' && !state) {
                alert("Please select a state if you choose to adjust costs for living expenses.");
                return "--";
            }

            // Calculate U_alt1 with Cost-of-Living Adjustment
            let adjusted_cost_cont = cost_cont; // Initialize adjusted cost_cont

            if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
                adjusted_cost_cont = cost_cont * costOfLivingMultipliers[state];
            }

            let U_alt1 = coeff.ASC_alt1 +
                        coeff.type_comm * type_comm +
                        coeff.type_psych * type_psych +
                        coeff.type_vr * type_vr +
                        coeff.mode_virtual * mode_virtual +
                        coeff.mode_hybrid * mode_hybrid +
                        coeff.freq_weekly * freq_weekly +
                        coeff.freq_monthly * freq_monthly +
                        coeff.dur_2hrs * dur_2hrs +
                        coeff.dur_4hrs * dur_4hrs +
                        coeff.dist_local * dist_local +
                        coeff.dist_signif * dist_signif +
                        coeff.cost_cont * adjusted_cost_cont;

            // Calculate U_optout (same for all categories)
            const U_optout = 0.131; // From Table 3

            // Calculate P_alt1 using the logistic function
            const exp_U_alt1 = Math.exp(U_alt1);
            const exp_U_optout = Math.exp(U_optout);
            const P_alt1 = exp_U_alt1 / (exp_U_alt1 + exp_U_optout);

            // Ensure P_alt1 is between 0 and 1
            const P_final = Math.min(Math.max(P_alt1, 0), 1);

            return P_final;
        }

        // Function to generate program package list with user-friendly labels for a given category
        function generateProgramPackageCategory(category) {
            const coeff = categories[category];
            const form = window.opener.document.getElementById('decisionForm');
            const selects = form.getElementsByTagName('select');
            const selectedAttributes = [];

            for (let select of selects) {
                if (select.id === 'state_select' || select.id === 'adjust_costs') {
                    continue; // Skip state and adjust costs selections
                }
                if (select.value === "1") {
                    let label = select.previousElementSibling.innerText;
                    label = label.replace(':', '').trim();
                    const value = select.options[select.selectedIndex].innerText;
                    selectedAttributes.push(`${label}: ${value}`);
                }
            }

            // Generate HTML list items
            let listItems = '';
            selectedAttributes.forEach(item => {
                listItems += `<li>${item}</li>`;
            });
            return listItems;
        }

        // Function to calculate total cost with state adjustment
        function calculateTotalCost(state, adjustCosts) {
            const selectedAttributes = getSelectedAttributes();
            let totalCost = {
                personnel: 0,
                materials: 0,
                technology: 0,
                facility: 0,
                marketing: 0,
                training: 0,
                miscellaneous: 0
            };
            
            selectedAttributes.forEach(attr => {
                const costs = costData[attr];
                for (let key in totalCost) {
                    if (costs[key]) {
                        totalCost[key] += costs[key];
                    }
                }
            });

            // Calculate Grand Total before adjustment
            let grandTotal = 0;
            for (let key in totalCost) {
                grandTotal += totalCost[key];
            }

            // Apply Cost-of-Living Adjustment if applicable
            if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
                grandTotal = grandTotal * costOfLivingMultipliers[state];
            }

            return { totalCost, grandTotal };
        }

        // Helper Function to Get Selected Attributes
        function getSelectedAttributes() {
            const form = window.opener.document.getElementById('decisionForm');
            const selects = form.getElementsByTagName('select');
            const attributes = [];
            for (let select of selects) {
                if (select.id === 'state_select' || select.id === 'adjust_costs') {
                    continue; // Skip state and adjust costs selections
                }
                if (select.value === "1") {
                    attributes.push(select.id);
                }
            }
            return attributes;
        }

        // Function to calculate benefits based on probability
        function calculateBenefits(probability) {
            const benefit = probability * 100 * benefitPerPercent;
            return benefit;
        }

        // Function to display cost information
        function displayCosts(category, costResults) {
            const { totalCost, grandTotal } = costResults;
            const costList = document.getElementById(`${category}CostList`);
            const totalCostDisplay = document.getElementById(`${category}TotalCost`);
            
            // Clear Previous Costs
            costList.innerHTML = '';
            
            // Populate Cost Components
            for (let key in totalCost) {
                if (totalCost[key] > 0) {
                    const listItem = document.createElement('li');
                    listItem.innerText = `${capitalizeFirstLetter(key)}: \$${totalCost[key].toLocaleString()}`;
                    costList.appendChild(listItem);
                }
            }
            
            // Display Grand Total
            totalCostDisplay.innerText = grandTotal.toLocaleString();
        }

        // Function to display benefits
        function displayBenefits(category, benefits) {
            const benefitsDisplay = document.getElementById(`${category}Benefits`);
            benefitsDisplay.innerText = benefits.toLocaleString();
        }

        // Function to display Cost-Benefit Analysis
        function displayCBA(category, totalCost, benefits) {
            const netBenefitDisplay = document.getElementById(`${category}NetBenefit`);
            const bcrDisplay = document.getElementById(`${category}BCR`);

            const netBenefit = benefits - totalCost;
            const bcr = benefits / totalCost;

            netBenefitDisplay.innerText = netBenefit.toLocaleString();
            bcrDisplay.innerText = bcr.toFixed(2);
        }

        // Function to capitalize first letter
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Function to display charts for a given category
        function displayCharts(category, P_final, benefits, totalCost) {
            // Uptake Probability Chart
            const ctx = document.getElementById(`${category.replace(" ", "")}Chart`).getContext('2d');
            const uptakeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Uptake Probability', 'Remaining'],
                    datasets: [{
                        data: [P_final, 1 - P_final],
                        backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(236, 240, 241, 0.3)'],
                        borderColor: ['rgba(39, 174, 96, 1)', 'rgba(236, 240, 241, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 14
                                },
                                color: '#34495e'
                            }
                        },
                        title: {
                            display: true,
                            text: `Predicted Probability of Program Uptake - ${category}`,
                            font: {
                                size: 18
                            },
                            color: '#2c3e50'
                        }
                    }
                }
            });

            // Cost-Benefit Analysis Chart
            const cbaCtx = document.getElementById(`${category.replace(" ", "")}CBAChart`).getContext('2d');
            const cbaChartCategory = new Chart(cbaCtx, {
                type: 'bar',
                data: {
                    labels: ['Total Costs', 'Total Benefits'],
                    datasets: [{
                        label: 'Amount (AUD)',
                        data: [totalCost, benefits],
                        backgroundColor: [
                            'rgba(231, 76, 60, 0.6)', // Red for Costs
                            'rgba(39, 174, 96, 0.6)'   // Green for Benefits
                        ],
                        borderColor: [
                            'rgba(231, 76, 60, 1)',
                            'rgba(39, 174, 96, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: `Cost-Benefit Analysis - ${category}`,
                            font: {
                                size: 18
                            },
                            color: '#2c3e50'
                        }
                    }
                }
            });
        }

        // Function to download all CBA reports as PDFs
        function downloadAllCBAs() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let yPosition = 10;

            for (let category in categories) {
                const P_final = calculateProbabilityCategory(category);
                const benefits = calculateBenefits(P_final);
                const state = window.opener.document.getElementById('state_select').value;
                const adjustCosts = window.opener.document.getElementById('adjust_costs').value;
                const cost_cont = parseFloat(window.opener.document.getElementById('cost_cont').value);
                const dist_signif = parseFloat(window.opener.document.getElementById('dist_signif').value);
                const dist_local = parseFloat(window.opener.document.getElementById('dist_local').value);
                const freq_monthly = parseFloat(window.opener.document.getElementById('freq_monthly').value);
                const freq_weekly = parseFloat(window.opener.document.getElementById('freq_weekly').value);
                const mode_virtual = parseFloat(window.opener.document.getElementById('mode_virtual').value);
                const mode_hybrid = parseFloat(window.opener.document.getElementById('mode_hybrid').value);
                const dur_2hrs = parseFloat(window.opener.document.getElementById('dur_2hrs').value);
                const dur_4hrs = parseFloat(window.opener.document.getElementById('dur_4hrs').value);

                // Calculate total cost
                let adjusted_cost_cont = cost_cont;
                if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
                    adjusted_cost_cont = cost_cont * costOfLivingMultipliers[state];
                }

                const coeff = categories[category];
                let totalCost = 0;
                for (let key in coeff) {
                    if (costData[key]) {
                        totalCost += costData[key].personnel +
                                     costData[key].materials +
                                     costData[key].technology +
                                     costData[key].facility +
                                     costData[key].marketing +
                                     costData[key].training +
                                     costData[key].miscellaneous;
                    }
                }

                const netBenefit = benefits - totalCost;
                const bcr = benefits / totalCost;

                doc.setFontSize(16);
                doc.text(`Cost-Benefit Analysis Report - ${category}`, 10, yPosition);
                yPosition += 10;
                doc.setFontSize(12);
                doc.text(`Selected State: ${state ? state : 'N/A'}`, 10, yPosition);
                yPosition += 10;
                doc.text(`Adjust Costs for Living Expenses: ${adjustCosts === 'yes' ? 'Yes' : 'No'}`, 10, yPosition);
                yPosition += 10;
                doc.text(`Total Estimated Cost: $${totalCost.toLocaleString()} AUD`, 10, yPosition);
                yPosition += 10;
                doc.text(`Total Estimated Benefits: $${benefits.toLocaleString()} AUD`, 10, yPosition);
                yPosition += 10;
                doc.text(`Net Benefit: $${netBenefit.toLocaleString()} AUD`, 10, yPosition);
                yPosition += 10;
                doc.text(`Benefit-Cost Ratio: ${bcr.toFixed(2)}`, 10, yPosition);
                
                yPosition += 20;

                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 10;
                }
            }

            doc.save('All_CBA_Reports.pdf');

            alert("All Cost-Benefit Analysis reports downloaded successfully!");
        }

        // Function to generate brief interpretations for categories
        function generateInterpretationsCategory(probability, category) {
            let interpretation = '';

            if (probability < 0.3) {
                interpretation = `<p><strong>${category}:</strong> Your selected support programs have a low probability of uptake (<30%). This suggests that the current configuration may not be attractive to older adults. Consider revising the program features to better meet the needs and preferences of your target population.</p>`;
            } else if (probability >= 0.3 && probability < 0.7) {
                interpretation = `<p><strong>${category}:</strong> Your selected support programs have a moderate probability of uptake (30%-70%). While there is potential interest, there is room for improvement. Enhancing certain program features could increase engagement and participation rates.</p>`;
            } else {
                interpretation = `<p><strong>${category}:</strong> Your selected support programs have a high probability of uptake (>70%). This indicates strong acceptance and interest from older adults. Maintaining and promoting these program features is recommended to maximize impact.</p>`;
            }

            return interpretation;
        }

        // Function to display all charts
        function displayAllCharts() {
            for (let category in categories) {
                const P_final = calculateProbabilityCategory(category);
                const benefits = calculateBenefits(P_final);
                const state = window.opener.document.getElementById('state_select').value;
                const adjustCosts = window.opener.document.getElementById('adjust_costs').value;
                const cost_cont = parseFloat(window.opener.document.getElementById('cost_cont').value);
                const dist_signif = parseFloat(window.opener.document.getElementById('dist_signif').value);
                const dist_local = parseFloat(window.opener.document.getElementById('dist_local').value);
                const freq_monthly = parseFloat(window.opener.document.getElementById('freq_monthly').value);
                const freq_weekly = parseFloat(window.opener.document.getElementById('freq_weekly').value);
                const mode_virtual = parseFloat(window.opener.document.getElementById('mode_virtual').value);
                const mode_hybrid = parseFloat(window.opener.document.getElementById('mode_hybrid').value);
                const dur_2hrs = parseFloat(window.opener.document.getElementById('dur_2hrs').value);
                const dur_4hrs = parseFloat(window.opener.document.getElementById('dur_4hrs').value);

                // Calculate total cost
                let adjusted_cost_cont = cost_cont;
                if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
                    adjusted_cost_cont = cost_cont * costOfLivingMultipliers[state];
                }

                const coeff = categories[category];
                let totalCost = 0;
                for (let key in coeff) {
                    if (costData[key]) {
                        totalCost += costData[key].personnel +
                                     costData[key].materials +
                                     costData[key].technology +
                                     costData[key].facility +
                                     costData[key].marketing +
                                     costData[key].training +
                                     costData[key].miscellaneous;
                    }
                }

                displayCharts(category, P_final, benefits, totalCost);
                displayCosts(category, { totalCost, grandTotal: totalCost });
                displayBenefits(category, benefits);
                displayCBA(category, totalCost, benefits);
            }
        }

        // Execute displayAllCharts after window loads
        window.onload = function() {
            displayAllCharts();
        }
    </script>
</body>
</html>