/**
 * Notification System
 */

class NotificationManager {
  constructor() {
    this.container = this.createContainer()
  }

  createContainer() {
    let container = document.getElementById("notificationContainer")
    if (!container) {
      container = document.createElement("div")
      container.id = "notificationContainer"
      container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `
      document.body.appendChild(container)
    }
    return container
  }

  show(message, type = "info", duration = 5000) {
    const notification = this.createNotification(message, type)
    this.container.appendChild(notification)

    // Animar entrada
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification)
      }, duration)
    }

    return notification
  }

  createNotification(message, type) {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            border-left: 4px solid ${this.getColorByType(type)};
            max-width: 100%;
            word-wrap: break-word;
        `

    const icon = document.createElement("i")
    icon.className = `fas fa-${this.getIconByType(type)}`
    icon.style.cssText = `
            color: ${this.getColorByType(type)};
            font-size: 18px;
            flex-shrink: 0;
        `

    const content = document.createElement("div")
    content.style.cssText = `
            flex: 1;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        `
    content.textContent = message

    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = '<i class="fas fa-times"></i>'
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        `
    closeBtn.addEventListener("click", () => this.remove(notification))

    notification.appendChild(icon)
    notification.appendChild(content)
    notification.appendChild(closeBtn)

    // Agregar clase show para animación
    notification.classList.add = function (className) {
      if (className === "show") {
        this.style.transform = "translateX(0)"
        this.style.opacity = "1"
      }
      HTMLElement.prototype.classList.add.call(this, className)
    }

    return notification
  }

  remove(notification) {
    notification.style.transform = "translateX(100%)"
    notification.style.opacity = "0"

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }

  getColorByType(type) {
    const colors = {
      success: "#4caf50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196f3",
    }
    return colors[type] || colors.info
  }

  getIconByType(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }
    return icons[type] || icons.info
  }

  // Métodos de conveniencia
  success(message, duration) {
    return this.show(message, "success", duration)
  }

  error(message, duration) {
    return this.show(message, "error", duration)
  }

  warning(message, duration) {
    return this.show(message, "warning", duration)
  }

  info(message, duration) {
    return this.show(message, "info", duration)
  }
}

// Instancia global
window.notificationManager = new NotificationManager()

// Funciones globales de conveniencia
window.showNotification = (message, type, duration) => {
  return window.notificationManager.show(message, type, duration)
}

window.showSuccess = (message, duration) => {
  return window.notificationManager.success(message, duration)
}

window.showError = (message, duration) => {
  return window.notificationManager.error(message, duration)
}

window.showWarning = (message, duration) => {
  return window.notificationManager.warning(message, duration)
}

window.showInfo = (message, duration) => {
  return window.notificationManager.info(message, duration)
}
