/**
 * Animal Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load animals data
    loadAnimalsData();
    
    // Load health data
    loadHealthData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load animals data
function loadAnimalsData() {
    const tableBody = document.querySelector('#animalsTable tbody');
    if (!tableBody) return;
    
    // Mock animals data
    const animalsData = [
        { id: "L001", tipo: "Ponedora", cantidad: 150, fechaIngreso: "2023-10-15", edad: 16, galpon: 1, estado: "Activo" },
        { id: "L002", tipo: "Engorde", cantidad: 200, fechaIngreso: "2023-10-20", edad: 8, galpon: 5, estado: "Activo" },
        { id: "L003", tipo: "Reproductora", cantidad: 80, fechaIngreso: "2023-09-10", edad: 24, galpon: 8, estado: "Activo" },
        { id: "L004", tipo: "Ponedora", cantidad: 120, fechaIngreso: "2023-11-05", edad: 12, galpon: 2, estado: "Activo" },
        { id: "L005", tipo: "Engorde", cantidad: 180, fechaIngreso: "2023-11-10", edad: 6, galpon: 6, estado: "Activo" },
        { id: "L006", tipo: "Ponedora", cantidad: 140, fechaIngreso: "2023-11-15", edad: 10, galpon: 3, estado: "Activo" },
        { id: "L007", tipo: "Engorde", cantidad: 160, fechaIngreso: "2023-11-20", edad: 4, galpon: 7, estado: "Activo" }
    ];
    
    // Get filter values
    const typeFilter = document.getElementById('animalTypeFilter');
    const ageFilter = document.getElementById('animalAgeFilter');
    const coopFilter = document.getElementById('animalCoopFilter');
    
    const typeValue = typeFilter ? typeFilter.value : 'all';
    const ageValue = ageFilter ? ageFilter.value : 'all';
    const coopValue = coopFilter ? coopFilter.value : 'all';
    
    // Filter data
    let filteredData = [...animalsData];
    
    if (typeValue !== 'all') {
        filteredData = filteredData.filter(item => item.tipo === typeValue);
    }
    
    if (ageValue !== 'all') {
        // Parse age range
        const [minAge, maxAge] = ageValue.split('-');
        if (maxAge) {
            filteredData = filteredData.filter(item => item.edad >= parseInt(minAge) && item.edad <= parseInt(maxAge));
        } else {
            // For 21+ case
            const min = parseInt(minAge.replace('+', ''));
            filteredData = filteredData.filter(item => item.edad >= min);
        }
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
                <td colspan="8" class="text-center">No se encontraron registros</td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Determine status class
        let statusClass = 'active';
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${window.helpers.formatDate(item.fechaIngreso)}</td>
            <td>${item.edad}</td>
            <td>Galpón ${item.galpon}</td>
            <td><span class="status ${statusClass}">${item.estado}</span></td>
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

// Load health data
function loadHealthData() {
    const tableBody = document.querySelector('#healthTable tbody');
    if (!tableBody) return;
    
    // Mock health data
    const healthData = [
        { fecha: "2023-11-25", lote: "L001", tipo: "Mortalidad", cantidad: 2, causa: "Enfermedad respiratoria", tratamiento: "Antibióticos", responsable: "Juan Pérez" },
        { fecha: "2023-11-24", lote: "L002", tipo: "Mortalidad", cantidad: 3, causa: "Estrés por calor", tratamiento: "N/A", responsable: "María López" },
        { fecha: "2023-11-23", lote: "L004", tipo: "Enfermedad", cantidad: 5, causa: "Parásitos", tratamiento: "Desparasitante", responsable: "Juan Pérez" },
        { fecha: "2023-11-22", lote: "L005", tipo: "Mortalidad", cantidad: 2, causa: "Desconocida", tratamiento: "N/A", responsable: "Carlos Gómez" },
        { fecha: "2023-11-21", lote: "L006", tipo: "Enfermedad", cantidad: 8, causa: "Infección", tratamiento: "Antibióticos", responsable: "María López" }
    ];
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    healthData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${window.helpers.formatDate(item.fecha)}</td>
            <td>${item.lote}</td>
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>${item.causa}</td>
            <td>${item.tratamiento}</td>
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
}

// Set up event listeners
function setupEventListeners() {
    // Filter button
    const filterButton = document.getElementById('filterAnimalsButton');
    if (filterButton) {
        filterButton.addEventListener('click', loadAnimalsData);
    }
    
    // Export button
    const exportButton = document.getElementById('exportAnimalsButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportAnimals);
    }
    
    // New animal button
    const newAnimalButton = document.getElementById('newAnimalButton');
    if (newAnimalButton) {
        newAnimalButton.addEventListener('click', function() {
            // Scroll to form
            const form = document.getElementById('addAnimalForm');
            if (form) {
                form.reset();
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // New health record button
    const newHealthRecordButton = document.getElementById('newHealthRecordButton');
    if (newHealthRecordButton) {
        newHealthRecordButton.addEventListener('click', function() {
            // In a real app, this would open a modal to add a health record
            alert('Funcionalidad para agregar registro de salud en desarrollo');
        });
    }
    
    // Add animal form
    const addAnimalForm = document.getElementById('addAnimalForm');
    if (addAnimalForm) {
        addAnimalForm.addEventListener('submit', handleAddAnimal);
    }
}

// Add action button listeners
function addActionButtonListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('#animalsTable .btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewAnimal(id);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('#animalsTable .btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editAnimal(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#animalsTable .btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteAnimal(id);
        });
    });
}

// Handle add animal
function handleAddAnimal(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const tipo = form.querySelector('#animalType').value;
    const cantidad = form.querySelector('#animalQuantity').value;
    const fechaIngreso = form.querySelector('#animalEntryDate').value;
    const edad = form.querySelector('#animalAge').value;
    const galpon = form.querySelector('#animalCoop').value;
    const raza = form.querySelector('#animalBreed').value;
    const proveedor = form.querySelector('#animalProvider').value;
    const observaciones = form.querySelector('#animalNotes').value;
    
    // Validate data
    if (!tipo || !cantidad || !fechaIngreso || !edad || !galpon) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Validate with validation.js
    if (!window.validation.isValidNumber(cantidad, 1, 1000)) {
        alert('La cantidad debe ser un número entre 1 y 1000');
        return;
    }
    
    if (!window.validation.isValidNumber(edad, 0, 100)) {
        alert('La edad debe ser un número entre 0 y 100');
        return;
    }
    
    // Generate ID
    const id = `L${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // In a real app, this would add the data to the database
    alert(`Lote registrado:\nID: ${id}\nTipo: ${tipo}\nCantidad: ${cantidad}\nFecha: ${fechaIngreso}\nEdad: ${edad} semanas\nGalpón: ${galpon}`);
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Lote registrado con éxito', 'success');
    
    // Reload data
    loadAnimalsData();
}

// View animal
function viewAnimal(id) {
    // In a real app, this would get the data from the database and show details
    alert(`Ver detalles del lote con ID: ${id}`);
}

// Edit animal
function editAnimal(id) {
    // In a real app, this would get the data from the database and fill the form
    alert(`Editar lote con ID: ${id}`);
}

// Delete animal
function deleteAnimal(id) {
    if (confirm('¿Está seguro de que desea eliminar este lote?')) {
        // In a real app, this would delete the data from the database
        alert(`Lote eliminado con ID: ${id}`);
        
        // Show success message
        showNotification('Lote eliminado con éxito', 'success');
        
        // Reload data
        loadAnimalsData();
    }
}

// Export animals
function exportAnimals() {
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