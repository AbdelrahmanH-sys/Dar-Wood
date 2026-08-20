/* ========================================
   Timber & Furniture Showroom - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initBackToTop();
    initGalleryThumbs();
    initSizeSelectors();
    initFilterToggle();
    initShopFilters();
    initHeroSlider();
});

/* ========== NAVBAR ========== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.mobile-overlay');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========== PRODUCT GALLERY THUMBNAILS ========== */
function initGalleryThumbs() {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const mainImg = document.querySelector('.gallery-main img');
    if (!thumbs.length || !mainImg) return;

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const newSrc = thumb.querySelector('img').src;
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = newSrc;
                mainImg.style.opacity = '1';
            }, 200);
        });
    });

    mainImg.style.transition = 'opacity 0.3s ease';
}

/* ========== SIZE / THICKNESS SELECTORS ========== */
function initSizeSelectors() {
    const selectors = document.querySelectorAll('.selector-group');

    selectors.forEach(group => {
        const options = group.querySelectorAll('.selector-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    });
}

/* ========== FILTER TOGGLE (SHOP SIDEBAR) ========== */
function initFilterToggle() {
    const toggle = document.querySelector('.sidebar-toggle');
    const filterContent = document.querySelector('.filter-content');

    if (!toggle || !filterContent) return;

    toggle.addEventListener('click', () => {
        filterContent.classList.toggle('open');
        toggle.textContent = filterContent.classList.contains('open') ? 'إخفاء الفلاتر' : 'إظهار الفلاتر';
    });
}

/* ========== SHOP FILTERS ========== */
function initShopFilters() {
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const productCards = document.querySelectorAll('.product-card[data-category]');
    const sortSelect = document.querySelector('.sort-select');
    const resultCount = document.querySelector('.result-count');

    if (!checkboxes.length) return;

    function applyFilters() {
        const checkedCategories = [];
        const checkedMaterials = [];

        checkboxes.forEach(cb => {
            const group = cb.closest('.filter-group');
            if (!group) return;
            const groupTitle = group.querySelector('h4')?.textContent || '';

            if (cb.checked) {
                if (groupTitle.includes('التصنيف')) {
                    checkedCategories.push(cb.value);
                } else if (groupTitle.includes('المادة')) {
                    checkedMaterials.push(cb.value);
                }
            }
        });

        let visibleCount = 0;

        productCards.forEach(card => {
            const category = card.dataset.category || '';
            const material = card.dataset.material || '';

            const matchCategory = checkedCategories.length === 0 || checkedCategories.includes(category);
            const matchMaterial = checkedMaterials.length === 0 || checkedMaterials.includes(material);

            if (matchCategory && matchMaterial) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (resultCount) {
            resultCount.innerHTML = `عرض <strong>${visibleCount}</strong> منتج`;
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const grid = document.querySelector('.products-grid');
            if (!grid) return;

            const cards = Array.from(grid.querySelectorAll('.product-card'));

            cards.sort((a, b) => {
                const priceA = parseInt(a.dataset.price || '0');
                const priceB = parseInt(b.dataset.price || '0');

                switch (sortSelect.value) {
                    case 'price-low': return priceA - priceB;
                    case 'price-high': return priceB - priceA;
                    case 'name': return (a.dataset.name || '').localeCompare(b.dataset.name || '', 'ar');
                    default: return 0;
                }
            });

            cards.forEach(card => grid.appendChild(card));
        });
    }
}

/* ========== WHATSAPP MESSAGE ========== */
function sendWhatsApp(productName) {
    const phone = '201080722856';
    const message = encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${productName}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

/* ========== CONTACT FORM ========== */
function handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('[name="name"]')?.value;
    const phone = form.querySelector('[name="phone"]')?.value;
    const message = form.querySelector('[name="message"]')?.value;

    if (!name || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }

    const waPhone = '201080722856';
    const waMessage = encodeURIComponent(`مرحباً، أنا ${name}\nرقم الهاتف: ${phone}\n${message || ''}`);
    window.open(`https://wa.me/${waPhone}?text=${waMessage}`, '_blank');
}

/* ========== HERO SLIDER ========== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    let current = 0;

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
}
