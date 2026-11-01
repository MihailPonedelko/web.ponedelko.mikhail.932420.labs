var storageKey = 'lab05-state';
var theme = 'light';
var hypotheses = [
    { id: 1, title: 'Алгоритмы рекомендаций', text: 'Персональные рекомендации влияют на выбор пользователя.', checked: false },
    { id: 2, title: 'Параллельные вычисления', text: 'Параллельная обработка сокращает время расчёта.', checked: false },
    { id: 3, title: 'Прогнозирование', text: 'Модель машинного обучения может точнее предсказывать результат.', checked: false }
];

var hypothesisList = document.querySelector('.hypothesis-list');
var addButton = document.getElementById('add-hypothesis');
var toggleButton = document.getElementById('toggle-hypotheses');
var themeButton = document.getElementById('theme-button');
var countElement = document.getElementById('hypothesis-count');
var messageElement = document.getElementById('hypothesis-message');

function showHypothesisMessage(text, isError) {
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.classList.toggle('error', isError);
    }
}

function isValidState(state) {
    if (!state || !Array.isArray(state.hypotheses) ||
        (state.theme !== 'light' && state.theme !== 'dark')) {
        return false;
    }
    var ids = [];
    for (var i = 0; i < state.hypotheses.length; i++) {
        var item = state.hypotheses[i];
        if (!item || !Number.isSafeInteger(item.id) || item.id < 1 ||
            typeof item.title !== 'string' || typeof item.text !== 'string' ||
            item.text.trim() === '' || typeof item.checked !== 'boolean' ||
            ids.indexOf(item.id) !== -1) {
            return false;
        }
        ids.push(item.id);
    }
    return true;
}

function loadState() {
    try {
        var saved = localStorage.getItem(storageKey);
        if (saved === null) {
            return;
        }
        var state = JSON.parse(saved);
        if (!isValidState(state)) {
            throw new Error('Неверный формат сохранённых данных');
        }
        hypotheses = state.hypotheses;
        theme = state.theme;
    } catch (error) {
        showHypothesisMessage('Не удалось прочитать сохранённое состояние. Показаны исходные гипотезы.', true);
        console.warn('Ошибка чтения localStorage:', error.message);
    }
}

function saveState() {
    try {
        localStorage.setItem(storageKey, JSON.stringify({ hypotheses: hypotheses, theme: theme }));
        return true;
    } catch (error) {
        showHypothesisMessage('Изменения показаны на странице, но сохранить их не удалось.', true);
        console.warn('Ошибка записи localStorage:', error.message);
        return false;
    }
}

function applyTheme() {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    if (themeButton) {
        themeButton.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
        themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
}

function changeStatus(id) {
    for (var i = 0; i < hypotheses.length; i++) {
        if (hypotheses[i].id === id) {
            hypotheses[i].checked = !hypotheses[i].checked;
            break;
        }
    }
    renderHypotheses();
    if (saveState()) {
        showHypothesisMessage('Статус гипотезы изменён.', false);
    }
}

function deleteHypothesis(id) {
    for (var i = 0; i < hypotheses.length; i++) {
        if (hypotheses[i].id === id) {
            hypotheses.splice(i, 1);
            break;
        }
    }
    renderHypotheses();
    if (saveState()) {
        showHypothesisMessage('Гипотеза удалена.', false);
    }
}

function createHypothesisCard(item) {
    var card = document.createElement('article');
    card.className = 'hypothesis-card';
    card.classList.toggle('is-checked', item.checked);
    card.setAttribute('data-id', String(item.id));

    var title = document.createElement('h3');
    title.textContent = item.title;
    var text = document.createElement('p');
    text.textContent = item.text;
    var status = document.createElement('p');
    status.textContent = 'Статус: ' + (item.checked ? 'проверена' : 'не проверена');

    var changeButton = document.createElement('button');
    changeButton.type = 'button';
    changeButton.textContent = 'Изменить статус';
    changeButton.setAttribute('aria-pressed', String(item.checked));
    changeButton.addEventListener('click', function () {
        changeStatus(item.id);
    });

    var deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', function () {
        deleteHypothesis(item.id);
    });

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(status);
    card.appendChild(changeButton);
    card.appendChild(deleteButton);
    return card;
}

function renderHypotheses() {
    if (!hypothesisList) {
        showHypothesisMessage('Не найден список гипотез.', true);
        return;
    }
    while (hypothesisList.firstChild) {
        hypothesisList.removeChild(hypothesisList.firstChild);
    }
    for (var i = 0; i < hypotheses.length; i++) {
        hypothesisList.appendChild(createHypothesisCard(hypotheses[i]));
    }
    var cards = document.querySelectorAll('.hypothesis-card');
    if (countElement) {
        countElement.textContent = 'Всего гипотез: ' + cards.length;
    }
    if (hypotheses.length === 0) {
        var empty = document.createElement('p');
        empty.textContent = 'Список гипотез пуст.';
        hypothesisList.appendChild(empty);
    }
}

function addHypothesis() {
    var text = prompt('Введите формулировку гипотезы:');
    if (text === null) {
        return;
    }
    text = text.trim();
    if (text === '') {
        showHypothesisMessage('Введите непустую формулировку гипотезы.', true);
        return;
    }
    var id = 1;
    for (var i = 0; i < hypotheses.length; i++) {
        if (hypotheses[i].id >= id) {
            id = hypotheses[i].id + 1;
        }
    }
    hypotheses.push({ id: id, title: 'Гипотеза №' + id, text: text, checked: false });
    renderHypotheses();
    if (saveState()) {
        showHypothesisMessage('Гипотеза добавлена.', false);
    }
}

function toggleHypotheses() {
    if (!hypothesisList) {
        showHypothesisMessage('Не найден список гипотез.', true);
        return;
    }
    hypothesisList.hidden = !hypothesisList.hidden;
    toggleButton.textContent = hypothesisList.hidden ? 'Показать гипотезы' : 'Скрыть гипотезы';
    toggleButton.setAttribute('aria-expanded', String(!hypothesisList.hidden));
}

function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
    if (saveState()) {
        showHypothesisMessage('Тема сохранена.', false);
    }
}

function initializeHypotheses() {
    if (!hypothesisList || !addButton || !toggleButton || !themeButton ||
        !countElement || !messageElement) {
        showHypothesisMessage('Не найдены элементы для работы с гипотезами.', true);
        console.warn('Не найдены элементы для работы с гипотезами');
        return;
    }
    loadState();
    applyTheme();
    renderHypotheses();
    addButton.addEventListener('click', addHypothesis);
    toggleButton.addEventListener('click', toggleHypotheses);
    themeButton.addEventListener('click', toggleTheme);
}

initializeHypotheses();
