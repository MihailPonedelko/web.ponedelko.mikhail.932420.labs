var measurements = [];

function readMeasurements(text) {
    text = text.trim();
    if (text === '') {
        return null;
    }
    var parts = text.split(/[\s,;]+/);
    if (parts.length < 5 || parts.length > 7) {
        return null;
    }
    var values = [];
    for (var i = 0; i < parts.length; i++) {
        var value = Number(parts[i]);
        if (parts[i] === '' || !Number.isFinite(value)) {
            return null;
        }
        values.push(value);
    }
    return values;
}

function findMax(values) {
    var maximum = values[0];
    for (var i = 1; i < values.length; i++) {
        if (values[i] > maximum) {
            maximum = values[i];
        }
    }
    return maximum;
}

function findMin(values) {
    var minimum = values[0];
    for (var i = 1; i < values.length; i++) {
        if (values[i] < minimum) {
            minimum = values[i];
        }
    }
    return minimum;
}

function calculateSum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
}

function calculateAverage(values) {
    return calculateSum(values) / values.length;
}

function filterAboveAverage(values) {
    var average = calculateAverage(values);
    var result = [];
    for (var i = 0; i < values.length; i++) {
        if (values[i] > average) {
            result.push(values[i]);
        }
    }
    return result;
}

function reportAnomalies() {
    var maximum = findMax(measurements);
    var minimum = findMin(measurements);
    var lowValues = [];
    for (var i = 0; i < measurements.length; i++) {
        if (measurements[i] <= maximum * 0.1) {
            lowValues.push(measurements[i]);
        }
    }
    console.log('Аномально низкие значения:', lowValues);
    console.log('Количество аномально низких значений:', lowValues.length);
    if (maximum - minimum > 50) {
        console.log('Наблюдается высокая вариативность данных');
    }
}

function getResults() {
    var text = prompt('Введите от 5 до 7 измерений через пробел, запятую или точку с запятой. Дробная часть — через точку. Например: 5 10 25 40 60 80 100');
    if (text === null) {
        return;
    }
    var values = readMeasurements(text);
    if (values === null) {
        alert('Нужно ввести от 5 до 7 чисел. Пример: 5 10 25 40 60 80 100');
        return;
    }
    measurements = values;
    document.getElementById('measurement-data').textContent = 'Полученные измерения: ' + measurements.join(', ');
    document.getElementById('maximum-result').textContent = '';
    document.getElementById('sum-result').textContent = '';
    document.getElementById('filter-result').textContent = '';
    document.getElementById('measurement-actions').hidden = false;
    reportAnomalies();
}

function showMaximum() {
    if (measurements.length === 0) {
        return;
    }
    document.getElementById('maximum-result').textContent = 'Максимум: ' + findMax(measurements);
}

function showSum() {
    if (measurements.length === 0) {
        return;
    }
    document.getElementById('sum-result').textContent = 'Сумма: ' + calculateSum(measurements);
}

function showFilteredValues() {
    if (measurements.length === 0) {
        return;
    }
    var average = calculateAverage(measurements);
    var filtered = filterAboveAverage(measurements);
    document.getElementById('filter-result').textContent = 'Значения выше среднего: ' +
        (filtered.length === 0 ? 'нет' : filtered.join(', '));
    alert('Среднее значение – ' + average.toFixed(2).replace('.', ',') +
        ', ' + filtered.length + ' измерений – выше среднего');
}

function performAll() {
    if (measurements.length === 0) {
        return;
    }
    showMaximum();
    showSum();
    reportAnomalies();
    showFilteredValues();
}
