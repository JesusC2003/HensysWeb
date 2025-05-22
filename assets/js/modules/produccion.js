/**
 * Production Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load production data
    loadProductionData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load production data
function loadProductionData() {
    const tableBody = document.querySelector('#productionTable tbody');
    if (!tableBody) return;
    
    // Get production data
    const productionData = window.appData.production;
    
    // Get filter value
    const filterSelect = document.getElementById('productionFilter');
    const filterValue = filterSelect ? filterSelect.value : 'all';
    
    // Filter data
    let filteredData = [...productionData];
    if (filterValue !== 'all') {
        filteredData = productionData.filter(item => item.tipo === filterValue);
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${item.observaciones}</td>
            <td>${item.galpon}</td>
            <td>${window.helpers.formatDate(item.fecha)}</td>
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

// Set up event listeners
function setupEventListeners() {
    // Filter change
    const filterSelect = document.getElementById('productionFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', loadProductionData);
    }
    
    // Add production form
    const addProductionForm = document.getElementById('addProductionForm');
    if (addProductionForm) {
        addProductionForm.addEventListener('submit', handleAddProduction);
    }
}

// Handle add production
function handleAddProduction(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const tipo = form.querySelector('#productionType').value;
    const cantidad = parseInt(form.querySelector('#productionQuantity').value);
    const observaciones = form.querySelector('#productionObservations').value;
    const galpon = parseInt(form.querySelector('#productionCoop').value);
    const fecha = form.querySelector('#productionDate').value;
    
    // Validate data
    if (!tipo || !cantidad || !galpon || !fecha) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Create new production entry
    const newProduction = {
        tipo,
        cantidad,
        observaciones: observaciones || 'Sin observaciones',
        galpon,
        fecha
    };
    
    // Add to data
    window.appData.production.unshift(newProduction);
    
    // Reload table
    loadProductionData();
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Producción registrada con éxito', 'success');
}

// Add action button listeners
function addActionButtonListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editProduction(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteProduction(id);
        });
    });
}

// Edit production
function editProduction(id) {
    // Get production data
    const production = window.appData.production[id];
    
    // Fill form
    const form = document.getElementById('addProductionForm');
    if (form) {
        form.querySelector('#productionType').value = production.tipo;
        form.querySelector('#productionQuantity').value = production.cantidad;
        form.querySelector('#productionObservations').value = production.observaciones;
        form.querySelector('#productionCoop').value = production.galpon;
        form.querySelector('#productionDate').value = production.fecha;
        
        // Change button text
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Producción';
            submitButton.setAttribute('data-edit-id', id);
        }
    }
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Delete production
function deleteProduction(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        // Remove from data
        window.appData.production.splice(id, 1);
        
        // Reload table
        loadProductionData();
        
        // Show success message
        showNotification('Registro eliminado con éxito', 'success');
    }
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