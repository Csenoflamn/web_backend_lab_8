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

		totalSlidesElement.textContent = totalSlides;

		function goToSlide(slideIndex) {
			if (slideIndex >= totalSlides) {
				currentSlide = 0;
			} else if (slideIndex < 0) {
				currentSlide = totalSlides - 1;
			} else {
				currentSlide = slideIndex;
			}

			slider.style.transform = `translateX(-${currentSlide * 100}%)`;

			dots.forEach((dot, index) => {
				if (index === currentSlide) {
					dot.classList.add('active');
				} else {
					dot.classList.remove('active');
				}
			});

			currentSlideElement.textContent = currentSlide + 1;
		}

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

		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				goToSlide(index);
			});
		});

		let autoSlideInterval = setInterval(() => {
			goToSlide(currentSlide + 1);
		}, 5000);

		const sliderContainer = document.querySelector('.photo-slider-container');
		if (sliderContainer) {
			sliderContainer.addEventListener('mouseenter', () => {
				clearInterval(autoSlideInterval);
			});

			sliderContainer.addEventListener('mouseleave', () => {
				autoSlideInterval = setInterval(() => {
					goToSlide(currentSlide + 1);
				}, 5000);
			});
		}

		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				goToSlide(currentSlide - 1);
			} else if (e.key === 'ArrowRight') {
				goToSlide(currentSlide + 1);
			}
		});

		window.addEventListener('resize', () => {
			slider.style.transform = `translateX(-${currentSlide * 100}%)`;
		});
	}

	initPhotoSlider();

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

		form.addEventListener('submit', function (e) {
			e.preventDefault();

			console.log('Form submitted:', {
				name: nameInput.value,
				email: emailInput.value,
				message: messageInput.value
			});

			alert('Thank you! Your message has been saved. Form data persists in browser storage.');

			return false;
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

		clearButton.addEventListener('click', function () {
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

	initFormLocalStorage();

const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        let errors = {};
        if (name.length < 2) errors.name = 'Имя должно быть не короче 2 символов';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Введите корректный email';
        if (Object.keys(errors).length > 0) {
            alert('Ошибки: ' + Object.values(errors).join('\n'));
            return;
        }

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
                    if (data.success && data.id) {
                        localStorage.setItem('userId', data.id);
                        alert(`Регистрация успешна!\nЛогин: ${data.login}\nПароль: ${data.password}`);
                    }
                } else {
                    alert('Данные успешно обновлены!');
                }
            } else {
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