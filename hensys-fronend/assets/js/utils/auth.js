/**
 * Authentication Utilities
 */

class AuthManager {
  constructor() {
    this.token = localStorage.getItem("hensys_token")
    this.user = JSON.parse(localStorage.getItem("hensys_user") || "null")
    this.baseURL = "http://localhost:3000"
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return this.token && this.user
  }

  // Obtener token
  getToken() {
    return this.token
  }

  // Obtener usuario
  getUser() {
    return this.user
  }

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al iniciar sesión")
      }

      const data = await response.json()

      // Guardar token y usuario
      this.token = data.token
      this.user = data.usuario

      localStorage.setItem("hensys_token", this.token)
      localStorage.setItem("hensys_user", JSON.stringify(this.user))

      return data
    } catch (error) {
      throw error
    }
  }

  // Registrar usuario
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al registrar usuario")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // Registrar granja
  async registerGranja(granjaData) {
    try {
      const response = await fetch(`${this.baseURL}/granjas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(granjaData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al registrar granja")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // Asociar usuario con granja
  async associateUserWithGranja(idUsuario, idGranja) {
    try {
      const response = await fetch(`${this.baseURL}/usuarios-granja`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ IdUsuario: idUsuario, IdGranja: idGranja }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al asociar usuario con granja")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  // Cerrar sesión
  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem("hensys_token")
    localStorage.removeItem("hensys_user")
    window.location.href = "/hensys-fronend/pages/login.html"
  }

  // Verificar si el token es válido
  async validateToken() {
    if (!this.token) return false

    try {
      const response = await fetch(`${this.baseURL}/usuarios/${this.user.IdUsuario}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  // Proteger rutas
  async protectRoute() {
    if (!this.isAuthenticated()) {
      window.location.href = "/hensys-fronend/pages/login.html"
      return false
    }

    const isValid = await this.validateToken()
    if (!isValid) {
      this.logout()
      return false
    }

    return true
  }
}

// Instancia global
window.authManager = new AuthManager()

// Función para hacer peticiones autenticadas
window.authenticatedFetch = async (url, options = {}) => {
  const token = window.authManager.getToken()

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    if (response.status === 401) {
      window.authManager.logout()
      throw new Error("Sesión expirada")
    }

    return response
  } catch (error) {
    throw error
  }
}
