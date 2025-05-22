/**
 * Coops Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load coops data
    loadCoopsData();
    
    // Load coop cards
    loadCoopCards();
    
    // Set up event listeners
    setupEventListeners();
});

// Load coops data
function loadCoopsData() {
    const tableBody = document.querySelector('#coopsTable tbody');
    if (!tableBody) return;
    
    // Get coops data
    const coopsData = window.appData.coops;
    
    // Get filter values
    const typeFilter = document.getElementById('coopTypeFilter');
    const statusFilter = document.getElementById('coopStatusFilter');
    
    const typeValue = typeFilter ? typeFilter.value : 'all';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    
    // Filter data
    let filteredData = [...coopsData];
    
    if (typeValue !== 'all') {
        filteredData = filteredData.filter(item => item.tipo === typeValue);
    }
    
    if (statusValue !== 'all') {
        // In a real app, this would filter by status
        // For now, we'll just use the mock data
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Calculate occupation percentage
        const occupationPercentage = Math.round((item.ocupacion / item.capacidad) * 100);
        
        // Determine status class
        let statusClass = 'active';
        if (occupationPercentage > 90) {
            statusClass = 'warning';
        } else if (occupationPercentage < 50) {
            statusClass = 'inactive';
        }
        
        row.innerHTML = `
            <td>${item.numero}</td>
            <td>${item.tipo}</td>
            <td>${item.capacidad}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${occupationPercentage}%"></div>
                    <span>${item.ocupacion} / ${item.capacidad} (${occupationPercentage}%)</span>
                </div>
            </td>
            <td><span class="status ${statusClass}">Activo</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-view" data-id="${index}">
                        <i class="fas fa-eye"></i>
                    </button>
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

// Load coop cards
function loadCoopCards() {
    const coopCards = document.getElementById('coopCards');
    if (!coopCards) return;
    
    // Get coops data
    const coopsData = window.appData.coops;
    
    // Get filter values
    const typeFilter = document.getElementById('coopTypeFilter');
    const statusFilter = document.getElementById('coopStatusFilter');
    
    const typeValue = typeFilter ? typeFilter.value : 'all';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    
    // Filter data
    let filteredData = [...coopsData];
    
    if (typeValue !== 'all') {
        filteredData = filteredData.filter(item => item.tipo === typeValue);
    }
    
    if (statusValue !== 'all') {
        // In a real app, this would filter by status
        // For now, we'll just use the mock data
    }
    
    // Clear cards
    coopCards.innerHTML = '';
    
    // Add cards
    filteredData.forEach((item, index) => {
        // Calculate occupation percentage
        const occupationPercentage = Math.round((item.ocupacion / item.capacidad) * 100);
        
        // Determine status class
        let statusClass = 'active';
        let statusText = 'Activo';
        
        if (occupationPercentage > 90) {
            statusClass = 'warning';
            statusText = 'Casi lleno';
        } else if (occupationPercentage < 50) {
            statusClass = 'inactive';
            statusText = 'Baja ocupación';
        }
        
        // Create card
        const card = document.createElement('div');
        card.className = 'coop-card';
        card.setAttribute('data-id', index);
        
        card.innerHTML = `
            <div class="coop-card-header">
                <h3>Galpón ${item.numero}</h3>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
            <div class="coop-card-body">
                <div class="coop-info">
                    <div class="coop-info-item">
                        <span class="label">Tipo:</span>
                        <span class="value">${item.tipo}</span>
                    </div>
                    <div class="coop-info-item">
                        <span class="label">Capacidad:</span>
                        <span class="value">${item.capacidad}</span>
                    </div>
                    <div class="coop-info-item">
                        <span class="label">Ocupación:</span>
                        <span class="value">${item.ocupacion}</span>
                    </div>
                </div>
                <div class="coop-progress">
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${occupationPercentage}%"></div>
                        <span>${occupationPercentage}%</span>
                    </div>
                </div>
            </div>
            <div class="coop-card-footer">
                <button class="btn btn-sm btn-outline btn-view" data-id="${index}">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn btn-sm btn-outline btn-edit" data-id="${index}">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        `;
        
        coopCards.appendChild(card);
    });
    
    // Add event listeners to card buttons
    const viewButtons = coopCards.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewCoop(id);
        });
    });
    
    const editButtons = coopCards.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editCoop(id);
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    // Filter button
    const filterButton = document.getElementById('filterCoopsButton');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            loadCoopsData();
            loadCoopCards();
        });
    }
    
    // New coop button
    const newCoopButton = document.getElementById('newCoopButton');
    if (newCoopButton) {
        newCoopButton.addEventListener('click', function() {
            // Scroll to form
            const form = document.getElementById('addCoopForm');
            if (form) {
                form.reset();
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add coop form
    const addCoopForm = document.getElementById('addCoopForm');
    if (addCoopForm) {
        addCoopForm.addEventListener('submit', handleAddCoop);
    }
}

// Add action button listeners
function addActionButtonListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('#coopsTable .btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewCoop(id);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('#coopsTable .btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editCoop(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#coopsTable .btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteCoop(id);
        });
    });
}

// Handle add coop
function handleAddCoop(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const numero = form.querySelector('#coopNumber').value;
    const tipo = form.querySelector('#coopType').value;
    const capacidad = form.querySelector('#coopCapacity').value;
    const estado = form.querySelector('#coopStatus').value;
    const dimensiones = form.querySelector('#coopDimensions').value;
    const ubicacion = form.querySelector('#coopLocation').value;
    const observaciones = form.querySelector('#coopNotes').value;
    
    // Validate data
    if (!numero || !tipo || !capacidad || !estado) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Validate with validation.js
    if (!window.validation.isValidNumber(numero, 1, 100)) {
        alert('El número de galpón debe ser entre 1 y 100');
        return;
    }
    
    if (!window.validation.isValidNumber(capacidad, 10, 1000)) {
        alert('La capacidad debe ser entre 10 y 1000');
        return;
    }
    
    // Check if editing
    const submitButton = form.querySelector('button[type="submit"]');
    const editId = submitButton ? submitButton.getAttribute('data-edit-id') : null;
    
    if (editId) {
        // Update coop
        window.appData.coops[editId] = {
            ...window.appData.coops[editId],
            numero: parseInt(numero),
            tipo,
            capacidad: parseInt(capacidad),
            estado,
            dimensiones: dimensiones ? parseInt(dimensiones) : null,
            ubicacion,
            observaciones
        };
        
        // Reset button
        submitButton.textContent = 'Registrar Galpón';
        submitButton.removeAttribute('data-edit-id');
        
        // Show success message
        showNotification('Galpón actualizado con éxito', 'success');
    } else {
        // Create new coop
        const newCoop = {
            id: window.appData.coops.length + 1,
            numero: parseInt(numero),
            tipo,
            capacidad: parseInt(capacidad),
            ocupacion: 0, // New coops start empty
            estado,
            dimensiones: dimensiones ? parseInt(dimensiones) : null,
            ubicacion,
            observaciones
        };
        
        // Add to data
        window.appData.coops.push(newCoop);
        
        // Show success message
        showNotification('Galpón registrado con éxito', 'success');
    }
    
    // Reload data
    loadCoopsData();
    loadCoopCards();
    
    // Reset form
    form.reset();
}

// View coop
function viewCoop(id) {
    // Get coop data
    const coop = window.appData.coops[id];
    
    // Calculate occupation percentage
    const occupationPercentage = Math.round((coop.ocupacion / coop.capacidad) * 100);
    
    // Show coop details
    alert(`
        Galpón ${coop.numero}
        Tipo: ${coop.tipo}
        Capacidad: ${coop.capacidad}
        Ocupación: ${coop.ocupacion} (${occupationPercentage}%)
    `);
    
    // In a real app, this would open a modal with coop details
}

// Edit coop
function editCoop(id) {
    // Get coop data
    const coop = window.appData.coops[id];
    
    // Fill form
    const form = document.getElementById('addCoopForm');
    if (form) {
        form.querySelector('#coopNumber').value = coop.numero;
        form.querySelector('#coopType').value = coop.tipo;
        form.querySelector('#coopCapacity').value = coop.capacidad;
        form.querySelector('#coopStatus').value = coop.estado || 'Activo';
        form.querySelector('#coopDimensions').value = coop.dimensiones || '';
        form.querySelector('#coopLocation').value = coop.ubicacion || '';
        form.querySelector('#coopNotes').value = coop.observaciones || '';
        
        // Change button text
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Galpón';
            submitButton.setAttribute('data-edit-id', id);
        }
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete coop
function deleteCoop(id) {
    if (confirm('¿Está seguro de que desea eliminar este galpón?')) {
        // Remove from data
        window.appData.coops.splice(id, 1);
        
        // Reload data
        loadCoopsData();
        loadCoopCards();
        
        // Show success message
        showNotification('Galpón eliminado con éxito', 'success');
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