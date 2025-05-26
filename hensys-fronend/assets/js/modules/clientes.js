/**
 * Clients Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load clients data
    loadClientsData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load clients data
function loadClientsData() {
    const tableBody = document.querySelector('#clientsTable tbody');
    if (!tableBody) return;
    
    // Get clients data
    const clientsData = window.appData.clients;
    
    // Get search value
    const searchInput = document.getElementById('clientSearch');
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter data
    let filteredData = [...clientsData];
    if (searchValue) {
        filteredData = clientsData.filter(item => 
            item.nombre.toLowerCase().includes(searchValue) || 
            item.telefono.toLowerCase().includes(searchValue) ||
            (item.email && item.email.toLowerCase().includes(searchValue))
        );
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No se encontraron clientes</td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.telefono}</td>
            <td>${item.email || '-'}</td>
            <td>${item.direccion || '-'}</td>
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

// Set up event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('clientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', window.helpers.debounce(loadClientsData, 300));
    }
    
    // Filter button
    const filterButton = document.getElementById('filterClientsButton');
    if (filterButton) {
        filterButton.addEventListener('click', loadClientsData);
    }
    
    // Export button
    const exportButton = document.getElementById('exportClientsButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportClients);
    }
    
    // New client button
    const newClientButton = document.getElementById('newClientButton');
    if (newClientButton) {
        newClientButton.addEventListener('click', function() {
            // Reset form
            const form = document.getElementById('addClientForm');
            if (form) {
                form.reset();
                
                // Change button text
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.textContent = 'Registrar Cliente';
                    submitButton.removeAttribute('data-edit-id');
                }
                
                // Scroll to form
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add client form
    const addClientForm = document.getElementById('addClientForm');
    if (addClientForm) {
        addClientForm.addEventListener('submit', handleAddClient);
    }
}

// Add action button listeners
function addActionButtonListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewClient(id);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editClient(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteClient(id);
        });
    });
}

// Handle add client
function handleAddClient(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const nombre = form.querySelector('#clientName').value;
    const telefono = form.querySelector('#clientPhone').value;
    const email = form.querySelector('#clientEmail').value;
    const direccion = form.querySelector('#clientAddress').value;
    const tipo = form.querySelector('#clientType').value;
    const notas = form.querySelector('#clientNotes').value;
    
    // Validate data
    if (!nombre || !telefono) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Check if editing
    const submitButton = form.querySelector('button[type="submit"]');
    const editId = submitButton ? submitButton.getAttribute('data-edit-id') : null;
    
    if (editId) {
        // Update client
        window.appData.clients[editId] = {
            ...window.appData.clients[editId],
            nombre,
            telefono,
            email,
            direccion,
            tipo,
            notas
        };
        
        // Reset button
        submitButton.textContent = 'Registrar Cliente';
        submitButton.removeAttribute('data-edit-id');
        
        // Show success message
        showNotification('Cliente actualizado con éxito', 'success');
    } else {
        // Create new client
        const newClient = {
            id: window.appData.clients.length + 1,
            nombre,
            telefono,
            email,
            direccion,
            tipo,
            notas
        };
        
        // Add to data
        window.appData.clients.push(newClient);
        
        // Show success message
        showNotification('Cliente registrado con éxito', 'success');
    }
    
    // Reload table
    loadClientsData();
    
    // Reset form
    form.reset();
}

// View client
function viewClient(id) {
    // Get client data
    const client = window.appData.clients[id];
    
    // Show client details
    alert(`
        Nombre: ${client.nombre}
        Teléfono: ${client.telefono}
        Email: ${client.email || '-'}
        Dirección: ${client.direccion || '-'}
    `);
    
    // In a real app, this would open a modal with client details
}

// Edit client
function editClient(id) {
    // Get client data
    const client = window.appData.clients[id];
    
    // Fill form
    const form = document.getElementById('addClientForm');
    if (form) {
        form.querySelector('#clientName').value = client.nombre;
        form.querySelector('#clientPhone').value = client.telefono;
        form.querySelector('#clientEmail').value = client.email || '';
        form.querySelector('#clientAddress').value = client.direccion || '';
        form.querySelector('#clientType').value = client.tipo || 'individual';
        form.querySelector('#clientNotes').value = client.notas || '';
        
        // Change button text
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Cliente';
            submitButton.setAttribute('data-edit-id', id);
        }
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete client
function deleteClient(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        // Remove from data
        window.appData.clients.splice(id, 1);
        
        // Reload table
        loadClientsData();
        
        // Show success message
        showNotification('Cliente eliminado con éxito', 'success');
    }
}

// Export clients
function exportClients() {
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