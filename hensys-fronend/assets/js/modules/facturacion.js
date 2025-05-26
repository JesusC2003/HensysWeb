/**
 * Invoicing Module
 */

// Global variables
let invoiceItems = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load invoices data
    loadInvoicesData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load invoices data
function loadInvoicesData() {
    const tableBody = document.querySelector('#invoicesTable tbody');
    if (!tableBody) return;
    
    // Get invoices data
    const invoicesData = window.appData.invoices;
    
    // Get filter values
    const clientFilter = document.getElementById('clientFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    const clientValue = clientFilter ? clientFilter.value : '';
    const dateValue = dateFilter ? dateFilter.value : '';
    
    // Filter data
    let filteredData = [...invoicesData];
    
    if (clientValue) {
        filteredData = filteredData.filter(item => item.cliente.toLowerCase().includes(clientValue.toLowerCase()));
    }
    
    if (dateValue) {
        const filterDate = new Date(dateValue);
        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.fecha);
            return itemDate.toDateString() === filterDate.toDateString();
        });
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No se encontraron facturas</td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.numero}</td>
            <td>${item.cliente}</td>
            <td>${window.helpers.formatDate(item.fecha)}</td>
            <td>${window.helpers.formatCurrency(item.total)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-view" data-id="${index}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-print" data-id="${index}">
                        <i class="fas fa-print"></i>
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
    const clientFilter = document.getElementById('clientFilter');
    if (clientFilter) {
        clientFilter.addEventListener('change', loadInvoicesData);
    }
    
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', loadInvoicesData);
    }
    
    // Filter button
    const filterButton = document.getElementById('filterButton');
    if (filterButton) {
        filterButton.addEventListener('click', loadInvoicesData);
    }
    
    // New invoice button
    const newInvoiceButton = document.getElementById('newInvoiceButton');
    if (newInvoiceButton) {
        newInvoiceButton.addEventListener('click', openNewInvoiceModal);
    }
    
    // Export button
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', exportInvoices);
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
    
    // Add item button in invoice modal
    const addItemButton = document.getElementById('addInvoiceItemButton');
    if (addItemButton) {
        addItemButton.addEventListener('click', addInvoiceItem);
    }
    
    // Save invoice button
    const saveInvoiceButton = document.getElementById('saveInvoiceButton');
    if (saveInvoiceButton) {
        saveInvoiceButton.addEventListener('click', saveInvoice);
    }
}

// Add action button listeners
function addActionButtonListeners() {
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewInvoice(id);
        });
    });
    
    // Print buttons
    const printButtons = document.querySelectorAll('.btn-print');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            printInvoice(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteInvoice(id);
        });
    });
}

// Open new invoice modal
function openNewInvoiceModal() {
    // Reset invoice items
    invoiceItems = [];
    
    // Reset form
    const form = document.getElementById('invoiceForm');
    if (form) {
        form.reset();
    }
    
    // Clear items table
    const itemsTable = document.querySelector('#invoiceItemsTable tbody');
    if (itemsTable) {
        itemsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay productos agregados</td>
            </tr>
        `;
    }
    
    // Reset totals
    updateInvoiceTotals();
    
    // Open modal
    openModal('invoiceModal');
}

// Add invoice item
function addInvoiceItem() {
    // Get form data
    const productSelect = document.getElementById('invoiceProduct');
    const quantityInput = document.getElementById('invoiceQuantity');
    const priceInput = document.getElementById('invoicePrice');
    
    const productId = productSelect ? productSelect.value : '';
    const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
    const price = priceInput ? parseInt(priceInput.value) : 0;
    
    // Validate data
    if (!productId || !quantity || !price) {
        alert('Por favor complete todos los campos del producto');
        return;
    }
    
    // Get product name
    const productName = productSelect.options[productSelect.selectedIndex].text;
    
    // Create new item
    const newItem = {
        id: window.helpers.generateId(),
        productId,
        productName,
        quantity,
        price,
        total: quantity * price
    };
    
    // Add to items
    invoiceItems.push(newItem);
    
    // Update items table
    updateInvoiceItemsTable();
    
    // Update totals
    updateInvoiceTotals();
    
    // Reset product form
    quantityInput.value = '';
    priceInput.value = '';
    productSelect.focus();
}

// Update invoice items table
function updateInvoiceItemsTable() {
    const itemsTable = document.querySelector('#invoiceItemsTable tbody');
    if (!itemsTable) return;
    
    // Clear table
    itemsTable.innerHTML = '';
    
    // Add items
    if (invoiceItems.length === 0) {
        itemsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay productos agregados</td>
            </tr>
        `;
        return;
    }
    
    invoiceItems.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>${window.helpers.formatCurrency(item.price)}</td>
            <td>${window.helpers.formatCurrency(item.total)}</td>
            <td>
                <button class="btn-icon btn-delete" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        itemsTable.appendChild(row);
    });
    
    // Add delete button listeners
    const deleteButtons = itemsTable.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeInvoiceItem(id);
        });
    });
}

// Remove invoice item
function removeInvoiceItem(id) {
    // Remove item
    invoiceItems = invoiceItems.filter(item => item.id !== id);
    
    // Update table
    updateInvoiceItemsTable();
    
    // Update totals
    updateInvoiceTotals();
}

// Update invoice totals
function updateInvoiceTotals() {
    // Calculate subtotal
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate tax
    const taxRate = 0.19; // 19% IVA
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + tax;
    
    // Update UI
    const subtotalElement = document.getElementById('invoiceSubtotal');
    const taxElement = document.getElementById('invoiceTax');
    const totalElement = document.getElementById('invoiceTotal');
    
    if (subtotalElement) subtotalElement.textContent = window.helpers.formatCurrency(subtotal);
    if (taxElement) taxElement.textContent = window.helpers.formatCurrency(tax);
    if (totalElement) totalElement.textContent = window.helpers.formatCurrency(total);
}

// Save invoice
function saveInvoice() {
    // Get form data
    const clientSelect = document.getElementById('invoiceClient');
    const dateInput = document.getElementById('invoiceDate');
    
    const clientId = clientSelect ? clientSelect.value : '';
    const date = dateInput ? dateInput.value : '';
    
    // Validate data
    if (!clientId || !date) {
        alert('Por favor seleccione un cliente y una fecha');
        return;
    }
    
    if (invoiceItems.length === 0) {
        alert('Por favor agregue al menos un producto');
        return;
    }
    
    // Get client name
    const clientName = clientSelect.options[clientSelect.selectedIndex].text;
    
    // Calculate totals
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.19; // 19% IVA
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Create invoice number
    const invoiceNumber = `F-${(window.appData.invoices.length + 1).toString().padStart(3, '0')}`;
    
    // Create new invoice
    const newInvoice = {
        numero: invoiceNumber,
        cliente: clientName,
        fecha: date,
        total: total,
        subtotal: subtotal,
        impuesto: tax,
        items: [...invoiceItems]
    };
    
    // Add to data
    window.appData.invoices.unshift(newInvoice);
    
    // Reload table
    loadInvoicesData();
    
    // Close modal
    closeModal('invoiceModal');
    
    // Show success message
    showNotification('Factura creada con éxito', 'success');
}

// View invoice
function viewInvoice(id) {
    // Get invoice data
    const invoice = window.appData.invoices[id];
    
    // Fill modal
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
                        <img src="assets/img/logo.png" alt="HENSYS Logo">
                        <h2>HENSYS</h2>
                    </div>
                    <div class="invoice-info">
                        <h1>Factura</h1>
                        <p><strong>Número:</strong> ${invoice.numero}</p>
                        <p><strong>Fecha:</strong> ${window.helpers.formatDate(invoice.fecha)}</p>
                    </div>
                </div>
                
                <div class="invoice-client">
                    <h3>Cliente</h3>
                    <p><strong>Nombre:</strong> ${invoice.cliente}</p>
                </div>
                
                <div class="invoice-items">
                    <h3>Productos</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items ? invoice.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${window.helpers.formatCurrency(item.price)}</td>
                                    <td>${window.helpers.formatCurrency(item.total)}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="4" class="text-center">No hay productos</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
                
                <div class="invoice-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${window.helpers.formatCurrency(invoice.subtotal || 0)}</span>
                    </div>
                    <div class="total-row">
                        <span>IVA (19%):</span>
                        <span>${window.helpers.formatCurrency(invoice.impuesto || 0)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>Total:</span>
                        <span>${window.helpers.formatCurrency(invoice.total)}</span>
                    </div>
                </div>
                
                <div class="invoice-actions">
                    <button class="btn btn-primary" onclick="printInvoice(${id})">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                </div>
            </div>
        `;
        
        // Add close button event
        const closeButton = modalContent.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                closeModal('viewInvoiceModal');
            });
        }
    }
    
    // Open modal
    openModal('viewInvoiceModal');
}

// Print invoice
function printInvoice(id) {
    // In a real app, this would open a print dialog
    alert('Funcionalidad de impresión en desarrollo');
}

// Delete invoice
function deleteInvoice(id) {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
        // Remove from data
        window.appData.invoices.splice(id, 1);
        
        // Reload table
        loadInvoicesData();
        
        // Show success message
        showNotification('Factura eliminada con éxito', 'success');
    }
}

// Export invoices
function exportInvoices() {
    // In a real app, this would export to CSV or PDF
    alert('Funcionalidad de exportación en desarrollo');
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
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