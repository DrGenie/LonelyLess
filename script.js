/* script.js */

// Model Coefficients for Final DCE Study (Table 3)
const mainCoefficients = {
    ASC_alt1: -0.112,
    ASC_optout: 0.131,
    type_comm: 0.527,
    type_psych: 0.156,
    type_vr: -0.349,
    mode_virtual: -0.426,
    mode_hybrid: -0.289,
    freq_weekly: 0.617,
    freq_monthly: 0.336,
    dur_2hrs: 0.185,
    dur_4hrs: 0.213,
    dist_local: 0.059,
    dist_signif: -0.036,
    cost_cont: -0.034 // Updated based on Table 5 significance
};

// Model Coefficients by Loneliness Categories (Table 5)
const categoryCoefficients = {
    not_lonely: {
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
        cost_cont: -0.034,
        // Significance flags (true if p < 0.05)
        significance: {
            ASC_alt1: false,
            ASC_optout: false,
            type_comm: true,
            type_psych: false,
            type_vr: true,
            mode_virtual: true,
            mode_hybrid: true,
            freq_weekly: true,
            freq_monthly: true,
            dur_2hrs: false,
            dur_4hrs: true,
            dist_local: false,
            dist_signif: true,
            cost_cont: true
        }
    },
    moderately_lonely: {
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
        cost_cont: -0.042,
        // Significance flags (true if p < 0.05)
        significance: {
            ASC_alt1: false,
            ASC_optout: false,
            type_comm: true,
            type_psych: false,
            type_vr: false,
            mode_virtual: false,
            mode_hybrid: true,
            freq_weekly: true,
            freq_monthly: true,
            dur_2hrs: true,
            dur_4hrs: true,
            dist_local: false,
            dist_signif: true,
            cost_cont: true
        }
    },
    severely_lonely: {
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
        cost_cont: -0.033,
        // Significance flags (true if p < 0.05)
        significance: {
            ASC_alt1: false,
            ASC_optout: false,
            type_comm: true,
            type_psych: true,
            type_vr: true,
            mode_virtual: true,
            mode_hybrid: false,
            freq_weekly: true,
            freq_monthly: false,
            dur_2hrs: false,
            dur_4hrs: false,
            dist_local: false,
            dist_signif: false,
            cost_cont: true
        }
    }
};

// Cost Data for Each Programme Attribute
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
    }
};

// Benefit Parameters
const benefitPerPercent = 10000; // $10,000 AUD per 1% uptake probability

// Cost-of-Living Multipliers by State
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

// Initialize WTP Chart
let wtpChart = initializeWTPChart('wtpChart', 'Willingness To Pay (AUD)');

// Function to initialize WTP Chart
function initializeWTPChart(canvasId, title) {
    let ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Not Lonely', 'Moderately Lonely', 'Severely Lonely'],
            datasets: [{
                label: 'WTP (AUD)',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.6)', // Blue
                    'rgba(155, 89, 182, 0.6)', // Purple
                    'rgba(231, 76, 60, 0.6)'   // Red
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AUD'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Loneliness Category'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    },
                    color: '#2c3e50'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            return `${label}: $${value.toLocaleString()} AUD`;
                        }
                    }
                }
            }
        }
    });
}

// Function to calculate predicted probability and WTP, then open results in new windows
function calculateProbability() {
    // Get values from the form
    const state = document.getElementById('state_select').value;
    const adjustCosts = document.getElementById('adjust_costs').value;
    const cost_cont = parseFloat(document.getElementById('cost_cont').value);
    const dist_signif = parseFloat(document.getElementById('dist_signif').value);
    const dist_local = parseFloat(document.getElementById('dist_local').value);
    const freq_monthly = parseFloat(document.getElementById('freq_monthly').value);
    const freq_weekly = parseFloat(document.getElementById('freq_weekly').value);
    const mode_virtual = parseFloat(document.getElementById('mode_virtual').value);
    const mode_hybrid = parseFloat(document.getElementById('mode_hybrid').value);
    const dur_2hrs = parseFloat(document.getElementById('dur_2hrs').value);
    const dur_4hrs = parseFloat(document.getElementById('dur_4hrs').value);
    const type_comm = parseFloat(document.getElementById('type_comm').value);
    const type_psych = parseFloat(document.getElementById('type_psych').value);
    const type_vr = parseFloat(document.getElementById('type_vr').value);

    // Validate that only one duration is selected
    if (dur_2hrs === 1 && dur_4hrs === 1) {
        alert("Please select only one duration: either 2 Hours or 4 Hours.");
        return;
    }

    // Validate that only one frequency is selected
    if (freq_monthly === 1 && freq_weekly === 1) {
        alert("Please select only one frequency: either Monthly or Weekly.");
        return;
    }

    // Validate that only one accessibility option is selected
    if (dist_local === 1 && dist_signif === 1) {
        alert("Please select only one accessibility option: either Local Area Accessibility or Low Accessibility.");
        return;
    }

    // Validate that if 'Adjust Costs for Living Expenses' is 'Yes', a state is selected
    if (adjustCosts === 'yes' && !state) {
        alert("Please select a state if you choose to adjust costs for living expenses.");
        return;
    }

    // Calculate adjusted_cost_cont based on cost of living
    let adjusted_cost_cont = cost_cont; // Initialize adjusted cost_cont

    if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
        adjusted_cost_cont = cost_cont * costOfLivingMultipliers[state];
    }

    // Get selected attributes
    const selectedAttributes = getSelectedAttributes();

    // Calculate probabilities and costs for each loneliness category
    const categories = ['not_lonely', 'moderately_lonely', 'severely_lonely'];
    const results = {};

    categories.forEach(category => {
        const coef = categoryCoefficients[category];
        let U_alt1 = coef.ASC_alt1 +
                    coef.type_comm * type_comm +
                    coef.type_psych * type_psych +
                    coef.type_vr * type_vr +
                    coef.mode_virtual * mode_virtual +
                    coef.mode_hybrid * mode_hybrid +
                    coef.freq_weekly * freq_weekly +
                    coef.freq_monthly * freq_monthly +
                    coef.dur_2hrs * dur_2hrs +
                    coef.dur_4hrs * dur_4hrs +
                    coef.dist_local * dist_local +
                    coef.dist_signif * dist_signif +
                    coef.cost_cont * adjusted_cost_cont;

        // Calculate U_optout
        const U_optout = coef.ASC_optout;

        // Calculate P_alt1 using the logistic function
        const exp_U_alt1 = Math.exp(U_alt1);
        const exp_U_optout = Math.exp(U_optout);
        const P_alt1 = exp_U_alt1 / (exp_U_alt1 + exp_U_optout);

        // Ensure P_alt1 is between 0 and 1
        const P_final = Math.min(Math.max(P_alt1, 0), 1);

        // Calculate WTP
        const WTP = P_final * benefitPerPercent;

        // Calculate WTP per attribute
        const WTP_per_attribute = {};
        const attributes = ['type_comm', 'type_psych', 'type_vr', 'mode_virtual', 'mode_hybrid', 'freq_weekly', 'freq_monthly', 'dur_2hrs', 'dur_4hrs', 'dist_local', 'dist_signif'];
        attributes.forEach(attr => {
            if (coef.hasOwnProperty(attr)) {
                const wtp = -(coef[attr] / coef.cost_cont).toFixed(2);
                WTP_per_attribute[attr] = parseFloat(wtp);
            }
        });

        // Calculate totalCost
        const totalCost = calculateTotalCost(selectedAttributes, state, adjustCosts);

        // Calculate benefits
        const benefits = calculateBenefits(P_final);

        // Calculate netBenefit
        const netBenefit = benefits - totalCost;

        // Calculate benefit-cost ratio
        const bcr = (benefits / totalCost).toFixed(2);

        // Store results
        results[category] = {
            probability: (P_final * 100).toFixed(2) + '%',
            P_final: P_final,
            WTP: WTP.toLocaleString(),
            WTP_per_attribute: WTP_per_attribute,
            selectedAttributes: selectedAttributes,
            category: category,
            significance: coef.significance,
            state: state,
            adjustCosts: adjustCosts,
            totalCost: totalCost.toLocaleString(),
            benefits: benefits.toLocaleString(),
            netBenefit: netBenefit.toLocaleString(),
            bcr: bcr
        };
    });

    // Display results for each category in new windows
    categories.forEach(category => {
        openResultWindow(category, results[category], results[category].WTP_per_attribute);
    });

    // Calculate and display WTP results
    displayWTP(results);

    // Update WTP Chart
    updateWTPChart(results);
}

// Function to generate programme package list with user-friendly labels
function generateProgramPackage(attributes) {
    const packageList = [];
    const form = document.getElementById('decisionForm');
    const selects = form.getElementsByTagName('select');
    for (let select of selects) {
        if (select.id === 'state_select' || select.id === 'adjust_costs') {
            continue; // Skip state and adjust costs selections
        }
        if (select.value === "1") {
            let label = select.previousElementSibling.innerText;
            label = label.replace(':', '').trim();
            const value = select.options[select.selectedIndex].innerText;
            packageList.push(`${label}: ${value}`);
        }
    }
    // Generate HTML list items
    let listItems = '';
    packageList.forEach(item => {
        listItems += `<li>${item}</li>`;
    });
    return listItems;
}

// Function to calculate total cost with state adjustment
function calculateTotalCost(selectedAttributes, state, adjustCosts) {
    let totalCost = 0;

    selectedAttributes.forEach(attr => {
        const costs = costData[attr];
        for (let key in costs) {
            if (costs[key] > 0) {
                totalCost += costs[key];
            }
        }
    });

    // Apply Cost-of-Living Adjustment if applicable
    if (adjustCosts === 'yes' && state && costOfLivingMultipliers[state]) {
        totalCost = totalCost * costOfLivingMultipliers[state];
    }

    return totalCost;
}

// Helper Function to Get Selected Attributes
function getSelectedAttributes() {
    const form = document.getElementById('decisionForm');
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

// Function to open result in new window
function openResultWindow(category, data, WTP_per_attribute) {
    // Create a new window
    const resultWindow = window.open('', '_blank', 'width=900,height=900');
    
    // Build HTML content with embedded data
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Result - ${formatCategoryName(category)}</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f0f4f8;
                    margin: 20px;
                    padding: 20px;
                }
                h1, h2, h3, h4 {
                    text-align: center;
                    color: #2c3e50;
                }
                p {
                    font-size: 1.1em;
                    color: #34495e;
                }
                ul {
                    list-style-type: disc;
                    margin-left: 25px;
                    font-size: 1em;
                    color: #34495e;
                }
                .chart-container {
                    margin-top: 20px;
                    width: 100%;
                    height: 450px;
                    background-color: #ffffff;
                    padding: 25px;
                    border: 2px solid #bdc3c7;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                #probabilityChart {
                    width: 100%;
                    height: 300px;
                    margin-top: 20px;
                }
                #cbaChart {
                    width: 100%;
                    height: 300px;
                    margin-top: 20px;
                }
                #wtpPerAttribute {
                    margin-top: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #bdc3c7;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #ecf0f1;
                }
                button {
                    padding: 10px 15px;
                    background-color: #2980b9;
                    color: #ffffff;
                    border: none;
                    font-size: 1em;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    margin-top: 20px;
                }
                button:hover {
                    background-color: #1f6391;
                    transform: translateY(-2px);
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <h1>Result - ${formatCategoryName(category)}</h1>
            <p><strong>Predicted Probability of Uptake:</strong> ${data.probability}</p>
            <div class="chart-container">
                <canvas id="probabilityChart" aria-label="Doughnut chart showing uptake probability for ${formatCategoryName(category)} group" role="img"></canvas>
            </div>
            <div id="interpretations" aria-live="polite">
                ${generateInterpretationText(data.P_final)}
            </div>
            <section id="programPackage">
                <h3>Your Selected Programme Package:</h3>
                <ul>${generateProgramPackage(data.selectedAttributes)}</ul>
            </section>
            <div id="costInformation">
                <h3>Cost Analysis:</h3>
                <ul>
                    ${generateCostListHTML(data.selectedAttributes, data.state, data.adjustCosts)}
                </ul>
                <p><strong>Total Estimated Cost:</strong> \$${data.totalCost} AUD</p>
            </div>
            <div id="benefitInformation">
                <h3>Benefit Analysis:</h3>
                <p><strong>Total Estimated Benefits:</strong> \$${data.benefits} AUD</p>
            </div>
            <div id="cbaInformation">
                <h3>Cost-Benefit Analysis:</h3>
                <p><strong>Net Benefit:</strong> \$${data.netBenefit} AUD</p>
                <p><strong>Benefit-Cost Ratio:</strong> ${data.bcr}</p>
            </div>
            <div class="chart-container">
                <canvas id="cbaChart" aria-label="Bar chart showing Cost-Benefit Analysis for ${formatCategoryName(category)} group" role="img"></canvas>
            </div>
            <div id="wtpPerAttribute">
                <h3>Willingness To Pay (WTP) per Attribute:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>WTP (AUD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateWTPPerAttributeTable(WTP_per_attribute)}
                    </tbody>
                </table>
            </div>
            <div class="chart-container">
                <canvas id="wtpPerAttributeChart" aria-label="Bar chart showing WTP per Attribute for ${formatCategoryName(category)} group" role="img"></canvas>
            </div>
            <button onclick="window.close()" aria-label="Close this window">Close</button>
            <script>
                // Initialize Probability Chart
                const probabilityCtx = document.getElementById('probabilityChart').getContext('2d');
                new Chart(probabilityCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Uptake Probability', 'Remaining'],
                        datasets: [{
                            data: [${(data.P_final * 100).toFixed(2)}, ${(100 - (data.P_final * 100)).toFixed(2)}],
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
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        let value = context.parsed;
                                        return \`\${label}: \${value}%\`;
                                    }
                                }
                            }
                        }
                    }
                });

                // Initialize CBA Chart
                const cbaCtx = document.getElementById('cbaChart').getContext('2d');
                new Chart(cbaCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Total Costs', 'Total Benefits'],
                        datasets: [{
                            label: 'Amount (AUD)',
                            data: [${data.totalCost}, ${data.benefits}],
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
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'AUD'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Categories'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        let value = context.parsed.y;
                                        return \`\${label}: $\${value.toLocaleString()} AUD\`;
                                    }
                                }
                            }
                        }
                    }
                });

                // Initialize WTP per Attribute Chart
                const wtpPerAttrCtx = document.getElementById('wtpPerAttributeChart').getContext('2d');
                new Chart(wtpPerAttrCtx, {
                    type: 'bar',
                    data: {
                        labels: ${JSON.stringify(Object.keys(WTP_per_attribute))},
                        datasets: [{
                            label: 'WTP per Attribute (AUD)',
                            data: ${JSON.stringify(Object.values(WTP_per_attribute))},
                            backgroundColor: 'rgba(155, 89, 182, 0.6)', // Purple
                            borderColor: 'rgba(155, 89, 182, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'AUD'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Attributes'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        let value = context.parsed.y;
                                        return \`\${label}: $\${value.toLocaleString()} AUD\`;
                                    }
                                }
                            }
                        }
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    // Write HTML content to the new window
    resultWindow.document.write(htmlContent);
    resultWindow.document.close();
}

// Function to generate brief interpretations based on probability
function generateInterpretationText(P_final) {
    if (P_final < 0.3) {
        return `<p>Your selected support programmes have a low probability of uptake (<30%). This suggests that the current configuration may not be attractive to older adults. Consider revising the programme features to better meet the needs and preferences of your target population.</p>`;
    } else if (P_final >= 0.3 && P_final < 0.7) {
        return `<p>Your selected support programmes have a moderate probability of uptake (30%-70%). While there is potential interest, there is room for improvement. Enhancing certain programme features could increase engagement and participation rates.</p>`;
    } else {
        return `<p>Your selected support programmes have a high probability of uptake (>70%). This indicates strong acceptance and interest from older adults. Maintaining and promoting these programme features is recommended to maximise impact.</p>`;
    }
}

// Function to generate Cost List HTML
function generateCostListHTML(attributes, state, adjustCosts) {
    let costListHTML = '';
    attributes.forEach(attr => {
        const costs = costData[attr];
        for (let key in costs) {
            if (costs[key] > 0) {
                costListHTML += `<li>${formatAttributeName(key)}: \$${costs[key].toLocaleString()}</li>`;
            }
        }
    });
    return costListHTML;
}

// Function to format attribute names
function formatAttributeName(attr) {
    // Convert attribute IDs to user-friendly names
    const mapping = {
        type_comm: 'Community Engagement',
        type_psych: 'Psychological Counselling',
        type_vr: 'Virtual Reality',
        mode_virtual: 'Virtual Mode',
        mode_hybrid: 'Hybrid Mode',
        freq_weekly: 'Weekly Frequency',
        freq_monthly: 'Monthly Frequency',
        dur_2hrs: '2 Hours Duration',
        dur_4hrs: '4 Hours Duration',
        dist_local: 'Local Area Accessibility',
        dist_signif: 'Low Accessibility'
    };
    return mapping[attr] || capitalizeWords(attr.replace('_', ' '));
}

// Function to capitalize each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Function to generate WTP per Attribute Table Rows
function generateWTPPerAttributeTable(WTP_per_attribute) {
    let tableRows = '';
    for (let attr in WTP_per_attribute) {
        tableRows += `<tr><td>${formatAttributeName(attr)}</td><td>$${WTP_per_attribute[attr].toLocaleString()} AUD</td></tr>`;
    }
    return tableRows;
}

// Function to display WTP results in the main window
function displayWTP(results) {
    const wtpDetailsDiv = document.getElementById('wtpDetails');
    wtpDetailsDiv.innerHTML = `
        <ul>
            <li>Not Lonely: \$${results.not_lonely.WTP} AUD${isSignificant('not_lonely') ? '*' : ''}</li>
            <li>Moderately Lonely: \$${results.moderately_lonely.WTP} AUD${isSignificant('moderately_lonely') ? '*' : ''}</li>
            <li>Severely Lonely: \$${results.severely_lonely.WTP} AUD${isSignificant('severely_lonely') ? '*' : ''}</li>
        </ul>
        <p>* Indicates significant estimates (p < 0.05)</p>
    `;
}

// Function to check if estimates are significant based on 'cost_cont' significance as a proxy
function isSignificant(category) {
    // Using 'cost_cont' significance to determine overall significance for WTP
    return categoryCoefficients[category].significance.cost_cont;
}

// Function to initialize and update WTP Chart
function updateWTPChart(results) {
    wtpChart.data.datasets[0].data = [
        parseFloat(results.not_lonely.WTP.replace(/,/g, '')),
        parseFloat(results.moderately_lonely.WTP.replace(/,/g, '')),
        parseFloat(results.severely_lonely.WTP.replace(/,/g, ''))
    ];
    wtpChart.update();
}
