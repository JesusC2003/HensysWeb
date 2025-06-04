 document.addEventListener('DOMContentLoaded', function() {
            // Verificar si ya está autenticado
            if (window.authManager.isAuthenticated()) {
                window.location.href = '/hensys-fronend/pages/index.html';
                return;
            }

            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const granjaForm = document.getElementById('granjaForm');
            const switchLink = document.getElementById('switchLink');
            const switchText = document.getElementById('switchText');
            const formTitle = document.getElementById('formTitle');
            const formSubtitle = document.getElementById('formSubtitle');
            const errorMessage = document.getElementById('errorMessage');
            const loading = document.getElementById('loading');

            let isLoginMode = true;
            let registeredUserId = null;

            // Cambiar entre login y registro
            switchLink.addEventListener('click', function(e) {
                e.preventDefault();
                isLoginMode = !isLoginMode;
                
                if (isLoginMode) {
                    showLoginForm();
                } else {
                    showRegisterForm();
                }
            });

            function showLoginForm() {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                granjaForm.style.display = 'none';
                formTitle.textContent = 'Iniciar Sesión';
                formSubtitle.textContent = 'Accede a tu cuenta para gestionar tu granja';
                switchText.textContent = '¿No tienes cuenta?';
                switchLink.textContent = 'Regístrate aquí';
                hideError();
            }

            function showRegisterForm() {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                granjaForm.style.display = 'none';
                formTitle.textContent = 'Crear Cuenta';
                formSubtitle.textContent = 'Regístrate para comenzar a gestionar tu granja';
                switchText.textContent = '¿Ya tienes cuenta?';
                switchLink.textContent = 'Inicia sesión aquí';
                hideError();
            }

            function showGranjaForm() {
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                granjaForm.style.display = 'block';
                formTitle.textContent = 'Registrar Granja';
                formSubtitle.textContent = 'Completa la información de tu granja';
                document.querySelector('.auth-switch').style.display = 'none';
                hideError();
            }

            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }

            function hideError() {
                errorMessage.style.display = 'none';
            }

            function showLoading() {
                loading.style.display = 'block';
            }

            function hideLoading() {
                loading.style.display = 'none';
            }

            // Manejar login
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;

                if (!username || !password) {
                    showError('Por favor completa todos los campos');
                    return;
                }

                showLoading();
                hideError();

                try {
                    await window.authManager.login({
                        NombreUsuario: username,
                        Contraseña: password
                    });

                    // Redirigir al dashboard
                    window.location.href = '/hensys-fronend/pages/index.html';
                } catch (error) {
                    showError(error.message);
                } finally {
                    hideLoading();
                }
            });

            // Manejar registro
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const identification = document.getElementById('registerIdentification').value;
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!identification || !username || !email || !password || !confirmPassword) {
                    showError('Por favor completa todos los campos');
                    return;
                }

                if (password !== confirmPassword) {
                    showError('Las contraseñas no coinciden');
                    return;
                }

                if (password.length < 6) {
                    showError('La contraseña debe tener al menos 6 caracteres');
                    return;
                }

                showLoading();
                hideError();

                try {
                    const result = await window.authManager.register({
                        NumeroIdentificacion: identification,
                        NombreUsuario: username,
                        Email: email,
                        Contraseña: password,
                        Rol: 'admin'
                    });

                    registeredUserId = result.id;
                    showGranjaForm();
                } catch (error) {
                    showError(error.message);
                } finally {
                    hideLoading();
                }
            });

            // Manejar registro de granja
            granjaForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById('granjaName').value;
                const nit = document.getElementById('granjaNIT').value;
                const location = document.getElementById('granjaLocation').value;

                if (!name || !nit || !location) {
                    showError('Por favor completa todos los campos');
                    return;
                }

                showLoading();
                hideError();

                try {
                    // Registrar granja
                    const granjaResult = await window.authManager.registerGranja({
                        Nombre: name,
                        NIT: nit,
                        Ubicacion: location
                    });

                    // Asociar usuario con granja
                    await window.authManager.associateUserWithGranja(registeredUserId, granjaResult.id);

                    // Mostrar mensaje de éxito y redirigir al login
                    alert('¡Registro completado exitosamente! Ahora puedes iniciar sesión.');
                    showLoginForm();
                    isLoginMode = true;
                    document.querySelector('.auth-switch').style.display = 'block';
                    
                    // Limpiar formularios
                    registerForm.reset();
                    granjaForm.reset();
                    
                } catch (error) {
                    showError(error.message);
                } finally {
                    hideLoading();
                }
            });
        });