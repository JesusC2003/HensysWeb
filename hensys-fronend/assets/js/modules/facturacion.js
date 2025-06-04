/**
 * Módulo de Facturación - Integrado con Backend
 */

// Variable global para items de factura
let invoiceItems = [];
const API_BASE_URL = 'http://localhost:3000'; // Base URL para las APIs

// Cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    loadInvoicesData();
    setupEventListeners();
});

// Cargar facturas desde API
async function loadInvoicesData() {
    const tableBody = document.querySelector('#invoicesTable tbody');
    if (!tableBody) return;
    
    try {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Cargando facturas...</td></tr>`;

        // Obtener facturas desde API
        const response = await fetch(`${API_BASE_URL}/facturas`);
        if (!response.ok) throw new Error('Error al cargar facturas');
        const invoicesData = await response.json();

        // Obtener clientes para mapear IDs a nombres
        const clientesResponse = await fetch(`${API_BASE_URL}/clientes`);
        if (!clientesResponse.ok) throw new Error('Error al cargar clientes');
        const clientes = await clientesResponse.json();

        // Crear mapa de clientes (IdCliente -> Nombre)
        const clientesMap = {};
        clientes.forEach(cliente => {
            clientesMap[cliente.IdCliente] = cliente.Nombre;
        });

        // Aplicar filtros
        const clientFilter = document.getElementById('clientFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        const clientValue = clientFilter ? clientFilter.value : '';
        const dateValue = dateFilter ? dateFilter.value : '';
        
        let filteredData = [...invoicesData];
        
        if (clientValue) {
            filteredData = filteredData.filter(item => {
                const clienteNombre = clientesMap[item.IdCliente] || '';
                return clienteNombre.toLowerCase().includes(clientValue.toLowerCase());
            });
        }
        
        if (dateValue) {
            const filterDate = new Date(dateValue);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.Fecha);
                return itemDate.toDateString() === filterDate.toDateString();
            });
        }
        
        // Limpiar y llenar tabla
        tableBody.innerHTML = '';
        
        if (filteredData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No se encontraron facturas</td></tr>`;
            return;
        }
        
        filteredData.forEach((item) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>F-${item.IdFactura.toString().padStart(3, '0')}</td>
                <td>${clientesMap[item.IdCliente] || 'Cliente no encontrado'}</td>
                <td>${window.helpers.formatDate(item.Fecha)}</td>
                <td>${window.helpers.formatCurrency(item.Total)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon btn-view" data-id="${item.IdFactura}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-print" data-id="${item.IdFactura}">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn-icon btn-delete" data-id="${item.IdFactura}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        addActionButtonListeners();
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center error">Error al cargar facturas</td></tr>`;
        showNotification('Error al cargar facturas: ' + error.message, 'error');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtro por cliente
    const clientFilter = document.getElementById('clientFilter');
    if (clientFilter) {
        clientFilter.addEventListener('change', loadInvoicesData);
    }
    
    // Filtro por fecha
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', loadInvoicesData);
    }
    
    // Botón de filtrar
    const filterButton = document.getElementById('filterButton');
    if (filterButton) {
        filterButton.addEventListener('click', loadInvoicesData);
    }
    
    // Botón de nueva factura
    const newInvoiceButton = document.getElementById('newInvoiceButton');
    if (newInvoiceButton) {
        newInvoiceButton.addEventListener('click', openNewInvoiceModal);
    }
    
    // Botón para agregar item a factura
    const addItemButton = document.getElementById('addInvoiceItemButton');
    if (addItemButton) {
        addItemButton.addEventListener('click', addInvoiceItem);
    }
    
    // Botón para guardar factura
    const saveInvoiceButton = document.getElementById('saveInvoiceButton');
    if (saveInvoiceButton) {
        saveInvoiceButton.addEventListener('click', saveInvoice);
    }
    
    // Botones para cerrar modales
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
}

// Agregar event listeners a los botones de acción
function addActionButtonListeners() {
    // Botones de ver
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewInvoice(id);
        });
    });
    
    // Botones de imprimir
    const printButtons = document.querySelectorAll('.btn-print');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            printInvoice(id);
        });
    });
    
    // Botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteInvoice(id);
        });
    });
}

// Abrir modal para nueva factura
async function openNewInvoiceModal() {
    // Reiniciar items de factura
    invoiceItems = [];
    
    // Reiniciar formulario
    const form = document.getElementById('invoiceForm');
    if (form) {
        form.reset();
    }
    
    // Limpiar tabla de items
    const itemsTable = document.querySelector('#invoiceItemsTable tbody');
    if (itemsTable) {
        itemsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay productos agregados</td>
            </tr>
        `;
    }
    
    // Reiniciar totales
    updateInvoiceTotals();
    
    try {
        // Cargar clientes para el dropdown
        const clientSelect = document.getElementById('invoiceClient');
        if (clientSelect) {
            clientSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
            
            const response = await fetch(`${API_BASE_URL}/clientes`);
            if (!response.ok) throw new Error('Error al cargar clientes');
            const clients = await response.json();
            
            // Llenar dropdown de clientes
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.IdCliente;
                option.textContent = client.Nombre;
                clientSelect.appendChild(option);
            });
        }
        
        // Cargar productos para el dropdown
        const productSelect = document.getElementById('invoiceProduct');
        if (productSelect) {
            productSelect.innerHTML = '<option value="">Seleccione un producto</option>';
            
            // Cargar productos desde la API
            const productsResponse = await fetch(`${API_BASE_URL}/productos`);
            if (!productsResponse.ok) throw new Error('Error al cargar productos');
            const products = await productsResponse.json();

            // Verificar si hay productos disponibles
            if (products.length === 0) {
                productSelect.innerHTML = '<option value="">No hay productos disponibles</option>';
                showNotification('No hay productos registrados en el sistema', 'warning');
            } else {
                // Llenar dropdown de productos
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.IdProducto;
                    option.textContent = product.Nombre;
                    
                    // Asignar precio como atributo data
                    /*if (product.Precio) {
                        option.dataset.price = product.Precio;
                    } else {
                        console.warn(`Producto ${product.IdProducto} no tiene precio definido`);
                        option.dataset.price = '0';
                    }*/
                    
                    productSelect.appendChild(option);
                });
            }
            
            // Auto-completar precio al seleccionar producto
            productSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const priceInput = document.getElementById('invoicePrice');
                
                if (selectedOption && selectedOption.dataset.price) {
                    priceInput.value = selectedOption.dataset.price;
                    
                    // Dar foco al campo de cantidad para facilitar la entrada de datos
                    document.getElementById('invoiceQuantity').focus();
                } else {
                    priceInput.value = '';
                }
            });
        }
        
        // Establecer fecha actual por defecto
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = today;
        
        // Abrir modal
        openModal('invoiceModal');
    } catch (error) {
        console.error('Error al abrir modal de factura:', error);
        showNotification(`Error al cargar datos para nueva factura: ${error.message}`, 'error');
    }
}

// Agregar item a la factura
function addInvoiceItem() {
    // Obtener datos del formulario
    const productSelect = document.getElementById('invoiceProduct');
    const quantityInput = document.getElementById('invoiceQuantity');
    const priceInput = document.getElementById('invoicePrice');
    
    const productId = productSelect ? productSelect.value : '';
    const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
    const price = priceInput ? parseFloat(priceInput.value) : 0;
    
    // Validar datos
    if (!productId || !quantity || !price) {
        showNotification('Por favor complete todos los campos del producto', 'error');
        return;
    }
    
    if (quantity <= 0) {
        showNotification('La cantidad debe ser mayor a cero', 'error');
        return;
    }
    
    if (price <= 0) {
        showNotification('El precio debe ser mayor a cero', 'error');
        return;
    }
    
    // Obtener nombre del producto
    const productName = productSelect.options[productSelect.selectedIndex].text;
    
    // Crear nuevo item
    const newItem = {
        IdProducto: productId,
        Nombre: productName,
        Cantidad: quantity,
        PrecioUnitario: price,
        Total: quantity * price
    };
    
    // Agregar a los items
    invoiceItems.push(newItem);
    
    // Actualizar tabla de items
    updateInvoiceItemsTable();
    
    // Actualizar totales
    updateInvoiceTotals();
    
    // Reiniciar formulario de producto
    productSelect.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    productSelect.focus();
}

// Actualizar tabla de items de la factura
function updateInvoiceItemsTable() {
    const itemsTable = document.querySelector('#invoiceItemsTable tbody');
    if (!itemsTable) return;
    
    // Limpiar tabla
    itemsTable.innerHTML = '';
    
    // Mostrar mensaje si no hay items
    if (invoiceItems.length === 0) {
        itemsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay productos agregados</td>
            </tr>
        `;
        return;
    }
    
    // Llenar tabla con los items
    invoiceItems.forEach((item) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.Nombre}</td>
            <td>${item.Cantidad}</td>
            <td>${window.helpers.formatCurrency(item.PrecioUnitario)}</td>
            <td>${window.helpers.formatCurrency(item.Total)}</td>
            <td>
                <button class="btn-icon btn-delete" data-id="${item.IdProducto}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        itemsTable.appendChild(row);
    });
    
    // Agregar event listeners a los botones de eliminar
    const deleteButtons = itemsTable.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeInvoiceItem(id);
        });
    });
}

// Eliminar item de la factura
function removeInvoiceItem(id) {
    // Eliminar el item
    invoiceItems = invoiceItems.filter(item => item.IdProducto !== id);
    
    // Actualizar tabla
    updateInvoiceItemsTable();
    
    // Actualizar totales
    updateInvoiceTotals();
}

// Actualizar totales de la factura
function updateInvoiceTotals() {
    // Calcular subtotal
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.Total, 0);
    
    // Calcular impuesto (IVA 19%)
    const taxRate = 0.19;
    const tax = subtotal * taxRate;
    
    // Calcular total
    const total = subtotal + tax;
    
    // Actualizar UI
    const subtotalElement = document.getElementById('invoiceSubtotal');
    const taxElement = document.getElementById('invoiceTax');
    const totalElement = document.getElementById('invoiceTotal');
    
    if (subtotalElement) subtotalElement.textContent = window.helpers.formatCurrency(subtotal);
    if (taxElement) taxElement.textContent = window.helpers.formatCurrency(tax);
    if (totalElement) totalElement.textContent = window.helpers.formatCurrency(total);
}

// Guardar factura en la base de datos
async function saveInvoice() {
    // Obtener datos del formulario
    const clientSelect = document.getElementById('invoiceClient');
    const dateInput = document.getElementById('invoiceDate');
    
    const clientId = clientSelect ? clientSelect.value : '';
    const date = dateInput ? dateInput.value : '';
    
    // Validar datos
    if (!clientId || !date) {
        showNotification('Por favor seleccione un cliente y una fecha', 'error');
        return;
    }
    
    if (invoiceItems.length === 0) {
        showNotification('Por favor agregue al menos un producto', 'error');
        return;
    }
    
    // Calcular totales
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.Total, 0);
    const taxRate = 0.19;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    try {
        // Crear objeto con datos de la factura
        const invoiceData = {
            Fecha: date,
            IdCliente: clientId,
            Total: total,
            Subtotal: subtotal,
            Impuesto: tax,
            IdUsuario: 1, // En producción esto debería ser el ID del usuario logueado
            Detalles: invoiceItems.map(item => ({
                IdProducto: item.IdProducto,
                Cantidad: item.Cantidad,
                PrecioUnitario: item.PrecioUnitario,
                Total: item.Total
            }))
        };
        
        // Enviar a la API
        const response = await fetch(`${API_BASE_URL}/facturas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar factura');
        }
        
        // Recargar tabla de facturas
        loadInvoicesData();
        
        // Cerrar modal
        closeModal('invoiceModal');
        
        // Mostrar mensaje de éxito
        showNotification('Factura creada con éxito', 'success');
    } catch (error) {
        console.error('Error al guardar factura:', error);
        showNotification(error.message || 'Error al guardar factura', 'error');
    }
}

// Ver detalles de una factura
async function viewInvoice(id) {
    try {
        // Obtener datos principales de la factura
        const invoiceResponse = await fetch(`${API_BASE_URL}/facturas/${id}`);
        if (!invoiceResponse.ok) throw new Error('Error al cargar factura');
        const invoice = await invoiceResponse.json();

        // Obtener detalles de la factura con información de productos
        const detailsResponse = await fetch(`${API_BASE_URL}/detalle-factura/factura/${id}`);
        if (!detailsResponse.ok) throw new Error('Error al cargar detalles de factura');
        const detalles = await detailsResponse.json();

        // Calcular subtotal para cada item y total general
        let subtotalCalculado = 0;
        const detallesConSubtotal = detalles.map(detalle => {
            const subtotalItem = detalle.Cantidad * detalle.PrecioUnitario;
            subtotalCalculado += subtotalItem;
            return {
                ...detalle,
                subtotalItem: subtotalItem
            };
        });

        // Función para obtener información completa de productos
        const getProductDetails = async (detalles) => {
            const detallesConProductos = [];
            
            for (const detalle of detalles) {
                try {
                    const productResponse = await fetch(`${API_BASE_URL}/productos/${detalle.IdProducto}`);
                    if (productResponse.ok) {
                        const producto = await productResponse.json();
                        detallesConProductos.push({
                            ...detalle,
                            producto: producto
                        });
                    } else {
                        detallesConProductos.push({
                            ...detalle,
                            producto: null
                        });
                    }
                } catch (error) {
                    console.error(`Error al cargar producto ${detalle.IdProducto}:`, error);
                    detallesConProductos.push({
                        ...detalle,
                        producto: null
                    });
                }
            }
            
            return detallesConProductos;
        };

        // Obtener información completa de cada producto
        const detallesCompletos = await getProductDetails(detallesConSubtotal);

        // Obtener información del cliente si no viene en la factura
        let clienteInfo = invoice.cliente;
        if (!clienteInfo && invoice.IdCliente) {
            const clienteResponse = await fetch(`${API_BASE_URL}/clientes/${invoice.IdCliente}`);
            if (clienteResponse.ok) {
                clienteInfo = await clienteResponse.json();
            }
        }

        // Llenar el modal con los datos
        const modal = document.getElementById('viewInvoiceModal');
        if (modal) {
            const modalContent = modal.querySelector('.modal-content');
            
            modalContent.innerHTML = `
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="invoice-view">
                    <div class="invoice-header">
                        <div class="invoice-logo">
                            <img src="/hensys-fronend/assets/img/gallina.png" alt="HENSYS Logo">
                            <h2>HENSYS</h2>
                        </div>
                        <div class="invoice-info">
                            <h1>Factura</h1>
                            <p><strong>Número:</strong> F-${invoice.IdFactura.toString().padStart(3, '0')}</p>
                            <p><strong>Fecha:</strong> ${window.helpers.formatDate(invoice.Fecha)}</p>
                            ${invoice.Estado ? `<p><strong>Estado:</strong> ${invoice.Estado}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="invoice-client">
                        <h3>Cliente</h3>
                        <p><strong>Nombre:</strong> ${clienteInfo ? clienteInfo.Nombre : 'Cliente no encontrado'}</p>
                        ${clienteInfo && clienteInfo.Direccion ? `<p><strong>Dirección:</strong> ${clienteInfo.Direccion}</p>` : ''}
                        ${clienteInfo && clienteInfo.Telefono ? `<p><strong>Teléfono:</strong> ${clienteInfo.Telefono}</p>` : ''}
                        ${clienteInfo && clienteInfo.Email ? `<p><strong>Email:</strong> ${clienteInfo.Email}</p>` : ''}
                    </div>
                    
                    <div class="invoice-items">
                        <h3>Detalles de Factura</h3>
                        <table class="invoice-details-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Tipo</th>
                                    <th>Unidad</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${detallesCompletos.length > 0 ? detallesCompletos.map(item => `
                                    <tr>
                                        <td>${item.producto ? item.producto.Nombre : 'Producto no encontrado'}</td>
                                        <td>${item.producto ? item.producto.Tipo : '-'}</td>
                                        <td>${item.producto ? item.producto.Unidad : '-'}</td>
                                        <td>${item.Cantidad}</td>
                                        <td>${window.helpers.formatCurrency(item.PrecioUnitario)}</td>
                                        <td>${window.helpers.formatCurrency(item.subtotalItem)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="6" class="text-center">No hay productos en esta factura</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="invoice-totals">
                        <div class="total-row">
                            <span>Subtotal calculado:</span>
                            <span>${window.helpers.formatCurrency(subtotalCalculado)}</span>
                        </div>
                        <div class="total-row">
                            <span>IVA (19%):</span>
                            <span>${window.helpers.formatCurrency(subtotalCalculado * 0.19)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>Total calculado:</span>
                            <span>${window.helpers.formatCurrency(subtotalCalculado * 1.19)}</span>
                        </div>
                    </div>
                    
                    <div class="invoice-actions">
                        <button class="btn btn-primary" onclick="printInvoice(${invoice.IdFactura})">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                        <button class="btn btn-secondary" onclick="closeModal('viewInvoiceModal')">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            `;
            
            // Agregar evento al botón de cerrar
            const closeButton = modalContent.querySelector('.modal-close');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    closeModal('viewInvoiceModal');
                });
            }
        }
        
        // Abrir modal
        openModal('viewInvoiceModal');
    } catch (error) {
        console.error('Error al ver factura:', error);
        showNotification(`Error al cargar detalles de la factura: ${error.message}`, 'error');
    }
}

// Imprimir factura
function printInvoice(id) {
    // En una aplicación real, esto abriría un diálogo de impresión
    // Por ahora, abrimos el modal de vista primero
    viewInvoice(id);
    setTimeout(() => {
        alert('Funcionalidad de impresión en desarrollo. Por ahora puede usar Ctrl+P para imprimir.');
    }, 500);
}

// Eliminar factura
async function deleteInvoice(id) {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/facturas/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar factura');
            }
            
            // Recargar tabla de facturas
            loadInvoicesData();
            
            // Mostrar mensaje de éxito
            showNotification('Factura eliminada con éxito', 'success');
        } catch (error) {
            console.error('Error al eliminar factura:', error);
            showNotification(error.message || 'Error al eliminar factura', 'error');
        }
    }
}

// Abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
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
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Agregar evento al botón de cerrar
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
    }
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}