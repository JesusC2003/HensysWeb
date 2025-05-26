/**
 * Feeding Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load feeding data
    loadFeedingData();
    
    // Load stock data
    loadStockData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load feeding data
function loadFeedingData() {
    const tableBody = document.querySelector('#feedingTable tbody');
    if (!tableBody) return;
    
    // Mock feeding data
    const feedingData = [
        { fecha: "2023-11-28", galpon: 1, tipo: "Concentrado", cantidad: 50, responsable: "Juan Pérez" },
        { fecha: "2023-11-28", galpon: 2, tipo: "Maíz", cantidad: 45, responsable: "María López" },
        { fecha: "2023-11-27", galpon: 3, tipo: "Mixto", cantidad: 60, responsable: "Juan Pérez" },
        { fecha: "2023-11-27", galpon: 4, tipo: "Concentrado", cantidad: 55, responsable: "Carlos Gómez" },
        { fecha: "2023-11-26", galpon: 5, tipo: "Maíz", cantidad: 40, responsable: "María López" },
        { fecha: "2023-11-26", galpon: 1, tipo: "Concentrado", cantidad: 50, responsable: "Juan Pérez" },
        { fecha: "2023-11-25", galpon: 2, tipo: "Mixto", cantidad: 55, responsable: "Carlos Gómez" }
    ];
    
    // Get filter values
    const typeFilter = document.getElementById('feedingFilter');
    const dateFilter = document.getElementById('feedingDateFilter');
    const coopFilter = document.getElementById('feedingCoopFilter');
    
    const typeValue = typeFilter ? typeFilter.value : 'all';
    const dateValue = dateFilter ? dateFilter.value : '';
    const coopValue = coopFilter ? coopFilter.value : 'all';
    
    // Filter data
    let filteredData = [...feedingData];
    
    if (typeValue !== 'all') {
        filteredData = filteredData.filter(item => item.tipo === typeValue);
    }
    
    if (dateValue) {
        filteredData = filteredData.filter(item => item.fecha === dateValue);
    }
    
    if (coopValue !== 'all') {
        filteredData = filteredData.filter(item => item.galpon.toString() === coopValue);
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No se encontraron registros</td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${window.helpers.formatDate(item.fecha)}</td>
            <td>Galpón ${item.galpon}</td>
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${item.responsable}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-id="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Load stock data
function loadStockData() {
    const tableBody = document.querySelector('#stockTable tbody');
    if (!tableBody) return;
    
    // Mock stock data
    const stockData = [
        { tipo: "Concentrado", cantidad: 850, fechaCompra: "2023-11-20", fechaVencimiento: "2024-05-20", proveedor: "Nutriaves" },
        { tipo: "Maíz", cantidad: 650, fechaCompra: "2023-11-15", fechaVencimiento: "2024-04-15", proveedor: "Agroinsumos" },
        { tipo: "Mixto", cantidad: 350, fechaCompra: "2023-11-10", fechaVencimiento: "2024-03-10", proveedor: "Nutriaves" }
    ];
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    stockData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${window.helpers.formatDate(item.fechaCompra)}</td>
            <td>${window.helpers.formatDate(item.fechaVencimiento)}</td>
            <td>${item.proveedor}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-id="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Filter button
    const filterButton = document.getElementById('filterFeedingButton');
    if (filterButton) {
        filterButton.addEventListener('click', loadFeedingData);
    }
    
    // Export button
    const exportButton = document.getElementById('exportFeedingButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportFeeding);
    }
    
    // New feeding button
    const newFeedingButton = document.getElementById('newFeedingButton');
    if (newFeedingButton) {
        newFeedingButton.addEventListener('click', function() {
            // Scroll to form
            const form = document.getElementById('addFeedingForm');
            if (form) {
                form.reset();
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add stock button
    const addStockButton = document.getElementById('addStockButton');
    if (addStockButton) {
        addStockButton.addEventListener('click', function() {
            // In a real app, this would open a modal to add stock
            alert('Funcionalidad para agregar stock en desarrollo');
        });
    }
    
    // Add feeding form
    const addFeedingForm = document.getElementById('addFeedingForm');
    if (addFeedingForm) {
        addFeedingForm.addEventListener('submit', handleAddFeeding);
    }
}

// Add action button listeners
function addActionButtonListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('#feedingTable .btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editFeeding(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#feedingTable .btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteFeeding(id);
        });
    });
}

// Handle add feeding
function handleAddFeeding(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const fecha = form.querySelector('#feedingDate').value;
    const galpon = form.querySelector('#feedingCoop').value;
    const tipo = form.querySelector('#feedingType').value;
    const cantidad = form.querySelector('#feedingQuantity').value;
    const responsable = form.querySelector('#feedingResponsible').value;
    const observaciones = form.querySelector('#feedingNotes').value;
    
    // Validate data
    if (!fecha || !galpon || !tipo || !cantidad || !responsable) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Validate with validation.js
    if (!window.validation.isValidNumber(cantidad, 1, 1000)) {
        alert('La cantidad debe ser un número entre 1 y 1000');
        return;
    }
    
    // In a real app, this would add the data to the database
    alert(`Registro de alimentación agregado:\nFecha: ${fecha}\nGalpón: ${galpon}\nTipo: ${tipo}\nCantidad: ${cantidad} kg\nResponsable: ${responsable}`);
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Registro de alimentación agregado con éxito', 'success');
    
    // Reload data
    loadFeedingData();
}

// Edit feeding
function editFeeding(id) {
    // In a real app, this would get the data from the database and fill the form
    alert(`Editar registro de alimentación con ID: ${id}`);
}

// Delete feeding
function deleteFeeding(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        // In a real app, this would delete the data from the database
        alert(`Registro de alimentación eliminado con ID: ${id}`);
        
        // Show success message
        showNotification('Registro eliminado con éxito', 'success');
        
        // Reload data
        loadFeedingData();
    }
}

// Export feeding
function exportFeeding() {
    // In a real app, this would export to CSV or PDF
    alert('Funcionalidad de exportación en desarrollo');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close button event
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}