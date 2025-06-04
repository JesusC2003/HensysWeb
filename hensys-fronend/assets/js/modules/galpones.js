/**
 * Coops Module
 */

// Variables globales para paginación
let currentTablePage = 1;
let currentCardsPage = 1;
const tableItemsPerPage = 10;
const cardsItemsPerPage = 6;
const API_BASE_URL = 'http://localhost:3000';



document.addEventListener('DOMContentLoaded', function() {
    cargarGalponesDesdeBackend();
    
    // Set up event listeners
    setupEventListeners();
});


// Modificar la función cargarGalponesDesdeBackend
async function cargarGalponesDesdeBackend() {
    try {
        // Obtener galpones (con nombre de granja) y lotes en paralelo
        const [galponesResponse, lotesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/galpones`),
            fetch(`${API_BASE_URL}/lotes-animales`)
        ]);

        if (!galponesResponse.ok || !lotesResponse.ok) {
            throw new Error('Error al obtener datos');
        }

        const galponesData = await galponesResponse.json();
        const lotesData = await lotesResponse.json();

        // Calcular ocupación por galpón
        const ocupacionPorGalpon = {};
        lotesData.forEach(lote => {
            if (lote.IdGalpon) {
                if (!ocupacionPorGalpon[lote.IdGalpon]) {
                    ocupacionPorGalpon[lote.IdGalpon] = 0;
                }
                ocupacionPorGalpon[lote.IdGalpon] += lote.cantidaAnimal || 0;
            }
        });

        window.appData.coops = galponesData.map(item => ({
            id: item.IdGalpon,
            numero: item.Numero || item.IdGalpon,
            tipo: item.Tipo || 'Desconocido',
            capacidad: item.CapacidadMax,
            ocupacion: ocupacionPorGalpon[item.IdGalpon] || 0,
            estado: item.Estado,
            dimensiones: item.Dimensiones || 0,
            ubicacion: item.Ubicacion || '',
            observaciones: item.Observaciones || '',
            granja: item.GranjaNombre || 'No especificada' // Usamos el nombre de la granja
        }));

        currentTablePage = 1;
        currentCardsPage = 1;
        loadCoopsData();
        loadCoopCards();
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Error al cargar datos: ${error.message}`, 'error');
    }
}

function loadCoopsData() {
    const tableBody = document.querySelector('#coopsTable tbody');
    if (!tableBody) return;
    
    const coopsData = window.appData.coops || [];
    
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
        filteredData = filteredData.filter(item => item.estado === statusValue);
    }
    
    // Calcular datos paginados para tabla
    const totalTablePages = Math.ceil(filteredData.length / tableItemsPerPage);
    const tableStartIndex = (currentTablePage - 1) * tableItemsPerPage;
    const paginatedTableData = filteredData.slice(tableStartIndex, tableStartIndex + tableItemsPerPage);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    paginatedTableData.forEach((item) => {
        const row = document.createElement('tr');
        
        const occupationPercentage = Math.round((item.ocupacion / item.capacidad) * 100);
        
        let statusClass = 'active';
        if (item.estado === 'Mantenimiento') {
            statusClass = 'warning';
        } else if (item.estado === 'Inactivo') {
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
            <td><span class="status ${statusClass}">${item.estado}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-view" data-id="${item.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionButtonListeners();
    
    // Actualizar controles de paginación para tabla
    updatePaginationControls('table', filteredData.length);
}

// Modificar loadCoopCards (paginación para cartas)
function loadCoopCards() {
    const coopCards = document.getElementById('coopCards');
    if (!coopCards) return;
    
    const coopsData = window.appData.coops || [];
    
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
        filteredData = filteredData.filter(item => item.estado === statusValue);
    }
    
    // Calcular datos paginados para cartas
    const totalCardsPages = Math.ceil(filteredData.length / cardsItemsPerPage);
    const cardsStartIndex = (currentCardsPage - 1) * cardsItemsPerPage;
    const paginatedCardsData = filteredData.slice(cardsStartIndex, cardsStartIndex + cardsItemsPerPage);
    
    // Clear cards
    coopCards.innerHTML = '';
    
    // Add cards
    paginatedCardsData.forEach((item) => {
        const occupationPercentage = item.capacidad > 0 
            ? Math.min(Math.round((item.ocupacion / item.capacidad) * 100), 100) // No más del 100%
            : 0;
        
        let statusClass = 'active';
        let statusText = item.estado;
        
        if (item.estado === 'Mantenimiento') {
            statusClass = 'warning';
        } else if (item.estado === 'Inactivo') {
            statusClass = 'inactive';
        }
        
        // Determinar clase de alerta según ocupación
        let progressClass = '';
        if (occupationPercentage >= 90) {
            progressClass = 'danger';
        } else if (occupationPercentage >= 75) {
            progressClass = 'warning';
        }
        
        const card = document.createElement('div');
        card.className = 'coop-card';
        card.setAttribute('data-id', item.id);
        
        // En la función loadCoopCards, dentro del forEach:
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
                    <span class="value">${item.ocupacion} animales</span>
                </div>
                <div class="coop-info-item">
                    <span class="label">Granja:</span>
                    <span class="value">${item.granja}</span> <!-- Aquí se muestra el nombre -->
                </div>
            </div>
            <div class="coop-progress">
                <div class="progress-bar ${progressClass}">
                    <div class="progress-bar-fill" style="width: ${occupationPercentage}%">
                        <span class="progress-percent">${occupationPercentage}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="coop-card-footer">
            <button class="btn btn-sm btn-outline btn-view" data-id="${item.id}">
                <i class="fas fa-eye"></i> Ver
            </button>
            <button class="btn btn-sm btn-outline btn-edit" data-id="${item.id}">
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
    
    // Actualizar controles de paginación para cartas
    updatePaginationControls('cards', filteredData.length);
}

// Función para actualizar los controles de paginación
function updatePaginationControls(type, totalItems) {
    const itemsPerPage = type === 'table' ? tableItemsPerPage : cardsItemsPerPage;
    const currentPage = type === 'table' ? currentTablePage : currentCardsPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Crear o actualizar controles de paginación
    let paginationContainer = document.getElementById(`${type}PaginationControls`);

    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = `${type}PaginationControls`;
        paginationContainer.className = 'pagination-controls';

        const existingControls = document.querySelectorAll(`#${type}PaginationControls`);
        existingControls.forEach(el => el.remove()); // 🔥 eliminar duplicados antes

        if (type === 'table') {
            const tableContainer = document.querySelector('.table-responsive');
            if (tableContainer) {
                tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
            }
        } else {
            const cardsContainer = document.getElementById('coopCards');
            if (cardsContainer) {
                cardsContainer.parentNode.insertBefore(paginationContainer, cardsContainer.nextSibling);
            }
        }
    } else {
        // Limpia su contenido
        paginationContainer.innerHTML = '';
    }

    
    paginationContainer.innerHTML = `
        <button class="btn btn-sm btn-outline" id="${type}FirstPage" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>
        <button class="btn btn-sm btn-outline" id="${type}PrevPage" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span class="page-info">Página ${currentPage} de ${totalPages}</span>
        <button class="btn btn-sm btn-outline" id="${type}NextPage" ${currentPage >= totalPages ? 'disabled' : ''}>
            Siguiente <i class="fas fa-chevron-right"></i>
        </button>
        <button class="btn btn-sm btn-outline" id="${type}LastPage" ${currentPage >= totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>
    `;
    
    // Agregar event listeners a los botones
    document.getElementById(`${type}FirstPage`)?.addEventListener('click', () => {
        if (type === 'table') {
            currentTablePage = 1;
            loadCoopsData();
        } else {
            currentCardsPage = 1;
            loadCoopCards();
        }
    });
    
    document.getElementById(`${type}PrevPage`)?.addEventListener('click', () => {
        if (type === 'table') {
            if (currentTablePage > 1) {
                currentTablePage--;
                loadCoopsData();
            }
        } else {
            if (currentCardsPage > 1) {
                currentCardsPage--;
                loadCoopCards();
            }
        }
    });
    
    document.getElementById(`${type}NextPage`)?.addEventListener('click', () => {
        if (type === 'table') {
            if (currentTablePage < totalPages) {
                currentTablePage++;
                loadCoopsData();
            }
        } else {
            if (currentCardsPage < totalPages) {
                currentCardsPage++;
                loadCoopCards();
            }
        }
    });
    
    document.getElementById(`${type}LastPage`)?.addEventListener('click', () => {
        if (type === 'table') {
            currentTablePage = totalPages;
            loadCoopsData();
        } else {
            currentCardsPage = totalPages;
            loadCoopCards();
        }
    });
}

// Modificar setupEventListeners para incluir paginación
function setupEventListeners() {
    // Filter button
    const filterButton = document.getElementById('filterCoopsButton');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            currentTablePage = 1;
            currentCardsPage = 1;
            loadCoopsData();
            loadCoopCards();
        });
    }
    
    // New coop button
    const newCoopButton = document.getElementById('newCoopButton');
    if (newCoopButton) {
        newCoopButton.addEventListener('click', function() {
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
        addCoopForm.addEventListener('submit', manejarFormularioGalpon);
    }
    
    // Event listeners para cambios en los filtros (opcional)
    document.getElementById('coopTypeFilter')?.addEventListener('change', function() {
        currentPage = 1;
        loadCoopsData();
        loadCoopCards();
    });
    
    document.getElementById('coopStatusFilter')?.addEventListener('change', function() {
        currentPage = 1;
        loadCoopsData();
        loadCoopCards();
    });
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

async function manejarFormularioGalpon(event) {
    event.preventDefault();

    const form = event.target;
    const numero = form.querySelector('#coopNumber').value;
    const tipo = form.querySelector('#coopType').value;
    const capacidad = form.querySelector('#coopCapacity').value;
    const estado = form.querySelector('#coopStatus').value;
    const nombreGranja = form.querySelector('#coopLocation').value.trim(); // nombre de la granja
    const observaciones = form.querySelector('#coopNotes').value;

    if (!numero || !tipo || !capacidad || !estado || !nombreGranja) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    if (!window.validation.isValidNumber(numero, 1, 100)) {
        alert('El número de galpón debe ser entre 1 y 100');
        return;
    }

    if (!window.validation.isValidNumber(capacidad, 10, 1000)) {
        alert('La capacidad debe ser entre 10 y 1000');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const editId = submitButton ? submitButton.getAttribute('data-edit-id') : null;

    try {
        // Buscar ID de la granja por nombre
        const responseGranja = await fetch(`${API_BASE_URL}/granjas`);
        const granjas = await responseGranja.json();
        const granja = granjas.find(g => g.Nombre?.toLowerCase() === nombreGranja.toLowerCase());

        if (!granja) {
            alert('La granja especificada no existe');
            return;
        }

        const galponPayload = {
            Numero: parseInt(numero),
            Tipo: tipo,
            CapacidadMax: parseInt(capacidad),
            Estado: estado,
            Observaciones: observaciones,
            id_Granja: granja.IdGranja
        };

        if (editId) {
            // PUT → actualizar galpón
            const response = await fetch(`${API_BASE_URL}/galpones/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galponPayload)
            });

            if (!response.ok) throw new Error('Error al actualizar galpón');

            showNotification('Galpón actualizado con éxito', 'success');
        } else {
            // POST → crear nuevo galpón
            const response = await fetch(`${API_BASE_URL}/galpones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galponPayload)
            });

            if (!response.ok) throw new Error('Error al registrar galpón');

            showNotification('Galpón registrado con éxito', 'success');
        }

        cargarGalponesDesdeBackend();
        form.reset();
        submitButton.textContent = 'Registrar Galpón';
        submitButton.removeAttribute('data-edit-id');

    } catch (error) {
        console.error('❌ Error en galpón:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// View coop
function viewCoop(id) {
    const coop = window.appData.coops.find(c => c.id == id);
    if (!coop) {
        showNotification('Galpón no encontrado', 'error');
        return;
    }

    const occupationPercentage = Math.round((coop.ocupacion / coop.capacidad) * 100);

    alert(`
        Galpón ${coop.numero}
        Tipo: ${coop.tipo}
        Capacidad: ${coop.capacidad}
        Ocupación: ${coop.ocupacion} (${occupationPercentage}%)
        Estado: ${coop.estado}
        Granja: ${coop.granja || 'No especificada'}
        Observaciones: ${coop.observaciones || 'Sin observaciones'}
    `);
}

// Edit coop
function editCoop(id) {
    const coop = window.appData.coops.find(c => c.id == id);
    if (!coop) {
        showNotification('Galpón no encontrado', 'error');
        return;
    }

    const form = document.getElementById('addCoopForm');
    if (form) {
        form.querySelector('#coopNumber').value = coop.numero;
        form.querySelector('#coopType').value = coop.tipo;
        form.querySelector('#coopCapacity').value = coop.capacidad;
        form.querySelector('#coopStatus').value = coop.estado || 'Activo';
        form.querySelector('#coopLocation').value = coop.granja || ''; // nombre de la granja
        form.querySelector('#coopNotes').value = coop.observaciones || '';

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Galpón';
            submitButton.setAttribute('data-edit-id', coop.id);
        }

        form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete coop
async function eliminarAnimalesDeLote(idLote) {
    try {
        const animalesRes = await fetch(`${API_BASE_URL}/animales/lote/${idLote}`);
        let animales = [];

        if (animalesRes.status === 200) {
            animales = await animalesRes.json();
        } else if (animalesRes.status !== 404) {
            showNotification(`Error al obtener animales del lote ${idLote}`, 'error');
            return false;
        }

        for (const animal of animales) {
            const deleteRes = await fetch(`${API_BASE_URL}/animales/${animal.IdAnimal}`, {
                method: 'DELETE'
            });
            if (!deleteRes.ok) {
                showNotification(`No se pudo eliminar el animal ${animal.IdAnimal}`, 'error');
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error(error);
        showNotification(`Error inesperado al eliminar animales del lote ${idLote}`, 'error');
        return false;
    }
}

async function eliminarLotesDeGalpon(idGalpon) {
    try {
        const lotesRes = await fetch(`${API_BASE_URL}/lotes-animales/galpon/${idGalpon}`);
        let lotes = [];

        if (lotesRes.status === 200) {
            lotes = await lotesRes.json();
        } else if (lotesRes.status !== 404) {
            showNotification('No se pudieron obtener los lotes del galpón', 'error');
            return false;
        }

        if (lotes.length === 0) {
            return true; // No hay lotes que eliminar
        }

        const confirmar = confirm(
            `Este galpón tiene ${lotes.length} lote(s) con animales.\n` +
            `Si continúas, se eliminarán también los lotes y los animales.\n¿Deseas continuar?`
        );

        if (!confirmar) return false;

        for (const lote of lotes) {
            const ok = await eliminarAnimalesDeLote(lote.IdLote);
            if (!ok) return false;

            const deleteLoteRes = await fetch(`${API_BASE_URL}/lotes-animales/${lote.IdLote}`, {
                method: 'DELETE'
            });
            if (!deleteLoteRes.ok) {
                showNotification(`No se pudo eliminar el lote ${lote.IdLote}`, 'error');
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error(error);
        showNotification('Error inesperado al eliminar lotes del galpón', 'error');
        return false;
    }
}

async function deleteCoop(id) {
    const lotesYAnimalesEliminados = await eliminarLotesDeGalpon(id);
    if (!lotesYAnimalesEliminados) return;

    try {
        const deleteGalponRes = await fetch(`${API_BASE_URL}/galpones/${id}`, {
            method: 'DELETE'
        });

        if (!deleteGalponRes.ok) {
            showNotification('No se pudo eliminar el galpón', 'error');
            return;
        }

        await cargarGalponesDesdeBackend();
        showNotification('Galpón y datos asociados eliminados con éxito', 'success');
    } catch (error) {
        console.error(error);
        showNotification('Error inesperado al eliminar el galpón', 'error');
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