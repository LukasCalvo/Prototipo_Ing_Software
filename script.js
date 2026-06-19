document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Elementos Principales ---
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    
    const userSidebar = document.getElementById('user-sidebar');
    const adminSidebar = document.getElementById('admin-sidebar');
    
    const allModules = document.querySelectorAll('.module');
    const navButtons = document.querySelectorAll('.nav-btn');
    const logoutButtons = document.querySelectorAll('.btn-logout');

    // --- 2. Lógica de Inicio de Sesión (Con Dos Botones) ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Validar que se hayan llenado RUT y Contraseña
            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }

            // Identificar cuál botón fue presionado para enviar el formulario
            const selectedRole = e.submitter.id === 'btn-login-admin' ? 'admin' : 'user';

            // Ocultar todas las pantallas y desmarcar botones
            allModules.forEach(mod => mod.classList.add('hidden'));
            navButtons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });

            // Mostrar la vista que corresponde al botón apretado
            if (selectedRole === 'admin') {
                userSidebar.classList.add('hidden');
                adminSidebar.classList.remove('hidden');
                
                document.getElementById('admin-validar').classList.remove('hidden');
                document.querySelector('[data-target="admin-validar"]').classList.add('active');
            } else {
                adminSidebar.classList.add('hidden');
                userSidebar.classList.remove('hidden');
                
                document.getElementById('dashboard').classList.remove('hidden');
                document.querySelector('[data-target="dashboard"]').classList.add('active');
            }

            // Quitar pantalla de login y mostrar la app
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
        });
    }

    // --- 3. Lógica de Cerrar Sesión ---
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Limpiar los campos de usuario y contraseña
            loginForm.reset();
            
            // Ocultar la aplicación y volver a mostrar el login
            mainApp.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        });
    });

    // --- 4. Lógica de Navegación Aislada ---
    navButtons.forEach(btn => {
        // Ignoramos los botones de cerrar sesión porque ya tienen su propia lógica
        if(btn.classList.contains('btn-logout')) return;

        btn.addEventListener('click', () => {
            const parentSidebar = btn.closest('.sidebar');
            
            if (parentSidebar && parentSidebar.classList.contains('hidden')) {
                return; 
            }

            parentSidebar.querySelectorAll('.nav-btn').forEach(b => {
                if(!b.classList.contains('btn-logout')) {
                    b.classList.remove('active');
                    b.removeAttribute('aria-current');
                }
            });

            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');

            allModules.forEach(mod => mod.classList.add('hidden'));

            const targetId = btn.getAttribute('data-target');
            const targetModule = document.getElementById(targetId);
            if (targetModule) {
                targetModule.classList.remove('hidden');
            }
        });
    });

    // --- 5. Prevención de Errores: Modal de Confirmación ---
    const modal = document.getElementById('confirm-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const btnConfirm = document.getElementById('btn-confirm');
    const reviewDataContainer = document.getElementById('modal-data-review');
    
    const formsToConfirm = [
        document.getElementById('form-vehiculos'), 
        document.getElementById('form-sag'), 
        document.getElementById('form-nuevo-tramite'),
        document.getElementById('form-permisos')
    ];
    
    let currentForm = null;

    formsToConfirm.forEach(form => {
        if(!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            currentForm = form;
            populateReviewData(form);
            openModal();
        });
    });

    function populateReviewData(form) {
        const formData = new FormData(form);
        let reviewHTML = '<ul>';
        for (let [key, value] of formData.entries()) {
            if(value === 'on') value = 'Sí';
            if(value.trim() !== '') { 
                reviewHTML += `<li><strong>${formatLabel(key)}:</strong> ${value}</li>`;
            }
        }
        reviewHTML += '</ul>';
        reviewDataContainer.innerHTML = reviewHTML;
    }

    function formatLabel(str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
    }

    function openModal() {
        modal.classList.remove('hidden');
        reviewDataContainer.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
        currentForm = null;
    }

    if(btnCancel) btnCancel.addEventListener('click', closeModal);
    
    if(btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            alert('Acción confirmada y procesada exitosamente.');
            closeModal();
            if(currentForm) currentForm.reset(); 
            
            // Volver a la pantalla principal según el rol activo
            if(!userSidebar.classList.contains('hidden')) {
                document.querySelector('[data-target="dashboard"]').click(); 
            } else {
                document.querySelector('[data-target="admin-validar"]').click();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});