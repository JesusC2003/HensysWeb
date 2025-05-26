/**
 * Helper Functions
 */

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', options);
}

// Format date with time
function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', options);
}

// Get relative time (e.g., "2 days ago")
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Hoy';
    } else if (diffDays === 1) {
        return 'Ayer';
    } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
    }
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Filter data by search term
function filterBySearchTerm(data, searchTerm, fields) {
    if (!searchTerm) return data;
    
    searchTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
        return fields.some(field => {
            const value = item[field];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            } else if (typeof value === 'number') {
                return value.toString().includes(searchTerm);
            }
            return false;
        });
    });
}

// Sort data by field
function sortData(data, field, direction = 'asc') {
    return [...data].sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Export helpers
window.helpers = {
    formatCurrency,
    formatDate,
    formatDateTime,
    getRelativeTime,
    truncateText,
    generateId,
    debounce,
    filterBySearchTerm,
    sortData
};