// Переключение категорий услуг
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    if (categoryTabs.length > 0 && categoryContents.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetCategory = this.dataset.category;
                
                // Удаляем активный класс у всех вкладок
                categoryTabs.forEach(t => t.classList.remove('active'));
                // Добавляем активный класс текущей вкладке
                this.classList.add('active');
                
                // Скрываем все категории
                categoryContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Показываем выбранную категорию
                const targetContent = document.getElementById(targetCategory);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    
    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', function() {
            navList.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
    }
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Фильтрация галереи (плавное появление/скрытие без резкого скачка сетки)
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        function applyGalleryFilter(category) {
            galleryItems.forEach((item) => {
                const show = category === 'all' || item.dataset.category === category;
                item.classList.toggle('gallery-item--hidden', !show);
            });
        }

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                filterBtns.forEach((b) => b.classList.remove('active'));
                this.classList.add('active');
                applyGalleryFilter(this.dataset.category);
            });
        });
    }
});

// Открытие фото в полном размере (lightbox)
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Закрыть">&times;</button>
        <img class="lightbox-image" src="" alt="">
    `;

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt || 'Фото работы';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            const image = item.querySelector('.gallery-image img');
            if (!image) return;

            e.preventDefault();
            openLightbox(image.src, image.alt);
        });
    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    document.body.appendChild(lightbox);
});

// Система отзывов
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка "Оставить отзыв"
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewFormSection = document.getElementById('reviewFormSection');
    const cancelReviewBtn = document.getElementById('cancelReviewBtn');
    const reviewForm = document.getElementById('reviewForm');
    
    if (addReviewBtn && reviewFormSection) {
        addReviewBtn.addEventListener('click', function() {
            reviewFormSection.style.display = 'block';
            reviewFormSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (cancelReviewBtn && reviewFormSection) {
        cancelReviewBtn.addEventListener('click', function() {
            reviewFormSection.style.display = 'none';
            reviewForm.reset();
            resetRatingStars();
        });
    }
    
    // Рейтинг звезды
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('rating');
    
    if (ratingStars.length > 0 && ratingInput) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                ratingInput.value = rating;
                updateRatingStars(rating);
            });
            
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                updateRatingStars(rating);
            });
        });
        
        document.querySelector('.rating-input').addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value) || 0;
            updateRatingStars(currentRating);
        });
    }
    
    function updateRatingStars(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }
    
    function resetRatingStars() {
        ratingStars.forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
        if (ratingInput) ratingInput.value = 0;
    }
    
    function formatReviewDate(dateString) {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function buildStarsHTML(rating) {
        return Array(5).fill('').map((_, i) =>
            i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
    }

    function renderReviews(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        if (!reviews.length) {
            reviewsList.innerHTML = '<p>Пока нет одобренных отзывов. Будьте первым!</p>';
            return;
        }

        reviewsList.innerHTML = reviews.map((review) => `
            <div class="review-card" data-rating="${review.rating}" data-created-at="${review.createdAt}">
                <div class="review-header">
                    <div class="review-author">
                        <div class="author-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="author-info">
                            <h4>${review.name}</h4>
                            <div class="review-date">${formatReviewDate(review.createdAt)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${buildStarsHTML(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                </div>
                <div class="review-service">Услуга: ${review.service}</div>
            </div>
        `).join('');
    }

    async function loadApprovedReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        try {
            const response = await fetch('/api/reviews');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Не удалось загрузить отзывы');
            }

            renderReviews(data.reviews || []);
        } catch (error) {
            reviewsList.innerHTML = '<p>Не удалось загрузить отзывы. Попробуйте позже.</p>';
        }
    }

    loadApprovedReviews();

    // Отправка формы отзыва
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(reviewForm);
            const reviewData = {
                name: formData.get('name'),
                service: formData.get('service'),
                rating: Number(formData.get('rating')),
                content: formData.get('review')
            };

            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            try {
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(reviewData)
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Не удалось отправить отзыв');
                }

                reviewFormSection.style.display = 'none';
                reviewForm.reset();
                resetRatingStars();
                showNotification('Спасибо за ваш отзыв! Он будет опубликован после модерации.');
            } catch (error) {
                showNotification(error.message || 'Ошибка отправки отзыва');
            }
        });
    }
});

// Сортировка отзывов
document.addEventListener('DOMContentLoaded', function() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    
    if (sortBtns.length > 0) {
        sortBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                sortBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const sortType = this.dataset.sort;
                const reviewsList = document.getElementById('reviewsList');
                if (!reviewsList) return;
                const reviewsArray = Array.from(reviewsList.querySelectorAll('.review-card'));
                
                if (sortType === 'rating') {
                    reviewsArray.sort((a, b) => {
                        const ratingA = parseInt(a.dataset.rating) || 0;
                        const ratingB = parseInt(b.dataset.rating) || 0;
                        return ratingB - ratingA;
                    });
                } else if (sortType === 'newest') {
                    reviewsArray.sort((a, b) => {
                        const dateA = new Date(a.dataset.createdAt || 0);
                        const dateB = new Date(b.dataset.createdAt || 0);
                        return dateB - dateA;
                    });
                }
                
                reviewsArray.forEach(review => {
                    reviewsList.appendChild(review);
                });
            });
        });
    }
});

// Форма записи
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                booking_date: formData.get('date'),
                booking_time: formData.get('time'),
                message: formData.get('message')
            };

            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(bookingData)
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Не удалось отправить запись');
                }

                showNotification('Спасибо за запись! Мы свяжемся с вами в ближайшее время для подтверждения.');
                bookingForm.reset();
            } catch (error) {
                showNotification(error.message || 'Ошибка отправки формы');
            }
        });
    }
});

// Уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Скрываем через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Анимация при прокрутке
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    const animatedElements = document.querySelectorAll('.service-card, .review-card, .contact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Изменение хедера при прокрутке
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--bg-white)';
            header.style.backdropFilter = 'none';
        }
    }
});

// Валидация форм
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Удаляем предыдущие ошибки
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Проверка на пустое поле
    if (!value && field.hasAttribute('required')) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Проверка email
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email';
        }
    }
    
    // Проверка телефона
    if (field.type === 'tel' && value) {
        const phonePattern = /^[\d\s\-\+\(\)]+$/;
        if (!phonePattern.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
        }
    }
    
    // Показываем ошибку если есть
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        `;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// Маска для телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    formattedValue = '+7';
                    value = value.substring(1);
                } else {
                    formattedValue = '+7';
                }
                
                if (value.length > 0) {
                    formattedValue += ' (' + value.substring(0, 3);
                }
                if (value.length >= 4) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length >= 7) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length >= 9) {
                    formattedValue += '-' + value.substring(8, 10);
                }
            }
            
            e.target.value = formattedValue;
        });
    });
});

// Установка минимальной даты для формы записи
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
});

// Ленивая загрузка изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
});

// Авторизация: вход и регистрация
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    async function sendAuthRequest(url, payload) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка запроса');
        }

        return data;
    }

    function saveSession(data) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);

            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const data = await sendAuthRequest('/api/auth/register', payload);
                saveSession(data);
                showNotification('Регистрация прошла успешно. Вы вошли в систему.');
                registerForm.reset();
            } catch (error) {
                showNotification(error.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);

            const payload = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const data = await sendAuthRequest('/api/auth/login', payload);
                saveSession(data);
                showNotification('Вход выполнен успешно.');
                if (data.user?.role === 'admin') {
                    window.location.href = 'admin.html';
                }
                loginForm.reset();
            } catch (error) {
                showNotification(error.message);
            }
        });
    }
});

// Админ-панель
document.addEventListener('DOMContentLoaded', function() {
    const bookingsList = document.getElementById('adminBookingsList');
    const pendingReviewsList = document.getElementById('adminPendingReviewsList');
    const statusText = document.getElementById('adminStatusText');

    if (!bookingsList || !pendingReviewsList || !statusText) {
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        statusText.textContent = 'Требуется вход администратора. Перенаправляю на страницу входа...';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
        return;
    }

    async function authFetch(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка запроса');
        }

        return data;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString('ru-RU');
    }

    function bookingActionsHTML(id, status) {
        return `
            <div class="form-buttons">
                <button class="btn btn-outline admin-booking-status-btn" data-id="${id}" data-status="pending">Ожидает</button>
                <button class="btn btn-primary admin-booking-status-btn" data-id="${id}" data-status="confirmed">Подтвердить</button>
                <button class="btn btn-outline admin-booking-status-btn" data-id="${id}" data-status="cancelled">Отменить</button>
            </div>
            <p style="margin-top: 10px;">Текущий статус: <strong>${status}</strong></p>
        `;
    }

    function renderBookings(bookings) {
        if (!bookings.length) {
            bookingsList.innerHTML = '<p>Нет записей, ожидающих подтверждения. После подтверждения или отмены они скрываются из списка.</p>';
            return;
        }

        bookingsList.innerHTML = bookings.map((booking) => `
            <div class="review-card">
                <div class="review-header">
                    <div class="author-info">
                        <h4>${booking.name}</h4>
                        <div class="review-date">Создано: ${formatDate(booking.createdAt)}</div>
                    </div>
                </div>
                <div class="review-content">
                    <p><strong>Телефон:</strong> ${booking.phone}</p>
                    <p><strong>Email:</strong> ${booking.email || '-'}</p>
                    <p><strong>Услуга:</strong> ${booking.service}</p>
                    <p><strong>Дата/время:</strong> ${formatDate(booking.bookingDate)} ${booking.bookingTime}</p>
                    <p><strong>Комментарий:</strong> ${booking.message || '-'}</p>
                </div>
                ${bookingActionsHTML(booking.id, booking.status)}
            </div>
        `).join('');
    }

    function renderPendingReviews(reviews) {
        if (!reviews.length) {
            pendingReviewsList.innerHTML = '<p>Новых отзывов на модерации нет.</p>';
            return;
        }

        pendingReviewsList.innerHTML = reviews.map((review) => `
            <div class="review-card">
                <div class="review-header">
                    <div class="author-info">
                        <h4>${review.name}</h4>
                        <div class="review-date">${formatDate(review.createdAt)}</div>
                    </div>
                </div>
                <div class="review-content">
                    <p><strong>Услуга:</strong> ${review.service}</p>
                    <p><strong>Оценка:</strong> ${review.rating}/5</p>
                    <p>${review.content}</p>
                </div>
                <div class="form-buttons">
                    <button class="btn btn-primary admin-review-approve-btn" data-id="${review.id}">Одобрить</button>
                    <button class="btn btn-outline admin-review-delete-btn" data-id="${review.id}">Удалить</button>
                </div>
            </div>
        `).join('');
    }

    async function loadAdminData() {
        try {
            const meData = await authFetch('/api/auth/me');
            if (meData.user.role !== 'admin') {
                throw new Error('Доступ только для администратора');
            }

            statusText.textContent = `Вы вошли как администратор: ${meData.user.email}`;

            const [bookingsData, pendingReviewsData] = await Promise.all([
                authFetch('/api/admin/bookings'),
                authFetch('/api/admin/reviews/pending')
            ]);

            renderBookings(bookingsData.bookings || []);
            renderPendingReviews(pendingReviewsData.reviews || []);
        } catch (error) {
            statusText.textContent = error.message;
            bookingsList.innerHTML = '<p>Нет доступа к данным.</p>';
            pendingReviewsList.innerHTML = '';
            if (error.message.includes('авторизация') || error.message.includes('администратора')) {
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1400);
            }
        }
    }

    bookingsList.addEventListener('click', async function(e) {
        const button = e.target.closest('.admin-booking-status-btn');
        if (!button) return;

        const bookingId = Number(button.dataset.id);
        const newStatus = button.dataset.status;

        try {
            await authFetch(`/api/admin/bookings/${bookingId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            showNotification('Статус записи обновлен');
            loadAdminData();
        } catch (error) {
            showNotification(error.message);
        }
    });

    pendingReviewsList.addEventListener('click', async function(e) {
        const approveButton = e.target.closest('.admin-review-approve-btn');
        const deleteButton = e.target.closest('.admin-review-delete-btn');

        try {
            if (approveButton) {
                const reviewId = Number(approveButton.dataset.id);
                await authFetch(`/api/admin/reviews/${reviewId}/approve`, { method: 'PATCH' });
                showNotification('Отзыв одобрен');
                loadAdminData();
                return;
            }

            if (deleteButton) {
                const reviewId = Number(deleteButton.dataset.id);
                await authFetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
                showNotification('Отзыв удален');
                loadAdminData();
            }
        } catch (error) {
            showNotification(error.message);
        }
    });

    loadAdminData();
});
