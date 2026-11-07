// Демонстрационная запись: форма проверяется в браузере и не отправляет данные.
document.addEventListener('DOMContentLoaded', () => {
  const serviceSelect = document.getElementById('visit-service');
  const modalService = document.getElementById('modal-service');
  const modalTitle = document.getElementById('appointmentModalLabel');

  document.querySelectorAll('[data-bs-target="#appointmentModal"]').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.service || '';
      if (modalService) modalService.value = service;
      if (modalTitle) modalTitle.textContent = service ? `Запись: ${service}` : 'Записать питомца';
      if (serviceSelect && service) {
        const option = [...serviceSelect.options].find((item) => item.text === service);
        if (option) serviceSelect.value = option.value || option.text;
      }
    });
  });

  document.querySelectorAll('.js-demo-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('[data-form-status]');
      if (status) status.classList.remove('d-none');
    });
    form.addEventListener('reset', () => {
      const status = form.querySelector('[data-form-status]');
      if (status) status.classList.add('d-none');
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (serviceSelect && params.get('service') === 'consultation') {
    serviceSelect.value = 'Первичный приём терапевта';
  }
});
