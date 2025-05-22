/**
 * Validation Utilities
 */

// Validation functions
const validation = {
    // Validate required field
    isRequired: function(value) {
        return value !== null && value !== undefined && value.trim() !== '';
    },
    
    // Validate email
    isValidEmail: function(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    },
    
    // Validate phone number
    isValidPhone: function(phone) {
        const regex = /^[0-9\-\+\s$$$$]{7,15}$/;
        return regex.test(phone);
    },
    
    // Validate number in range
    isValidNumber: function(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    },
    
    // Validate date
    isValidDate: function(date) {
        const d = new Date(date);
        return !isNaN(d.getTime());
    },
    
    // Validate future date
    isFutureDate: function(date) {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(d.getTime()) && d >= today;
    },
    
    // Validate past date
    isPastDate: function(date) {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(d.getTime()) && d < today;
    },
    
    // Validate date range
    isValidDateRange: function(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return !isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end;
    },
    
    // Validate password
    isValidPassword: function(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    },
    
    // Validate password match
    doPasswordsMatch: function(password, confirmPassword) {
        return password === confirmPassword;
    },
    
    // Validate URL
    isValidUrl: function(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Validate file type
    isValidFileType: function(file, allowedTypes) {
        if (!file) return false;
        const fileType = file.type;
        return allowedTypes.includes(fileType);
    },
    
    // Validate file size
    isValidFileSize: function(file, maxSizeInBytes) {
        if (!file) return false;
        return file.size <= maxSizeInBytes;
    },
    
    // Validate form
    validateForm: function(form, rules) {
        const errors = {};
        
        for (const field in rules) {
            const value = form[field];
            const fieldRules = rules[field];
            
            for (const rule of fieldRules) {
                const { type, message, ...params } = rule;
                
                switch (type) {
                    case 'required':
                        if (!this.isRequired(value)) {
                            errors[field] = message || 'Este campo es obligatorio';
                        }
                        break;
                    case 'email':
                        if (value && !this.isValidEmail(value)) {
                            errors[field] = message || 'Email inválido';
                        }
                        break;
                    case 'phone':
                        if (value && !this.isValidPhone(value)) {
                            errors[field] = message || 'Teléfono inválido';
                        }
                        break;
                    case 'number':
                        if (value && !this.isValidNumber(value, params.min, params.max)) {
                            errors[field] = message || `El número debe estar entre ${params.min} y ${params.max}`;
                        }
                        break;
                    case 'date':
                        if (value && !this.isValidDate(value)) {
                            errors[field] = message || 'Fecha inválida';
                        }
                        break;
                    case 'futureDate':
                        if (value && !this.isFutureDate(value)) {
                            errors[field] = message || 'La fecha debe ser en el futuro';
                        }
                        break;
                    case 'pastDate':
                        if (value && !this.isPastDate(value)) {
                            errors[field] = message || 'La fecha debe ser en el pasado';
                        }
                        break;
                    case 'dateRange':
                        if (value && params.endDate && !this.isValidDateRange(value, params.endDate)) {
                            errors[field] = message || 'Rango de fechas inválido';
                        }
                        break;
                    case 'password':
                        if (value && !this.isValidPassword(value)) {
                            errors[field] = message || 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número';
                        }
                        break;
                    case 'passwordMatch':
                        if (value && params.confirmPassword && !this.doPasswordsMatch(value, params.confirmPassword)) {
                            errors[field] = message || 'Las contraseñas no coinciden';
                        }
                        break;
                    case 'url':
                        if (value && !this.isValidUrl(value)) {
                            errors[field] = message || 'URL inválida';
                        }
                        break;
                    case 'fileType':
                        if (value && !this.isValidFileType(value, params.allowedTypes)) {
                            errors[field] = message || `Tipo de archivo inválido. Tipos permitidos: ${params.allowedTypes.join(', ')}`;
                        }
                        break;
                    case 'fileSize':
                        if (value && !this.isValidFileSize(value, params.maxSize)) {
                            errors[field] = message || `El archivo es demasiado grande. Tamaño máximo: ${params.maxSize / (1024 * 1024)} MB`;
                        }
                        break;
                    default:
                        break;
                }
                
                // If there's already an error for this field, skip the rest of the rules
                if (errors[field]) break;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Export validation
window.validation = validation;