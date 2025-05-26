/**
 * Dashboard Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Load transactions
    loadTransactions();
    
    // Load upcoming vaccinations
    loadUpcomingVaccinations();
});

// Initialize charts
function initializeCharts() {
    // Production chart
    const productionChartCtx = document.getElementById('productionChart');
    if (productionChartCtx) {
        window.chartFunctions.createProductionChart(productionChartCtx);
    }
    
    // Income chart
    const incomeChartCtx = document.getElementById('incomeChart');
    if (incomeChartCtx) {
        window.chartFunctions.createIncomeChart(incomeChartCtx);
    }
}

// Load transactions
function loadTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    // Get transactions data
    const transactions = window.appData.transactions.slice(0, 4); // Get only first 4
    
    // Clear list
    transactionsList.innerHTML = '';
    
    // Add transactions
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        item.innerHTML = `
            <div class="transaction-icon ${transaction.type}">
                <i class="fas fa-${transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.title}</div>
                <div class="transaction-subtitle">${transaction.subtitle}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'} ${window.helpers.formatCurrency(transaction.amount)}
            </div>
        `;
        
        transactionsList.appendChild(item);
    });
}

// Load upcoming vaccinations
function loadUpcomingVaccinations() {
    const vaccinationsList = document.getElementById('vaccinationsList');
    if (!vaccinationsList) return;
    
    // Get vaccinations data
    const vaccinations = window.appData.vaccinations;
    
    // Clear list
    vaccinationsList.innerHTML = '';
    
    // Add vaccinations
    vaccinations.forEach(vaccination => {
        const item = document.createElement('div');
        item.className = 'upcoming-item';
        
        item.innerHTML = `
            <div class="upcoming-icon">
                <i class="fas fa-syringe"></i>
            </div>
            <div class="upcoming-details">
                <div class="upcoming-title">${vaccination.title}</div>
                <div class="upcoming-subtitle">${vaccination.subtitle}</div>
            </div>
            <div class="upcoming-date">
                ${window.helpers.formatDate(vaccination.date)}
            </div>
        `;
        
        vaccinationsList.appendChild(item);
    });
}