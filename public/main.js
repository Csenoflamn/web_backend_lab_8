window.onload = init;
function init() {
	let d = document;
	let burger = d.querySelector(".burger");
	burger.addEventListener("click", toggleMenu);

	let links = Array.from(d.querySelectorAll(".nav-header__link"));
	links.forEach((elem) => {
		elem.addEventListener("click", closeMenu);
	})

	let photo__buttons = Array.from(d.querySelectorAll(".nav-photo__btn"));
	photo__buttons.forEach((elem) => {
		elem.addEventListener("click", () => {
			let active__button = d.querySelector(".nav-photo_active");

			active__button.classList.remove("nav-photo_active");
			elem.classList.add("nav-photo_active");

			let country = Array.from(elem.classList).filter((elem) => {
				return elem.match(/country_/);
			}).toString().split("_")[1];
			console.log(country);

			let photoes = Array.from(document.querySelectorAll(".images-photo__image img"));
			photoes.forEach((elem, i) => {
				elem.setAttribute("src", `images/photo/${country}/photo_${i + 1}.png`);
			})
		})
	})

	const companies = d.querySelector(".companies__container");
	let isDragging = false;
	let startX, initialX;
	companies.addEventListener("mousedown", (event) => {
		if (window.innerWidth > 912) {
			isDragging = true;

			startX = event.clientX;
			initialX = companies.offsetLeft;

			d.body.style.cursor = "grabbing";

			event.preventDefault();
		}
	})
	d.addEventListener("mousemove", (event) => {
		if (window.innerWidth > 912 && isDragging) {
			const deltaX = event.clientX - startX;
			companies.style.left = (initialX + deltaX) + 'px';
		}
	})
	d.addEventListener("mouseup", () => {
		if (window.innerWidth > 912) {
			isDragging = false;
			d.body.style.cursor = "default";
		}

	})
	// Инициализация фото-слайдера
	function initPhotoSlider() {
		const slider = document.querySelector('.photo-slider');
		const slides = document.querySelectorAll('.photo-slide');
		const dots = document.querySelectorAll('.photo-dot');
		const prevBtn = document.querySelector('.photo-prev-btn');
		const nextBtn = document.querySelector('.photo-next-btn');
		const currentSlideElement = document.querySelector('.current-slide');
		const totalSlidesElement = document.querySelector('.total-slides');

		let currentSlide = 0;
		const totalSlides = slides.length;

		// Устанавливаем общее количество слайдов
		totalSlidesElement.textContent = totalSlides;

		// Функция перехода к определенному слайду
		function goToSlide(slideIndex) {
			// Корректируем индекс для циклической навигации
			if (slideIndex >= totalSlides) {
				currentSlide = 0;
			} else if (slideIndex < 0) {
				currentSlide = totalSlides - 1;
			} else {
				currentSlide = slideIndex;
			}

			// Перемещаем слайдер
			slider.style.transform = `translateX(-${currentSlide * 100}%)`;

			// Обновляем активную точку
			dots.forEach((dot, index) => {
				if (index === currentSlide) {
					dot.classList.add('active');
				} else {
					dot.classList.remove('active');
				}
			});

			// Обновляем счетчик
			currentSlideElement.textContent = currentSlide + 1;
		}

		// События для кнопок навигации
		if (prevBtn) {
			prevBtn.addEventListener('click', () => {
				goToSlide(currentSlide - 1);
			});
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', () => {
				goToSlide(currentSlide + 1);
			});
		}

		// События для точек-индикаторов
		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				goToSlide(index);
			});
		});

		// Автоматическое перелистывание (каждые 5 секунд)
		let autoSlideInterval = setInterval(() => {
			goToSlide(currentSlide + 1);
		}, 5000);

		// Остановка автоматического перелистывания при наведении мыши
		const sliderContainer = document.querySelector('.photo-slider-container');
		if (sliderContainer) {
			sliderContainer.addEventListener('mouseenter', () => {
				clearInterval(autoSlideInterval);
			});

			// Возобновление автоматического перелистывания при уходе мыши
			sliderContainer.addEventListener('mouseleave', () => {
				autoSlideInterval = setInterval(() => {
					goToSlide(currentSlide + 1);
				}, 5000);
			});
		}

		// Поддержка клавиатуры
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				goToSlide(currentSlide - 1);
			} else if (e.key === 'ArrowRight') {
				goToSlide(currentSlide + 1);
			}
		});

		// Адаптивность при изменении размера окна
		window.addEventListener('resize', () => {
			slider.style.transform = `translateX(-${currentSlide * 100}%)`;
		});
	}

	// Вызов функции инициализации слайдера в конце функции init
	initPhotoSlider();

	// Функционал сохранения данных формы в localStorage
	function initFormLocalStorage() {
		const form = document.getElementById('contactForm');
		const nameInput = document.getElementById('formName');
		const emailInput = document.getElementById('formEmail');
		const messageInput = document.getElementById('formMessage');

		if (!form) return;

		// Функция сохранения данных в localStorage
		function saveFormData() {
			const formData = {
				name: nameInput.value,
				email: emailInput.value,
				message: messageInput.value
			};
			localStorage.setItem('contactFormData', JSON.stringify(formData));
		}

		// Функция загрузки данных из localStorage
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

		// Функция очистки данных формы
		function clearFormData() {
			localStorage.removeItem('contactFormData');
			nameInput.value = '';
			emailInput.value = '';
			messageInput.value = '';
			console.log('Form data cleared from localStorage');
		}

		// Загружаем сохраненные данные при загрузке страницы
		loadFormData();

		// Сохраняем данные при вводе (с небольшой задержкой для производительности)
		let saveTimeout;
		function scheduleSave() {
			clearTimeout(saveTimeout);
			saveTimeout = setTimeout(saveFormData, 500);
		}

		// Слушаем события ввода
		nameInput.addEventListener('input', scheduleSave);
		emailInput.addEventListener('input', scheduleSave);
		messageInput.addEventListener('input', scheduleSave);

		// Обработка отправки формы
		form.addEventListener('submit', function (e) {
			e.preventDefault();

			// Здесь можно добавить отправку данных на сервер
			console.log('Form submitted:', {
				name: nameInput.value,
				email: emailInput.value,
				message: messageInput.value
			});

			// После отправки можно очистить форму и localStorage
			// clearFormData(); // Раскомментируйте, если хотите очищать после отправки

			// Или просто показать сообщение об успехе
			alert('Thank you! Your message has been saved. Form data persists in browser storage.');

			return false;
		});

		// Дополнительно: кнопка для ручной очистки (опционально, можно добавить в форму)
		// Можно добавить эту кнопку если нужно
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

		clearButton.addEventListener('click', function () {
			if (confirm('Are you sure you want to clear all saved form data?')) {
				clearFormData();
				alert('Form data cleared!');
			}
		});

		// Добавляем кнопку очистки после кнопки отправки
		const submitButton = form.querySelector('.submit__btn');
		if (submitButton) {
			submitButton.parentNode.parentNode.appendChild(clearButton);
		}

		// Также сохраняем данные при уходе со страницы (на всякий случай)
		window.addEventListener('beforeunload', saveFormData);

		console.log('Form localStorage functionality initialized');
	}

	// Вызов функции инициализации формы
	initFormLocalStorage();

    // Перехват отправки формы
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // отменяем стандартную отправку

        // Собираем данные
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        // Клиентская валидация (дублируем серверную для быстрой обратной связи)
        let errors = {};
        if (name.length < 2) errors.name = 'Имя должно быть не короче 2 символов';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Введите корректный email';
        if (Object.keys(errors).length > 0) {
            alert('Ошибки: ' + Object.values(errors).join('\n'));
            return;
        }

        // Определяем, есть ли сохранённый ID пользователя (после регистрации)
        let userId = localStorage.getItem('userId');
        let url = '/api/users';
        let method = 'POST';
        if (userId) {
            url = `/api/users/${userId}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                if (method === 'POST') {
                    // Регистрация: сохраняем id, показываем логин и пароль
                    if (data.success && data.id) {
                        localStorage.setItem('userId', data.id);
                        alert(`Регистрация успешна!\nЛогин: ${data.login}\nПароль: ${data.password}`);
                        // Можно также вывести на страницу, но для простоты alert
                    }
                } else {
                    // Обновление
                    alert('Данные успешно обновлены!');
                }
            } else {
                // Ошибка от сервера
                if (data.errors) {
                    let msg = Object.values(data.errors).join('\n');
                    alert('Ошибка: ' + msg);
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
}
window.addEventListener("resize", () => {
	let header_active = Array.from(document.querySelectorAll(".header ._active"));
	if (header_active && window.innerWidth > 600) {
		header_active.forEach((elem) => {
			elem.classList.remove("_active");
		})
		document.body.classList.remove("menu-open");
	}
})

function toggleMenu() {
	let d = document;
	let navbar = d.querySelector(".nav-header");
	navbar.classList.toggle("_active");
	let header = d.querySelector(".header__content");
	header.classList.toggle("_active");
	let body = d.body;
	body.classList.toggle("menu-open")
}

function closeMenu() {
	if (document.body.classList.contains("menu-open")) {
		let d = document;
		let navbar = d.querySelector(".nav-header");
		navbar.classList.remove("_active");
		let header = d.querySelector(".header__content");
		header.classList.remove("_active");
		let body = d.body;
		body.classList.remove("menu-open")
	}
}