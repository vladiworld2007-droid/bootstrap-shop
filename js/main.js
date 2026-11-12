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


// Дополнительные интерактивные функции учебного сайта.
document.addEventListener('DOMContentLoaded', () => {
  const storage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    remove(key) { try { localStorage.removeItem(key); } catch {} }
  };
  const el = (id) => document.getElementById(id);
  const putText = (node, value) => { node.textContent = String(value); };
  const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

  const reviewsList = el('reviews-list');
  const reviewsForm = el('review-form');
  if (reviewsList && reviewsForm) {
    const drawReviews = () => {
      reviewsList.replaceChildren();
      const reviews = storage.get('clinicReviewsV1', []);
      if (!reviews.length) {
        const empty = document.createElement('p');
        empty.className = 'text-secondary';
        empty.textContent = 'Пока нет отзывов. Вы можете оставить первый!';
        reviewsList.append(empty);
      }
      reviews.slice().reverse().forEach((r) => {
        const article = document.createElement('article');
        article.className = 'card border-0 shadow-sm';
        const body = document.createElement('div');
        body.className = 'card-body';
        const title = document.createElement('strong');
        title.textContent = r.name;
        const stars = document.createElement('div');
        stars.className = 'text-warning';
        stars.textContent = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const content = document.createElement('p');
        content.className = 'mb-0';
        content.textContent = r.text;
        body.append(title, stars, content);
        article.append(body);
        reviewsList.append(article);
      });
    };
    drawReviews();
    reviewsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!reviewsForm.reportValidity()) return;
      const reviews = storage.get('clinicReviewsV1', []);
      reviews.push({
        name: el('review-name').value.trim().slice(0, 60),
        rating: Number(el('review-rating').value),
        text: el('review-text').value.trim().slice(0, 500)
      });
      if (!storage.set('clinicReviewsV1', reviews.slice(-30))) {
        alert('Не удалось сохранить отзыв в браузере.');
        return;
      }
      reviewsForm.reset();
      drawReviews();
    });
  }

  const petForm = el('pet-form');
  if (petForm) {
    const fields = ['name', 'type', 'age', 'weight', 'vaccines'];
    const ids = ['pet-card-name', 'pet-card-type', 'pet-card-age', 'pet-card-weight', 'pet-card-vaccines'];
    const preview = el('pet-preview');
    const drawPet = () => {
      const pet = storage.get('clinicPetV1', null);
      preview.replaceChildren();
      if (!pet) { preview.textContent = 'Карточка пока не создана.'; return; }
      const heading = document.createElement('h4');
      heading.className = 'h5';
      heading.textContent = '🐾 ' + pet.name;
      const details = document.createElement('p');
      details.className = 'mb-0';
      details.textContent = `${pet.type} · ${pet.age} лет · ${pet.weight} кг. Вакцинации: ${pet.vaccines || 'не указаны'}`;
      preview.append(heading, details);
    };
    const saved = storage.get('clinicPetV1', null);
    if (saved) ids.forEach((id, i) => { el(id).value = saved[fields[i]] ?? ''; });
    drawPet();
    petForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!petForm.reportValidity()) return;
      const pet = {};
      ids.forEach((id, i) => { pet[fields[i]] = el(id).value.trim(); });
      if (!storage.set('clinicPetV1', pet)) { alert('Не удалось сохранить карточку.'); return; }
      drawPet();
    });
    el('pet-delete').addEventListener('click', () => {
      storage.remove('clinicPetV1');
      petForm.reset();
      drawPet();
    });
  }

  const calculator = el('calculator-options');
  if (calculator) {
    const update = () => {
      const total = [...calculator.querySelectorAll('.calc-service:checked')]
        .reduce((sum, input) => sum + Number(input.value), 0);
      putText(el('calculator-total'), money(total));
    };
    calculator.addEventListener('change', update);
    update();
  }

  const booking = el('booking-form');
  const dateInput = el('visit-date');
  const timeSelect = el('visit-time');
  if (booking && dateInput && timeSelect) {
    const localDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    const today = localDate(new Date());
    dateInput.min = today;
    const updateTimes = () => {
      timeSelect.replaceChildren();
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Выберите время';
      timeSelect.append(placeholder);
      if (!dateInput.value || dateInput.value < localDate(new Date())) return;
      for (let hour = 9; hour < 21; hour++) {
        for (const minutes of ['00', '30']) {
          const value = `${String(hour).padStart(2, '0')}:${minutes}`;
          const chosen = new Date(`${dateInput.value}T${value}:00`);
          if (chosen <= new Date()) continue;
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          timeSelect.append(option);
        }
      }
    };
    dateInput.addEventListener('change', updateTimes);
    booking.addEventListener('reset', () => setTimeout(updateTimes, 0));
    updateTimes();
    // Перехватываем только форму записи; старые демонстрационные формы остаются без изменений.
    booking.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!booking.reportValidity()) return;
      const record = Object.fromEntries(new FormData(booking).entries());
      const bookings = storage.get('clinicBookingsV1', []);
      bookings.push(record);
      const status = booking.querySelector('[data-form-status]');
      if (!storage.set('clinicBookingsV1', bookings.slice(-20))) {
        status.textContent = 'Не удалось сохранить запись в браузере.';
        status.className = 'alert alert-warning mb-0';
      } else {
        status.textContent = `Демонстрационная запись на ${record.date} в ${record.time} сохранена в этом браузере. Клиника не получила заявку. Для подтверждения позвоните +7 (961) 535-11-33.`;
        status.className = 'alert alert-success mb-0';
      }
    }, true);
  }

  const chatToggle = el('chat-toggle');
  const chatPanel = el('chat-panel');
  if (chatToggle && chatPanel) {
    const toggle = (open) => {
      chatPanel.classList.toggle('d-none', !open);
      chatToggle.setAttribute('aria-expanded', String(open));
      if (open) el('chat-input').focus();
    };
    chatToggle.addEventListener('click', () => toggle(chatPanel.classList.contains('d-none')));
    el('chat-close').addEventListener('click', () => { toggle(false); chatToggle.focus(); });
    const addMessage = (text, user) => {
      const msg = document.createElement('div');
      msg.className = 'chat-bubble ' + (user ? 'chat-bubble-user' : 'chat-bubble-bot');
      msg.textContent = text;
      const log = el('chat-messages');
      log.append(msg);
      log.scrollTop = log.scrollHeight;
    };
    el('chat-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = el('chat-input');
      const question = input.value.trim();
      if (!question) return;
      addMessage(question, true);
      input.value = '';
      const q = question.toLowerCase();
      let answer = 'Я демонстрационный помощник. Могу подсказать часы работы, цены, адрес и способ записи. Для консультации врача позвоните в клинику.';
      if (/врем|час|работ|открыт/.test(q)) answer = 'Мы указали часы работы: ежедневно с 9:00 до 21:00.';
      else if (/цен|стоим|сколько|руб/.test(q)) answer = 'Первичный приём — 1 800 ₽, вакцинация — от 1 500 ₽, УЗИ — от 2 200 ₽. Полный список и калькулятор есть в разделе «Услуги».';
      else if (/адрес|где|наход|проезд/.test(q)) answer = 'Адрес на сайте: Москва, Манежная площадь, 1. Карта доступна в разделе «Контакты».';
      else if (/запис|приём|прием|свобод/.test(q)) answer = 'Откройте раздел «Запись» и выберите услугу, дату и время. Это демонстрация, для реального подтверждения позвоните +7 (961) 535-11-33.';
      else if (/сроч|плохо|кров|не дыш|отрав/.test(q)) answer = 'При экстренной ситуации не ждите ответа в чате: немедленно обратитесь в ближайшую работающую ветеринарную клинику.';
      addMessage(answer, false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !chatPanel.classList.contains('d-none')) toggle(false);
    });
  }
});
