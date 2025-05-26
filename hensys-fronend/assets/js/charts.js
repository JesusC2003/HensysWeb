/**
 * Charts Configuration
 */

// Chart color palette
const chartColors = {
    primary: '#2e7d32',
    secondary: '#1976d2',
    accent: '#ff9800',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    background: '#ffffff',
    text: '#212121',
    grid: '#e0e0e0',
    transparent: 'rgba(255, 255, 255, 0)'
};

// Chart defaults
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = chartColors.text;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Create production chart
function createProductionChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'Huevos',
                    data: [650, 590, 800, 810, 760, 850, 920, 890, 840, 950, 1050, 1250],
                    borderColor: chartColors.primary,
                    backgroundColor: hexToRgba(chartColors.primary, 0.1),
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Carne',
                    data: [350, 450, 420, 390, 480, 520, 550, 580, 600, 650, 700, 750],
                    borderColor: chartColors.secondary,
                    backgroundColor: hexToRgba(chartColors.secondary, 0.1),
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: hexToRgba(chartColors.grid, 0.5)
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Create income distribution chart
function createIncomeChart(ctx) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Huevos', 'Carne', 'Gallinas', 'Otros'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.accent,
                    chartColors.info
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Export chart creation functions
window.chartFunctions = {
    createProductionChart,
    createIncomeChart
};