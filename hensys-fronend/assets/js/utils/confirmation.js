/**
 * Confirmation Dialog Utilities
 */

class ConfirmationDialog {
  constructor() {
    this.createDialog()
  }

  createDialog() {
    // Crear el HTML del diálogo si no existe
    if (!document.getElementById("confirmationDialog")) {
      const dialogHTML = `
                <div class="confirmation-dialog" id="confirmationDialog">
                    <div class="confirmation-overlay"></div>
                    <div class="confirmation-container">
                        <div class="confirmation-content">
                            <div class="confirmation-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <div class="confirmation-message" id="confirmationMessage">
                                ¿Está seguro de que desea realizar esta acción?
                            </div>
                            <div class="confirmation-actions">
                                <button class="btn btn-outline" id="confirmationCancel">Cancelar</button>
                                <button class="btn btn-primary" id="confirmationConfirm">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
      document.body.insertAdjacentHTML("beforeend", dialogHTML)

      // Agregar eventos
      this.setupEvents()
    }
  }

  setupEvents() {
    const dialog = document.getElementById("confirmationDialog")
    const overlay = dialog.querySelector(".confirmation-overlay")
    const cancelBtn = document.getElementById("confirmationCancel")
    const confirmBtn = document.getElementById("confirmationConfirm")

    // Cerrar al hacer clic en overlay o cancelar
    overlay.addEventListener("click", () => this.hide())
    cancelBtn.addEventListener("click", () => this.hide())

    // Confirmar acción
    confirmBtn.addEventListener("click", () => {
      if (this.onConfirm) {
        this.onConfirm()
      }
      this.hide()
    })
  }

  show(message, onConfirm, options = {}) {
    const dialog = document.getElementById("confirmationDialog")
    const messageEl = document.getElementById("confirmationMessage")
    const confirmBtn = document.getElementById("confirmationConfirm")
    const icon = dialog.querySelector(".confirmation-icon i")

    // Configurar mensaje
    messageEl.textContent = message

    // Configurar icono según el tipo
    const type = options.type || "question"
    icon.className = `fas fa-${this.getIconByType(type)}`

    // Configurar botón de confirmación
    confirmBtn.textContent = options.confirmText || "Confirmar"
    confirmBtn.className = `btn ${this.getButtonClassByType(type)}`

    // Guardar callback
    this.onConfirm = onConfirm

    // Mostrar diálogo
    dialog.classList.add("active")
  }

  hide() {
    const dialog = document.getElementById("confirmationDialog")
    dialog.classList.remove("active")
    this.onConfirm = null
  }

  getIconByType(type) {
    const icons = {
      question: "question-circle",
      warning: "exclamation-triangle",
      danger: "exclamation-circle",
      info: "info-circle",
    }
    return icons[type] || "question-circle"
  }

  getButtonClassByType(type) {
    const classes = {
      question: "btn-primary",
      warning: "btn-warning",
      danger: "btn-error",
      info: "btn-info",
    }
    return classes[type] || "btn-primary"
  }

  // Métodos de conveniencia
  confirm(message, onConfirm) {
    this.show(message, onConfirm, { type: "question" })
  }

  warning(message, onConfirm) {
    this.show(message, onConfirm, {
      type: "warning",
      confirmText: "Continuar",
    })
  }

  danger(message, onConfirm) {
    this.show(message, onConfirm, {
      type: "danger",
      confirmText: "Eliminar",
    })
  }
}

// Instancia global
window.confirmationDialog = new ConfirmationDialog()

// Funciones de conveniencia globales
window.showConfirmation = (message, onConfirm, options) => {
  window.confirmationDialog.show(message, onConfirm, options)
}

window.confirmAction = (message, onConfirm) => {
  window.confirmationDialog.confirm(message, onConfirm)
}

window.confirmDelete = (message, onConfirm) => {
  window.confirmationDialog.danger(
    message || "¿Está seguro de que desea eliminar este elemento? Esta acción no se puede deshacer.",
    onConfirm,
  )
}

window.confirmSave = (message, onConfirm) => {
  window.confirmationDialog.confirm(message || "¿Está seguro de que desea guardar los cambios?", onConfirm)
}
