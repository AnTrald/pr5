let token = null;

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Проверяем сохраненную тему
if (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Переключатель темы
themeToggle.addEventListener('click', () => {
    console.log('test');
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});



document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            messageElement.textContent = result.message || 'Регистрация успешна!';
            messageElement.className = 'mt-3 text-center text-sm text-green-500'; // Зелёный цвет
        } else {
            messageElement.textContent = result.message || 'Ошибка регистрации';
            messageElement.className = 'mt-3 text-center text-sm text-red-500'; // Красный цвет
        }
    } catch (error) {
        messageElement.textContent = 'Ошибка сети';
        messageElement.className = 'mt-3 text-center text-sm text-red-500';
    }
});


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Вход выполнен успешно!';
            messageElement.className = 'mt-3 text-center text-sm text-green-500'; // Зелёный цвет
            token = result.token; // Сохраняем токен
        } else {
            messageElement.textContent = result.message || 'Неверные данные';
            messageElement.className = 'mt-3 text-center text-sm text-red-500'; // Красный цвет
        }
    } catch (error) {
        messageElement.textContent = 'Ошибка сети';
        messageElement.className = 'mt-3 text-center text-sm text-red-500';
    }
});


document.getElementById('fetchProtectedData').addEventListener('click', async () => {
    const dataElement = document.getElementById('protectedData');

    if (!token) {
        dataElement.textContent = 'Сначала выполните вход';
        dataElement.className = 'mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm dark:text-gray-200 text-red-500';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/protected', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const result = await response.json();
            dataElement.textContent = JSON.stringify(result, null, 2);
            dataElement.className = 'mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm dark:text-gray-200 text-green-500'; // Зелёный
        } else {
            dataElement.textContent = 'Доступ запрещён';
            dataElement.className = 'mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm dark:text-gray-200 text-red-500'; // Красный
        }
    } catch (error) {
        dataElement.textContent = 'Ошибка сети';
        dataElement.className = 'mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm dark:text-gray-200 text-red-500';
    }
});