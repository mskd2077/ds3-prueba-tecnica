document.addEventListener('DOMContentLoaded', () => {
            // Animaciones de entrada progresivas
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });

            // --- Lógica para el Navbar del Cliente ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const closeMenuButton = document.getElementById('close-menu');
            const menuOverlay = document.getElementById('menu-overlay');
            const searchButton = document.getElementById('search-button');
            const mobileSearchButton = document.getElementById('mobile-search-button');
            const searchModal = document.getElementById('search-modal');
            const closeSearchButton = document.getElementById('close-search');

            const openMenu = () => {
                mobileMenu.classList.remove('-translate-x-full');
                menuOverlay.classList.remove('hidden');
            };

            const closeMenu = () => {
                mobileMenu.classList.add('-translate-x-full');
                menuOverlay.classList.add('hidden');
            };

            const openSearch = () => searchModal.classList.remove('hidden');
            const closeSearch = () => searchModal.classList.add('hidden');

            if (mobileMenuButton) mobileMenuButton.addEventListener('click', openMenu);
            if (closeMenuButton) closeMenuButton.addEventListener('click', closeMenu);
            if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

            if (searchButton) searchButton.addEventListener('click', openSearch);
            if (mobileSearchButton) mobileSearchButton.addEventListener('click', openSearch);
            if (closeSearchButton) closeSearchButton.addEventListener('click', closeSearch);

            // --- Lógica para el cambio de imágenes mejorada ---
            const thumbnailBtns = document.querySelectorAll('.thumbnail-btn');
            const productImageDisplay = document.getElementById('productImageDisplay');

            thumbnailBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const newImgSrc = btn.dataset.imgSrc;
                    if (!newImgSrc) return; // si falta, no hace nada

                    // efecto suave
                    productImageDisplay.style.opacity = "0";
                    setTimeout(() => {
                        productImageDisplay.src = newImgSrc;
                        productImageDisplay.style.opacity = "1";
                    }, 200);

                    // actualizar botón activo
                    thumbnailBtns.forEach(b => b.classList.remove("ring-2", "ring-accent"));
                    btn.classList.add("ring-2", "ring-accent");
                });
            });


            // --- Lógica de la Calculadora Mejorada ---
            const calculateBtn = document.getElementById('calculateBtn');
            const PRICE_PER_ROLL = 187.00;
            const METERS_PER_ROLL = 305;

            const calculateProject = () => {
                const points = parseInt(document.getElementById('networkPoints').value) || 0;
                const distance = parseFloat(document.getElementById('avgDistance').value) || 0;
                const waste = parseFloat(document.getElementById('wasteFactor').value) || 0;

                if (points === 0 || distance === 0) {
                    // Si no hay datos, mostramos el resultado inicial
                    const initialMeters = 24 * 50 * (1 + 15 / 100);
                    const initialRolls = Math.ceil(initialMeters / METERS_PER_ROLL);
                    const initialCost = initialRolls * PRICE_PER_ROLL;

                    document.getElementById('totalMeters').textContent = `${initialMeters.toLocaleString()} m`;
                    document.getElementById('totalRolls').textContent = `${initialRolls} rollos`;
                    document.getElementById('totalCost').textContent = `$${initialCost.toFixed(2)} USD`;
                    return;
                }

                const baseMeters = points * distance;
                const totalMeters = baseMeters * (1 + waste / 100);
                const totalRolls = Math.ceil(totalMeters / METERS_PER_ROLL);
                const totalCost = totalRolls * PRICE_PER_ROLL;

                // Actualizar con animación
                const updateElement = (id, value) => {
                    const element = document.getElementById(id);
                    element.style.transform = 'scale(1.1)';
                    element.style.color = 'var(--accent)';
                    setTimeout(() => {
                        element.textContent = value;
                        element.style.transform = 'scale(1)';
                    }, 150);
                };

                updateElement('totalMeters', `${totalMeters.toLocaleString(undefined, { maximumFractionDigits: 0 })} m`);
                updateElement('totalRolls', `${totalRolls} rollo${totalRolls > 1 ? 's' : ''}`);
                updateElement('totalCost', `$${totalCost.toFixed(2)} USD`);
            };

            if (calculateBtn) {
                calculateBtn.addEventListener('click', calculateProject);

                // Calcular automáticamente cuando cambian los valores
                ['networkPoints', 'avgDistance', 'wasteFactor'].forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.addEventListener('input', calculateProject);
                        element.addEventListener('change', calculateProject);
                    }
                });
            }

            // Ejecutar cálculo inicial
            calculateProject();

            // Scroll suave para enlaces internos
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

            const details = document.querySelectorAll("aside details");

            details.forEach((targetDetail) => {
                targetDetail.addEventListener("toggle", () => {
                    if (targetDetail.open) {
                        details.forEach((detail) => {
                            if (detail !== targetDetail) {
                                detail.open = false;
                            }
                        });
                    }
                });
            });
        });