# Контрольная работа №2 — ТехноЛавка на Bootstrap

Учебный интернет-магазин техники для практических занятий 9–10 по теме CSS-фреймворков. Используются Bootstrap 5 через CDN, адаптивная 12-колоночная сетка и готовые компоненты. Это статический демонстрационный интерфейс: форма проверяется в браузере, данные не отправляются на сервер.

## Страницы
- `index.html` — главная: шапка, hero-блок, преимущества и популярные товары (практика 9).
- `catalog.html` — каталог из шести товаров с карточками, badge, alert, modal и accordion.
- `product.html` — подробная карточка наушников с характеристиками и accordion.
- `order.html` — форма заявки с `form-control`, `form-select`, `input-group`, `form-check`.
- `css/custom.css` — минимальные дополнительные стили; `js/main.js` — демонстрационная проверка формы.

## Запуск
Откройте `index.html` в браузере. Интернет нужен для загрузки Bootstrap с CDN. В каталоге кнопки «Заказать» открывают модальное окно; форма заявки показывает результат проверки, но никуда не отправляет данные.

## Практическая работа 9
Подключены Bootstrap CSS, JS Bundle и `css/custom.css`. Главная использует `container`, `row`, `col-*`, брейкпоинты и gutters `g-*`; добавлены шапка, navbar, hero, преимущества, товары и footer.

## Практическая работа 10
На всех страницах единая адаптивная navbar с мобильным меню и dropdown. Созданы каталог, страница товара и форма. Использованы `card`, `btn`, `badge`, `alert`, `modal`, `accordion`, `form-control`, `form-select`, `input-group`, `form-check`.

## Технологии и структура
HTML5 · Bootstrap 5.3.8 · CSS · JavaScript · Git

```text
kr2-bootstrap-shop/
├── index.html
├── catalog.html
├── product.html
├── order.html
├── css/custom.css
├── js/main.js
├── images/
└── README.md
```

## GitHub
Создай отдельный репозиторий `kr2-bootstrap-shop`, добавь его как `origin`, отправь ветку `feature/bootstrap-components` и создай Pull Request в `main`. Итоговую ссылку на репозиторий сдавай в СДО.
