document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const modules = document.querySelectorAll('.module');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botones
            navButtons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');

            const targetId = btn.getAttribute('data-target');
            modules.forEach(mod => {
                if(mod.id === targetId) {
                    mod.classList.remove('hidden');
                } else {
                    mod.classList.add('hidden');
                }
            });
        });
    });

    const modal = document.getElementById('confirm-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const btnConfirm = document.getElementById('btn-confirm');
    const reviewDataContainer = document.getElementById('modal-data-review');
    
    const formsToConfirm = [document.getElementById('form-vehiculos'), document.getElementById('form-sag')];
    let currentForm = null;

    formsToConfirm.forEach(form => {
        if(!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validación nativa básica
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
            reviewHTML += `<li><strong>${formatLabel(key)}:</strong> ${value}</li>`;
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

    btnCancel.addEventListener('click', closeModal);
    
    btnConfirm.addEventListener('click', () => {
        alert('Trámite confirmado y enviado exitosamente a los servidores de Aduanas.');
        closeModal();
        if(currentForm) currentForm.reset();
        
        navButtons[0].click(); 
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});