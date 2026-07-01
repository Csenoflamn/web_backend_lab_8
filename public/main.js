window.onload = init;

function init() {
    let d = document;
    let burger = d.querySelector(".burger");
    if (burger) burger.addEventListener("click", toggleMenu);

    let links = Array.from(d.querySelectorAll(".nav-header__link"));
    links.forEach((elem) => {
        elem.addEventListener("click", closeMenu);
    });

    let photo__buttons = Array.from(d.querySelectorAll(".nav-photo__btn"));
    photo__buttons.forEach((elem) => {
        elem.addEventListener("click", () => {
            let active__button = d.querySelector(".nav-photo_active");
            if (active__button) active__button.classList.remove("nav-photo_active");
            elem.classList.add("nav-photo_active");

            let country = Array.from(elem.classList).filter((cls) => cls.match(/country_/)).toString().split("_")[1];
            console.log(country);
            let photoes = Array.from(document.querySelectorAll(".images-photo__image img"));
            photoes.forEach((img, i) => {
                img.setAttribute("src", `images/photo/${country}/photo_${i + 1}.png`);
            });
        });
    });

    const companies = d.querySelector(".companies__container");
    let isDragging = false;
    let startX, initialX;
    if (companies) {
        companies.addEventListener("mousedown", (event) => {
            if (window.innerWidth > 912) {
                isDragging = true;
                startX = event.clientX;
                initialX = companies.offsetLeft;
                d.body.style.cursor = "grabbing";
                event.preventDefault();
            }
        });
        d.addEventListener("mousemove", (event) => {
            if (window.innerWidth > 912 && isDragging) {
                const deltaX = event.clientX - startX;
                companies.style.left = (initialX + deltaX) + 'px';
            }
        });
        d.addEventListener("mouseup", () => {
            if (window.innerWidth > 912) {
                isDragging = false;
                d.body.style.cursor = "default";
            }
        });
    }

    initPhotoSlider();

    function updateLogoutButton() {
        const userId = localStorage.getItem('userId');
        const existingBtn = document.getElementById('logoutBtn');

        if (userId) {
            if (!existingBtn) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.textContent = '🚪 Выйти (сбросить данные)';
                logoutBtn.style.cssText = `
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 10px 0;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                `;
                const form = document.getElementById('contactForm');
                if (form) {
                    form.parentNode.insertBefore(logoutBtn, form.nextSibling);
                }
                logoutBtn.addEventListener('click', function() {
                    if (confirm('Вы действительно хотите выйти? Данные будут сброшены.')) {
                        localStorage.removeItem('userId');
                        alert('Вы вышли. Страница будет перезагружена.');
                        location.reload();
                    }
                });
            }
        } else {
            if (existingBtn) existingBtn.remove();
        }
    }

    updateLogoutButton();

    const loginBtn = document.getElementById('loginModeBtn');
    const registerBtn = document.getElementById('registerModeBtn');
    const passwordField = document.getElementById('passwordField');
    const submitBtn = document.getElementById('submitBtn');
    const nameField = document.getElementById('formName');
    const messageField = document.getElementById('formMessage');

    let currentMode = 'login';

    function setMode(mode) {
        currentMode = mode;
        if (mode === 'login') {
            if (loginBtn) loginBtn.style.background = '#5221E6';
            if (registerBtn) registerBtn.style.background = '#181823';
            if (passwordField) passwordField.style.display = 'block';
            if (submitBtn) submitBtn.textContent = 'ВОЙТИ';
        } else {
            if (loginBtn) loginBtn.style.background = '#181823';
            if (registerBtn) registerBtn.style.background = '#5221E6';
            if (passwordField) passwordField.style.display = 'none';
            if (submitBtn) submitBtn.textContent = 'ЗАРЕГИСТРИРОВАТЬСЯ';
        }
    }

    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', () => setMode('login'));
        registerBtn.addEventListener('click', () => setMode('register'));
    }
    setMode('login');

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('formEmail').value.trim();
            const password = document.getElementById('formPassword').value.trim();
            const name = document.getElementById('formName').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            let errors = {};
            if (currentMode === 'login') {
                if (!email) errors.email = 'Введите email';
                if (!password) errors.password = 'Введите пароль';
            } else {
                if (!email) errors.email = 'Введите email';
                if (name.length < 2) errors.name = 'Имя должно быть не короче 2 символов';
            }

            if (Object.keys(errors).length > 0) {
                alert('Ошибки:\n' + Object.values(errors).join('\n'));
                return;
            }

            let url, method, payload;
            if (currentMode === 'login') {
                url = '/lab_8/public/index.php?route=api/login';
                method = 'POST';
                payload = { email, password };
            } else {
                url = '/lab_8/public/index.php?route=api/users';
                method = 'POST';
                payload = { name, email, message };
            }

            try {
                console.log('Отправляем запрос:', method, url);
                console.log('Данные:', payload);

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(payload)
                });

                console.log('Статус ответа:', response.status);

                const text = await response.text();
                console.log('Текст ответа:', text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('Невалидный JSON:', text);
                    alert('Ошибка сервера. Ответ не является JSON.');
                    return;
                }

                if (response.ok) {
                    if (currentMode === 'login') {
                        // Успешный вход
                        if (data.success && data.id) {
                            localStorage.setItem('userId', data.id);
                            alert('Вход выполнен успешно!');
                            updateLogoutButton();
                        }
                    } else {
                        // Регистрация
                        if (data.success && data.id) {
                            localStorage.setItem('userId', data.id);
                            alert(`Регистрация успешна!\nЛогин: ${data.login}\nПароль: ${data.password}`);
                            updateLogoutButton();
                        }
                    }
                } else {
                    if (data.errors) {
                        let msg = Object.values(data.errors).join('\n');
                        alert('Ошибка:\n' + msg);
                    } else {
                        alert('Произошла ошибка. Попробуйте ещё раз.');
                    }
                }
            } catch (error) {
                console.error('Ошибка запроса:', error);
                alert('Не удалось отправить запрос. Проверьте соединение.');
            }
        });
    }

    initFormLocalStorage();
}


function initPhotoSlider() {
    const slider = document.querySelector('.photo-slider');
    const slides = document.querySelectorAll('.photo-slide');
    const dots = document.querySelectorAll('.photo-dot');
    const prevBtn = document.querySelector('.photo-prev-btn');
    const nextBtn = document.querySelector('.photo-next-btn');
    const currentSlideElement = document.querySelector('.current-slide');
    const totalSlidesElement = document.querySelector('.total-slides');

    if (!slider || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    if (totalSlidesElement) totalSlidesElement.textContent = totalSlides;

    function goToSlide(slideIndex) {
        if (slideIndex >= totalSlides) currentSlide = 0;
        else if (slideIndex < 0) currentSlide = totalSlides - 1;
        else currentSlide = slideIndex;

        slider.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        if (currentSlideElement) currentSlideElement.textContent = currentSlide + 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    let autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);

    const sliderContainer = document.querySelector('.photo-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
        else if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    window.addEventListener('resize', () => {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    });
}

function toggleMenu() {
    let d = document;
    let navbar = d.querySelector(".nav-header");
    if (navbar) navbar.classList.toggle("_active");
    let header = d.querySelector(".header__content");
    if (header) header.classList.toggle("_active");
    let body = d.body;
    body.classList.toggle("menu-open");
}

function closeMenu() {
    if (document.body.classList.contains("menu-open")) {
        let d = document;
        let navbar = d.querySelector(".nav-header");
        if (navbar) navbar.classList.remove("_active");
        let header = d.querySelector(".header__content");
        if (header) header.classList.remove("_active");
        document.body.classList.remove("menu-open");
    }
}

function initFormLocalStorage() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');

    if (!form) return;

    function saveFormData() {
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }

    function loadFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                nameInput.value = formData.name || '';
                emailInput.value = formData.email || '';
                messageInput.value = formData.message || '';
                console.log('Form data loaded from localStorage');
            } catch (e) {
                console.error('Error parsing saved form data:', e);
                localStorage.removeItem('contactFormData');
            }
        }
    }

    function clearFormData() {
        localStorage.removeItem('contactFormData');
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        console.log('Form data cleared from localStorage');
    }

    loadFormData();

    let saveTimeout;
    function scheduleSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveFormData, 500);
    }

    nameInput.addEventListener('input', scheduleSave);
    emailInput.addEventListener('input', scheduleSave);
    messageInput.addEventListener('input', scheduleSave);

    form.addEventListener('submit', function(e) {
        console.log('Form submitted (localStorage)');
    });

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear Saved Data';
    clearButton.className = 'clear-btn';
    clearButton.style.cssText = `
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 20px;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
    `;

    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all saved form data?')) {
            clearFormData();
            alert('Form data cleared!');
        }
    });

    const submitButton = form.querySelector('.submit__btn');
    if (submitButton) {
        submitButton.parentNode.parentNode.appendChild(clearButton);
    }

    window.addEventListener('beforeunload', saveFormData);
    console.log('Form localStorage functionality initialized');
}

window.addEventListener("resize", () => {
    let header_active = Array.from(document.querySelectorAll(".header ._active"));
    if (header_active && window.innerWidth > 600) {
        header_active.forEach((elem) => elem.classList.remove("_active"));
        document.body.classList.remove("menu-open");
    }
});