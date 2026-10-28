// Демонстрация формы без отправки персональных данных на сервер.
document.addEventListener('DOMContentLoaded', () => {
  const productInput = document.getElementById('modal-product');
  const title = document.getElementById('orderModalLabel');
  document.querySelectorAll('[data-bs-target="#orderModal"]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.dataset.product || '';
      if (productInput) productInput.value = product;
      if (title) title.textContent = product ? `Заявка: ${product}` : 'Быстрая заявка';
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
});
