/**
 * Main Application Script
 */

// Configuración de páginas
const PAGE_TITLES = {
    'index.html': { title: 'Dashboard', breadcrumb: 'Inicio / Dashboard' },
    'alimentacion.html': { title: 'Alimentación', breadcrumb: 'Inicio / Alimentación' },
    'facturacion.html': { title: 'Facturación', breadcrumb: 'Inicio / Facturación' },
    'vacunacion.html': { title: 'Vacunación', breadcrumb: 'Inicio / Salud' },
    'produccion.html': { title: 'Producción', breadcrumb: 'Inicio / Producción' },
    'clientes.html': { title: 'Clientes', breadcrumb: 'Inicio / Clientes' },
    'animal.html': { title: 'Animal', breadcrumb: 'Inicio / Animal' },
    'galpones.html': { title: 'Galpones', breadcrumb: 'Inicio / Galpones' },
    'gastos.html': { title: 'Gastos', breadcrumb: 'Inicio / Gastos' }
};

// Función para actualizar el header dinámicamente
function actualizarTituloHeader() {
    // Obtener el nombre del archivo actual
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'dashboard.html';
    
    // Obtener configuración de la página actual
    const pageConfig = PAGE_TITLES[fileName] || PAGE_TITLES['dashboard.html'];
    
    // Actualizar elementos del header
    const titleElement = document.getElementById('pageTitle');
    const breadcrumbElement = document.getElementById('pageBreadcrumb');
    
    if (titleElement) {
        titleElement.textContent = pageConfig.title;
    }
    
    if (breadcrumbElement) {
        breadcrumbElement.textContent = pageConfig.breadcrumb;
    }
    
    // Actualizar título de la pestaña del navegador
    document.title = `HENSYS - ${pageConfig.title}`;
}

// Función para cargar componentes HTML como header, sidebar, modals
async function cargarComponente(id, ruta) {
  const elemento = document.getElementById(id)
  if (elemento) {
    try {
      const respuesta = await fetch(ruta)
      if (!respuesta.ok) throw new Error(`Error al cargar ${ruta}`)
      const html = await respuesta.text()
      elemento.innerHTML = html
      
      // Si se cargó el header, actualizar el título
      if (id === "Header") {
        setTimeout(() => {
          actualizarTituloHeader();
        }, 50);
      }
      
    } catch (error) {
      console.error(`Error al insertar ${id} desde ${ruta}:`, error)
    }
  }
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Cargar componentes reutilizables
  cargarComponente("Header", "../components/header.html")
  cargarComponente("sidebar", "../components/sidebar.html")
  cargarComponente("modals", "../components/modals.html")

  // Espera breve para asegurarse de que los componentes ya estén insertados
  setTimeout(() => {
    inicializarSidebar()
    manejarSidebarResponsivo()
    inicializarDropdownUsuario()

    const botonToggle = document.getElementById("sidebarToggle")
    const sidebar = document.querySelector(".sidebar")

    // Alternar el menú lateral al hacer clic en el botón
    if (botonToggle && sidebar) {
      botonToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed")
        const estaColapsado = sidebar.classList.contains("collapsed")
        localStorage.setItem("sidebar-collapsed", estaColapsado)
      })

      // Ajustar automáticamente el sidebar al cambiar el tamaño de la ventana
      window.addEventListener("resize", manejarSidebarResponsivo)

      // Cerrar el sidebar en móviles al hacer clic en un ítem del menú
      const elementosMenu = document.querySelectorAll(".menu-item")
      elementosMenu.forEach((item) => {
        item.addEventListener("click", () => {
          if (window.innerWidth <= 1200) {
            sidebar.classList.add("collapsed")
          }
        })
      })
    }

    // Evento de cierre de sesión
    const botonLogout = document.querySelector(".btn-logout")
    if (botonLogout) {
      botonLogout.addEventListener("click", () => {
        alert("Aquí iría la lógica de cerrar sesión")
      })
    }

    // Initialize notifications
    initNotifications()

    // Initialize tooltips
    initTooltips()

    // Initialize modals
    initModals()

    // Initialize dropdowns
    initDropdowns()

    // Initialize theme switcher
    initThemeSwitcher()

    // Inicializar otros componentes o plugins visuales
    inicializarComponentes()
    
    // Actualizar título del header (fallback)
    actualizarTituloHeader()
    
  }, 100) // Espera mínima para asegurar que el HTML de los componentes esté disponible
})

// Inicializar el estado del sidebar desde el localStorage
function inicializarSidebar() {
  const sidebar = document.querySelector(".sidebar")
  const estaColapsado = localStorage.getItem("sidebar-collapsed") === "true"
  if (sidebar) {
    sidebar.classList.toggle("collapsed", estaColapsado)
  }
}

// Colapsar sidebar automáticamente en pantallas pequeñas
function manejarSidebarResponsivo() {
  const sidebar = document.querySelector(".sidebar")
  if (window.innerWidth <= 1200 && sidebar) {
    sidebar.classList.add("collapsed")
  } else {
    inicializarSidebar()
  }
}

// Inicializar dropdown del usuario
function inicializarDropdownUsuario() {
  // Buscar el botón de configuración después de que se cargue el header
  setTimeout(() => {
    crearDropdownUsuario()
    configurarEventosDropdown()
  }, 50)
}

// Crear el HTML del dropdown y agregarlo al botón de configuración
function crearDropdownUsuario() {
  const botonConfig = document.querySelector('.header-actions .btn-icon[title="Configuración"]')

  if (botonConfig) {
    // Envolver el botón en un contenedor dropdown
    const contenedorDropdown = document.createElement("div")
    contenedorDropdown.className = "user-dropdown"

    // Mover el botón al contenedor
    botonConfig.parentNode.insertBefore(contenedorDropdown, botonConfig)
    contenedorDropdown.appendChild(botonConfig)

    // Crear el menú dropdown
    const menuDropdown = document.createElement("div")
    menuDropdown.className = "user-dropdown-menu"
    menuDropdown.innerHTML = `
      <div class="user-info-dropdown">
        <img src="/hensys-fronend/assets/img/logo.jpg" alt="User Avatar" class="user-avatar-dropdown">
        <div class="user-details-dropdown">
          <h3>Admin</h3>
          <p>Administrador</p>
          <p class="user-email">admin@hensys.com</p>
        </div>
      </div>
      
      <a href="#" class="dropdown-menu-item">
        <i class="fas fa-user"></i>
        <span>Mi Perfil</span>
      </a>
      
      <a href="#" class="dropdown-menu-item">
        <i class="fas fa-cog"></i>
        <span>Configuración</span>
      </a>
      
      <a href="#" class="dropdown-menu-item">
        <i class="fas fa-question-circle"></i>
        <span>Ayuda</span>
      </a>
      
      <button class="btn-logout-dropdown" id="logoutButtonDropdown">
        <i class="fas fa-sign-out-alt"></i>
        <span>Cerrar Sesión</span>
      </button>
    `

    // Agregar el menú al contenedor
    contenedorDropdown.appendChild(menuDropdown)

    // Crear overlay
    const overlay = document.createElement("div")
    overlay.className = "dropdown-overlay"
    document.body.appendChild(overlay)
  }
}

// Configurar eventos del dropdown
function configurarEventosDropdown() {
  const contenedorDropdown = document.querySelector(".user-dropdown")
  const botonConfig = contenedorDropdown?.querySelector(".btn-icon")
  const menuDropdown = contenedorDropdown?.querySelector(".user-dropdown-menu")
  const overlay = document.querySelector(".dropdown-overlay")
  const botonLogout = document.getElementById("logoutButtonDropdown")

  if (!contenedorDropdown || !botonConfig || !menuDropdown || !overlay) {
    console.error("No se pudieron encontrar los elementos del dropdown")
    return
  }

  // Toggle dropdown al hacer clic en el botón
  botonConfig.addEventListener("click", (e) => {
    e.stopPropagation()
    alternarDropdown()
  })

  // Cerrar dropdown al hacer clic en el overlay
  overlay.addEventListener("click", () => {
    cerrarDropdown()
  })

  // Cerrar dropdown al presionar Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarDropdown()
    }
  })

  // Manejar logout
  if (botonLogout) {
    botonLogout.addEventListener("click", (e) => {
      e.preventDefault()
      manejarCierreSesion()
    })
  }

  // Prevenir que el dropdown se cierre al hacer clic dentro de él
  menuDropdown.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  function alternarDropdown() {
    const estaActivo = menuDropdown.classList.contains("active")

    if (estaActivo) {
      cerrarDropdown()
    } else {
      abrirDropdown()
    }
  }

  function abrirDropdown() {
    menuDropdown.classList.add("active")
    overlay.classList.add("active")
    botonConfig.style.background = "linear-gradient(135deg, var(--primary-color), var(--primary-light))"
    botonConfig.style.color = "white"
  }

  function cerrarDropdown() {
    menuDropdown.classList.remove("active")
    overlay.classList.remove("active")
    botonConfig.style.background = ""
    botonConfig.style.color = ""
  }

  function manejarCierreSesion() {
    // Mostrar confirmación
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      // Aquí puedes agregar la lógica de logout
      console.log("Cerrando sesión...")

      // Mostrar notificación si existe la función
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion("Sesión cerrada exitosamente", "success")
      }

      // Simular redirección (reemplaza con tu lógica real)
      setTimeout(() => {
        // window.location.href = '/login.html';
        alert("Aquí se redirigiría a la página de login")
      }, 1000)
    }

    cerrarDropdown()
  }

  // Exportar función para cerrar dropdown globalmente
  window.cerrarDropdownUsuario = cerrarDropdown
}

// Initialize notifications
function initNotifications() {
  // Close notification when close button is clicked
  document.addEventListener("click", (event) => {
    if (event.target.closest(".notification-close")) {
      const notification = event.target.closest(".notification")
      if (notification) {
        notification.classList.add("fade-out")
        setTimeout(() => {
          notification.remove()
        }, 300)
      }
    }
  })
}

// Initialize tooltips
function initTooltips() {
  // Add tooltip functionality if needed
  // This is a placeholder for future implementation
}

// Initialize modals
function initModals() {
  // Open modal
  document.addEventListener("click", (event) => {
    const modalTrigger = event.target.closest("[data-modal-target]")
    if (modalTrigger) {
      const modalId = modalTrigger.getAttribute("data-modal-target")
      const modal = document.getElementById(modalId)

      if (modal) {
        modal.classList.add("active")
        document.body.classList.add("modal-open")
      }
    }
  })

  // Close modal
  document.addEventListener("click", (event) => {
    if (event.target.closest(".modal-close") || event.target.classList.contains("modal-overlay")) {
      const modal = event.target.closest(".modal")
      if (modal) {
        modal.classList.remove("active")
        document.body.classList.remove("modal-open")
      }
    }
  })
}

// Initialize dropdowns
function initDropdowns() {
  // Toggle dropdown
  document.addEventListener("click", (event) => {
    const dropdownToggle = event.target.closest(".dropdown-toggle")
    if (dropdownToggle) {
      const dropdown = dropdownToggle.closest(".dropdown")
      if (dropdown) {
        dropdown.classList.toggle("active")

        // Close other dropdowns
        const allDropdowns = document.querySelectorAll(".dropdown.active")
        allDropdowns.forEach((item) => {
          if (item !== dropdown) {
            item.classList.remove("active")
          }
        })
      }
    } else if (!event.target.closest(".dropdown-menu")) {
      // Close all dropdowns when clicking outside
      const allDropdowns = document.querySelectorAll(".dropdown.active")
      allDropdowns.forEach((item) => {
        item.classList.remove("active")
      })
    }
  })
}

// Initialize theme switcher
function initThemeSwitcher() {
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme")

      // Save theme preference to localStorage
      const isDarkTheme = document.body.classList.contains("dark-theme")
      localStorage.setItem("darkTheme", isDarkTheme)
    })

    // Restore theme preference from localStorage
    const isDarkTheme = localStorage.getItem("darkTheme") === "true"
    if (isDarkTheme) {
      document.body.classList.add("dark-theme")
    }
  }
}

// Función para inicializar otros componentes si es necesario
function inicializarComponentes() {
  console.log("Aplicación inicializada correctamente")
}

// Función global para mostrar notificaciones (opcional)
function mostrarNotificacion(mensaje, tipo = "info") {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `notification ${tipo}`
  notificacion.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${tipo === "success" ? "check-circle" : tipo === "error" ? "exclamation-circle" : "info-circle"}"></i>
      <span>${mensaje}</span>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `

  // Agregar al documento
  document.body.appendChild(notificacion)

  // Agregar evento de cierre
  const botonCerrar = notificacion.querySelector(".notification-close")
  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => {
      notificacion.remove()
    })
  }

  // Auto remover después de 5 segundos
  setTimeout(() => {
    notificacion.classList.add("fade-out")
    setTimeout(() => {
      notificacion.remove()
    }, 300)
  }, 5000)
}

// Exportar función globalmente
window.mostrarNotificacion = mostrarNotificacion

// Export global functions
window.app = {
  showNotification: mostrarNotificacion,
}