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

// Initialize Charts for Each Loneliness Category
let probabilityCharts = {
    not_lonely: initializeProbabilityChart('probabilityChart_not_lonely', 'Predicted Probability of Programme Uptake - Not Lonely'),
    moderately_lonely: initializeProbabilityChart('probabilityChart_moderately_lonely', 'Predicted Probability of Programme Uptake - Moderately Lonely'),
    severely_lonely: initializeProbabilityChart('probabilityChart_severely_lonely', 'Predicted Probability of Programme Uptake - Severely Lonely')
};

let cbaCharts = {
    not_lonely: initializeCBAChart('cbaChart_not_lonely', 'Cost-Benefit Analysis - Not Lonely'),
    moderately_lonely: initializeCBAChart('cbaChart_moderately_lonely', 'Cost-Benefit Analysis - Moderately Lonely'),
    severely_lonely: initializeCBAChart('cbaChart_severely_lonely', 'Cost-Benefit Analysis - Severely Lonely')
};

// Initialize WTP Chart
let wtpChart = initializeWTPChart('wtpChart', 'Willingness To Pay (AUD)');

// Function to initialize Probability Chart
function initializeProbabilityChart(canvasId, title) {
    let ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Uptake Probability', 'Remaining'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['rgba(39, 174, 96, 0.6)', 'rgba(236, 240, 241, 0.3)'], // Green and Light Gray
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
                    text: title,
                    font: {
                        size: 18
                    },
                    color: '#2c3e50'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// Function to initialize CBA Chart
function initializeCBAChart(canvasId, title) {
    let ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Costs', 'Total Benefits'],
            datasets: [{
                label: 'Amount (AUD)',
                data: [0, 0],
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

// Function to calculate predicted probability and update the charts and tables
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

        // Store results
        results[category] = {
            probability: (P_final * 100).toFixed(2) + '%',
            P_final: P_final,
            WTP: WTP.toLocaleString(),
            selectedAttributes: selectedAttributes,
            category: category,
            significance: coef.significance
        };
    });

    // Display results for each category
    categories.forEach(category => {
        displayResults(category, results[category]);
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
        for (let key in costs) {
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

    return grandTotal;
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

// Function to display results for each category
function displayResults(category, data) {
    const probabilitySpan = document.getElementById(`probability_${category}`);
    const interpretationsDiv = document.getElementById(`interpretations_${category}`);
    const packageList = document.getElementById(`packageList_${category}`);
    const costList = document.getElementById(`costList_${category}`);
    const totalCostDisplay = document.getElementById(`totalCost_${category}`);
    const totalBenefitsDisplay = document.getElementById(`totalBenefits_${category}`);
    const netBenefitDisplay = document.getElementById(`netBenefit_${category}`);
    const bcrDisplay = document.getElementById(`bcr_${category}`);
    const cbaChart = cbaCharts[category];
    const programPackageSection = document.getElementById(`programPackage_${category}`);
    const costInformationSection = document.getElementById(`costInformation_${category}`);

    // Update Probability
    probabilitySpan.innerText = data.probability;

    // Update Interpretations
    interpretationsDiv.innerHTML = generateInterpretations(data.P_final, category);

    // Update Program Package
    packageList.innerHTML = generateProgramPackage(data.selectedAttributes);

    // Show or hide download buttons based on package selection
    const downloadPackageBtn = programPackageSection.querySelector('button[onclick^="downloadPackage"]');
    const downloadChartBtn = programPackageSection.querySelector('button[onclick^="downloadChart"]');
    if (packageList.children.length > 0) {
        downloadPackageBtn.style.display = 'inline-block';
        downloadChartBtn.style.display = 'inline-block';
    } else {
        downloadPackageBtn.style.display = 'none';
        downloadChartBtn.style.display = 'none';
    }

    // Calculate and Display Costs
    const state = document.getElementById('state_select').value;
    const adjustCosts = document.getElementById('adjust_costs').value;
    const selectedAttributes = data.selectedAttributes;
    const grandTotal = calculateTotalCost(selectedAttributes, state, adjustCosts);
    displayCosts(costList, grandTotal, category);

    // Calculate and Display Benefits
    const benefits = calculateBenefits(data.P_final);
    displayBenefits(totalBenefitsDisplay, benefits, category);

    // Display Cost-Benefit Analysis
    displayCBA(grandTotal, benefits, category);

    // Update CBA Chart
    cbaChart.data.datasets[0].data = [grandTotal, benefits];
    cbaChart.update();
}

// Function to generate brief interpretations based on probability and category
function generateInterpretations(probability, category) {
    let interpretation = '';

    if (probability < 0.3) {
        interpretation = `<p>Your selected support programmes have a low probability of uptake (<30%). This suggests that the current configuration may not be attractive to older adults. Consider revising the programme features to better meet the needs and preferences of your target population.</p>`;
    } else if (probability >= 0.3 && probability < 0.7) {
        interpretation = `<p>Your selected support programmes have a moderate probability of uptake (30%-70%). While there is potential interest, there is room for improvement. Enhancing certain programme features could increase engagement and participation rates.</p>`;
    } else {
        interpretation = `<p>Your selected support programmes have a high probability of uptake (>70%). This indicates strong acceptance and interest from older adults. Maintaining and promoting these programme features is recommended to maximise impact.</p>`;
    }

    return interpretation;
}

// Function to calculate benefits based on probability
function calculateBenefits(probability) {
    const benefit = probability * 100 * benefitPerPercent;
    return benefit;
}

// Function to display cost information
function displayCosts(costList, grandTotal, category) {
    const totalCostDisplay = document.getElementById(`totalCost_${category}`);

    // Clear Previous Costs
    costList.innerHTML = '';

    // Populate Cost Components
    const selectedAttributes = getSelectedAttributes();
    selectedAttributes.forEach(attr => {
        const costs = costData[attr];
        for (let key in costs) {
            if (costs[key] > 0) {
                const listItem = document.createElement('li');
                listItem.innerText = `${capitalizeFirstLetter(key)}: \$${costs[key].toLocaleString()}`;
                costList.appendChild(listItem);
            }
        }
    });

    // Display Grand Total
    totalCostDisplay.innerText = grandTotal.toLocaleString();
}

// Function to display benefits
function displayBenefits(displayElement, benefits, category) {
    displayElement.innerText = benefits.toLocaleString();
}

// Function to display Cost-Benefit Analysis
function displayCBA(totalCost, benefits, category) {
    const netBenefit = benefits - totalCost;
    const bcr = benefits / totalCost;

    const netBenefitDisplay = document.getElementById(`netBenefit_${category}`);
    const bcrDisplay = document.getElementById(`bcr_${category}`);

    // Update CBA
    netBenefitDisplay.innerText = netBenefit.toLocaleString();
    bcrDisplay.innerText = bcr.toFixed(2);
}

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to download programme package as a text file
function downloadPackage(category) {
    const packageList = document.getElementById(`packageList_${category}`);
    if (packageList.children.length === 0) {
        alert("No programme package selected to download.");
        return;
    }

    let packageText = 'Selected Programme Package:\n';
    for (let li of packageList.children) {
        packageText += li.innerText + '\n';
    }

    const blob = new Blob([packageText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Programme_Package_${capitalizeWords(category.replace('_', ' '))}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    alert("Programme Package downloaded successfully!");
}

// Function to download the Uptake Probability chart as an image
function downloadChart(category) {
    const canvas = document.getElementById(`probabilityChart_${category}`);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Uptake_Probability_Chart_${capitalizeWords(category.replace('_', ' '))}.png`;
    link.click();
    
    alert("Uptake Probability chart downloaded successfully!");
}

// Function to download CBA report as PDF
function downloadCBAPDF(category) {
    const state = document.getElementById('state_select').value;
    const adjustCosts = document.getElementById('adjust_costs').value;
    const totalCost = parseFloat(document.getElementById(`totalCost_${category}`).innerText.replace(/,/g, ''));
    const P_final = parseFloat(document.getElementById(`probability_${category}`).innerText.replace('%', '')) / 100;
    const benefits = parseFloat(document.getElementById(`totalBenefits_${category}`).innerText.replace(/,/g, ''));
    const netBenefit = benefits - totalCost;
    const bcr = benefits / totalCost;

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("LonelyLessAustralia - Cost-Benefit Analysis Report", 10, 20);
    doc.setFontSize(12);
    doc.text(`Loneliness Category: ${formatCategoryName(category)}`, 10, 30);
    doc.text(`Selected State: ${state ? state : 'N/A'}`, 10, 40);
    doc.text(`Adjust Costs for Living Expenses: ${adjustCosts === 'yes' ? 'Yes' : 'No'}`, 10, 50);
    doc.text(`Total Estimated Cost: $${totalCost.toLocaleString()} AUD`, 10, 60);
    doc.text(`Total Estimated Benefits: $${benefits.toLocaleString()} AUD`, 10, 70);
    doc.text(`Net Benefit: $${netBenefit.toLocaleString()} AUD`, 10, 80);
    doc.text(`Benefit-Cost Ratio: ${bcr.toFixed(2)}`, 10, 90);
    
    // Add a line break
    doc.line(10, 95, 200, 95);

    // Add charts as images
    const probabilityChart = document.getElementById(`probabilityChart_${category}`);
    const cbaChart = document.getElementById(`cbaChart_${category}`);

    // Convert charts to images
    const probabilityChartURL = probabilityChart.toDataURL('image/png', 1.0);
    const cbaChartURL = cbaChart.toDataURL('image/png', 1.0);

    // Add Probability Chart
    doc.text("Uptake Probability Chart:", 10, 105);
    doc.addImage(probabilityChartURL, 'PNG', 10, 110, 60, 60);

    // Add CBA Chart
    doc.text("Cost-Benefit Analysis Chart:", 80, 105);
    doc.addImage(cbaChartURL, 'PNG', 80, 110, 60, 60);

    // Save PDF
    doc.save(`CBA_Report_${capitalizeWords(category.replace('_', ' '))}.pdf`);

    alert("Cost-Benefit Analysis report downloaded successfully!");
}

// Helper Function to format category names
function formatCategoryName(category) {
    switch(category) {
        case 'not_lonely':
            return 'Not Lonely';
        case 'moderately_lonely':
            return 'Moderately Lonely';
        case 'severely_lonely':
            return 'Severely Lonely';
        default:
            return capitalizeWords(category.replace('_', ' '));
    }
}

// Helper Function to capitalize each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Function to display WTP results
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

// Function to download WTP report as PDF
function downloadWTPReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("LonelyLessAustralia - Willingness To Pay (WTP) Report", 10, 20);
    doc.setFontSize(12);
    const wtpList = document.getElementById('wtpDetails').getElementsByTagName('li');
    let yPosition = 30;
    for (let li of wtpList) {
        doc.text(li.innerText, 10, yPosition);
        yPosition += 10;
    }
    doc.text(`* Indicates significant estimates (p < 0.05)`, 10, yPosition);

    // Add a line break
    doc.line(10, yPosition + 5, 200, yPosition + 5);

    // Add WTP Chart as image
    const wtpChartCanvas = document.getElementById('wtpChart');
    const wtpChartURL = wtpChartCanvas.toDataURL('image/png', 1.0);
    doc.text("WTP Chart:", 10, yPosition + 15);
    doc.addImage(wtpChartURL, 'PNG', 10, yPosition + 20, 60, 60);

    // Save PDF
    doc.save('WTP_Report.pdf');

    alert("WTP report downloaded successfully!");
}

// Feedback Form Submission Handler
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedback').value.trim();
    if (feedback) {
        // For demonstration, we'll just alert the feedback. 
        // In a real application, you'd send this to a server.
        alert("Thank you for your feedback!");
        document.getElementById('feedbackForm').reset();
    } else {
        alert("Please enter your feedback before submitting.");
    }
});

// Function to ensure all charts are initialized on page load
window.onload = function() {
    // No additional initialization needed as charts are already initialized
};
