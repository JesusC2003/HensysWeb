/**
 * Expenses Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load expenses data
    loadExpensesData();
    
    // Set up event listeners
    setupEventListeners();
});

// Load expenses data
function loadExpensesData() {
    const tableBody = document.querySelector('#expensesTable tbody');
    if (!tableBody) return;
    
    // Get expenses data
    const expensesData = window.appData.expenses;
    
    // Get filter value
    const filterSelect = document.getElementById('expensesFilter');
    const filterValue = filterSelect ? filterSelect.value : 'all';
    
    // Filter data
    let filteredData = [...expensesData];
    if (filterValue !== 'all') {
        filteredData = expensesData.filter(item => item.categoria === filterValue);
    }
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add data rows
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.categoria}</td>
            <td>${item.descripcion}</td>
            <td>${window.helpers.formatCurrency(item.monto)}</td>
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
    const filterSelect = document.getElementById('expensesFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', loadExpensesData);
    }
    
    // Add expense form
    const addExpenseForm = document.getElementById('addExpenseForm');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', handleAddExpense);
    }
}

// Handle add expense
function handleAddExpense(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const categoria = form.querySelector('#expenseCategory').value;
    const descripcion = form.querySelector('#expenseDescription').value;
    const monto = parseInt(form.querySelector('#expenseAmount').value);
    const fecha = form.querySelector('#expenseDate').value;
    
    // Validate data
    if (!categoria || !descripcion || !monto || !fecha) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Create new expense entry
    const newExpense = {
        categoria,
        descripcion,
        monto,
        fecha
    };
    
    // Add to data
    window.appData.expenses.unshift(newExpense);
    
    // Reload table
    loadExpensesData();
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Gasto registrado con éxito', 'success');
}

// Add action button listeners
function addActionButtonListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editExpense(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteExpense(id);
        });
    });
}

// Edit expense
function editExpense(id) {
    // Get expense data
    const expense = window.appData.expenses[id];
    
    // Fill form
    const form = document.getElementById('addExpenseForm');
    if (form) {
        form.querySelector('#expenseCategory').value = expense.categoria;
        form.querySelector('#expenseDescription').value = expense.descripcion;
        form.querySelector('#expenseAmount').value = expense.monto;
        form.querySelector('#expenseDate').value = expense.fecha;
        
        // Change button text
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar Gasto';
            submitButton.setAttribute('data-edit-id', id);
        }
    }
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Delete expense
function deleteExpense(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        // Remove from data
        window.appData.expenses.splice(id, 1);
        
        // Reload table
        loadExpensesData();
        
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