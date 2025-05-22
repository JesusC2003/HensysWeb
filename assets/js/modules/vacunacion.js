/**
 * Vaccination Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load upcoming vaccinations
    loadUpcomingVaccinations();
    
    // Load vaccination history
    loadVaccinationHistory();
    
    // Set up event listeners
    setupEventListeners();
});

// Load upcoming vaccinations
function loadUpcomingVaccinations() {
    const upcomingList = document.getElementById('upcomingVaccinations');
    if (!upcomingList) return;
    
    // Get vaccinations data
    const vaccinations = window.appData.vaccinations;
    
    // Clear list
    upcomingList.innerHTML = '';
    
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
            <div class="upcoming-actions">
                <button class="btn btn-sm btn-outline">
                    <i class="fas fa-check"></i> Completar
                </button>
                <button class="btn btn-sm btn-outline">
                    <i class="fas fa-calendar-alt"></i> Reprogramar
                </button>
            </div>
        `;
        
        upcomingList.appendChild(item);
    });
}

// Load vaccination history
function loadVaccinationHistory() {
    const tableBody = document.querySelector('#vaccinationHistoryTable tbody');
    if (!tableBody) return;
    
    // Mock vaccination history data
    const historyData = [
        { vacuna: "Newcastle", galpon: 2, aves: 150, fecha: "2023-11-15", responsable: "Juan Pérez", estado: "Completado" },
        { vacuna: "Bronquitis", galpon: 1, aves: 120, fecha: "2023-11-10", responsable: "María López", estado: "Completado" },
        { vacuna: "Marek", galpon: 3, aves: 100, fecha: "2023-11-05", responsable: "Juan Pérez", estado: "Completado" },
        { vacuna: "Gumboro", galpon: 4, aves: 90, fecha: "2023-10-28", responsable: "Carlos Gómez", estado: "Completado" },
        { vacuna: "Viruela", galpon: 5, aves: 110, fecha: "2023-10-20", responsable: "María López", estado: "Completado" }
    ];
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    historyData.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.vacuna}</td>
            <td>${item.galpon}</td>
            <td>${item.aves}</td>
            <td>${window.helpers.formatDate(item.fecha)}</td>
            <td>${item.responsable}</td>
            <td><span class="status active">${item.estado}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Set up event listeners
function setupEventListeners() {
    // New vaccination button
    const newVaccinationButton = document.getElementById('newVaccinationButton');
    if (newVaccinationButton) {
        newVaccinationButton.addEventListener('click', function() {
            // Scroll to form
            const form = document.getElementById('addVaccinationForm');
            if (form) {
                form.reset();
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add vaccination form
    const addVaccinationForm = document.getElementById('addVaccinationForm');
    if (addVaccinationForm) {
        addVaccinationForm.addEventListener('submit', handleAddVaccination);
    }
}

// Handle add vaccination
function handleAddVaccination(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const vacuna = form.querySelector('#vaccinationType').value;
    const galpon = form.querySelector('#vaccinationCoop').value;
    const aves = form.querySelector('#vaccinationBirds').value;
    const fecha = form.querySelector('#vaccinationDate').value;
    const responsable = form.querySelector('#vaccinationResponsible').value;
    const observaciones = form.querySelector('#vaccinationNotes').value;
    
    // Validate data
    if (!vacuna || !galpon || !aves || !fecha || !responsable) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Create new vaccination
    const newVaccination = {
        id: window.helpers.generateId(),
        title: `Vacuna ${vacuna}`,
        subtitle: `Galpón ${galpon} - ${aves} aves`,
        date: fecha
    };
    
    // Add to data
    window.appData.vaccinations.push(newVaccination);
    
    // Reload upcoming vaccinations
    loadUpcomingVaccinations();
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Vacunación programada con éxito', 'success');
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