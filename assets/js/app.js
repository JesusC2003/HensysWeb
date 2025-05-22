/**
 * Main Application JavaScript
 */

// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    
    // Save preference to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar-collapsed', isCollapsed);
}

// Initialize sidebar state from localStorage
function initSidebar() {
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

// Handle responsive sidebar
function handleResponsiveSidebar() {
    if (window.innerWidth <= 1200) {
        sidebar.classList.add('collapsed');
    } else {
        initSidebar();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar
    handleResponsiveSidebar();
    
    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResponsiveSidebar);
    
    // Handle sidebar menu item clicks on mobile
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 1200) {
                sidebar.classList.add('collapsed');
            }
        });
    });
    
    // Initialize tooltips, modals, or other UI components
    initializeComponents();
});

// Initialize UI components
function initializeComponents() {
    // Add any component initialization here
    console.log('Application initialized');
}

// Handle logout
const logoutButton = document.querySelector('.btn-logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        // In a real app, this would handle logout logic
        alert('Logout functionality would go here');
    });
}