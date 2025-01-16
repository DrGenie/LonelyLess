# LonelyLessAustralia Decision Aid Tool

## Overview

The **LonelyLessAustralia Decision Aid Tool** is a web-based application designed to assist policymakers and stakeholders in evaluating different scenarios aimed at reducing loneliness among older adults in Australia. By utilizing Discrete Choice Experiment (DCE) estimates, the tool predicts programme uptake probabilities and conducts comprehensive cost-benefit analyses based on user-defined scenarios.

## Features

1. **Interactive Tabs**: Navigate through various sections including Introduction, Instructions, Attributes, Inputs, WTP Results, Programme Uptake Probability, Costs & Benefits, and Scenarios.

2. **Willingness to Pay (WTP) Results**: Visualize the monetary value older adults place on each programme attribute using bar charts with error bars.

3. **Programme Uptake Probability**: Dynamically compute and display the likelihood of programme uptake based on selected attributes.

4. **Costs & Benefits Analysis**: Detailed breakdown of intervention costs and monetized QALY benefits, facilitating informed decision-making.

5. **Scenario Management**: Save multiple scenarios, compare them side by side, and export the comparisons to PDF for reporting and analysis.

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge)
- Internet connection to load external libraries (Chart.js, jsPDF)

### Installation

1. **Download the Files**: Ensure you have the following files in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Open the Application**:
   - Double-click on `index.html` to launch the tool in your default web browser.

## Usage

1. **Navigate Through Tabs**: Use the tabs at the top to access different sections of the tool.

2. **Configure Inputs**:
   - Go to the **Inputs** tab.
   - Select your desired state and whether to adjust for cost-of-living.
   - Adjust the cost per session using the slider.
   - Select various attributes such as accessibility, frequency, method, duration, and type of support programme.
   - Click **"Calculate & View Results"** to generate results.

3. **View WTP Results**:
   - Navigate to the **WTP Results** tab.
   - Click **"Show WTP Plots"** to visualize the willingness to pay for each attribute with corresponding error bars.

4. **Programme Uptake Probability**:
   - Go to the **Programme Uptake Probability** tab.
   - Click **"Show Probability Plot"** to see the predicted uptake based on your inputs.

5. **Costs & Benefits Analysis**:
   - Access the **Costs & Benefits** tab.
   - Select the desired QALY Gain Scenario.
   - Review the detailed cost components and benefits.
   - Visualize the total intervention costs and monetized QALY benefits through side-by-side charts.

6. **Manage Scenarios**:
   - In the **Scenarios** tab, save your current scenario by clicking **"Save Current Scenario"**.
   - Compare all saved scenarios by clicking **"Compare All Scenarios"**.
   - Export the comparison to a PDF by clicking **"Export Comparison to PDF"**.

## Technical Details

- **Chart.js**: Utilized for rendering interactive and responsive charts.
- **jsPDF**: Enables the export of scenario comparisons to PDF format.
- **Custom Error Bars**: Implemented within Chart.js to display standard errors for WTP values.

## Reference

Engel, L., Lee, Y. Y., Le, L. K. D., Lal, A., & Mihalopoulos, C. (2021). Reducing loneliness to prevent depression in older adults in Australia: A modelled cost-effectiveness analysis. *Mental Health and Prevention, 24*. [https://doi.org/10.1016/j.mhp.2021.200212](https://doi.org/10.1016/j.mhp.2021.200212).

## Author

Mesfin Genie, Newcastle Business School, The University of Newcastle, Australia

## Acknowledgments

- Thanks to the developers of [Chart.js](https://www.chartjs.org/) and [jsPDF](https://github.com/parallax/jsPDF) for their invaluable libraries.
