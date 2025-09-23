document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Lógica del Menú Móvil (Toggle y UX)
    ========================================= */
    const menuBtn = document.getElementById('menuBtn');
    const menuIcon = document.getElementById('menuIcon');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    /**
     * Alterna la visibilidad del menú móvil y cambia el ícono del botón (hamburguesa <-> cerrar).
     */
    const toggleMenu = () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!isExpanded));

        // 1. Alternar clases de altura para el efecto de deslizamiento vertical.
        mobileMenu.classList.toggle('max-h-0');
        mobileMenu.classList.toggle('max-h-96'); 

        // 2. Cambiar el ícono (Phosophor Icons: ph-list <-> ph-x).
        if (isExpanded) {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        } else {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        }
    };

    // Evento principal para abrir/cerrar el menú
    menuBtn.addEventListener('click', toggleMenu);

    // Evento para cerrar el menú automáticamente al hacer clic en un enlace (Mejora la UX móvil)
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn.getAttribute('aria-expanded') === 'true') {
                toggleMenu();
            }
        });
    });


    /* =========================================
       2. Lógica del Scroll Indicator (Barra de Progreso)
    ========================================= */
    const progressBar = document.getElementById('progressBar');

    /**
     * Actualiza el ancho de la barra de progreso en función del porcentaje de desplazamiento de la página.
     */
    const updateProgressBar = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // La fórmula calcula el porcentaje de scroll respecto al contenido total visible.
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    };

    // Asigna la función de actualización al evento de scroll global.
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Ejecuta una vez al cargar para establecer la posición inicial.


    /* =========================================
       3. Lógica del Fade-in al Scroll (Intersection Observer)
    ========================================= */
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // Observa respecto al viewport
        rootMargin: '0px',
        threshold: 0.2 // El callback se dispara cuando el 20% del elemento es visible.
    };

    /**
     * Callback para el Intersection Observer. Añade la clase 'appear' para iniciar la animación CSS.
     */
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Se detiene la observación para optimizar el rendimiento.
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Adjunta el observador a todos los elementos con la clase '.fade-in'.
    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    /* =========================================
       4. Lógica de Cambio de Imagen por Miniatura (Galería de Productos)
    ========================================= */
    const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
    const productImageDisplay = document.getElementById('productImageDisplay');

    /**
     * Maneja el clic en las miniaturas, actualizando la imagen principal y el estado 'active'.
     */
    thumbnailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remueve el estado activo del botón anterior.
            thumbnailButtons.forEach(btn => btn.classList.remove('active'));

            // Añade el estado activo al botón clickeado.
            this.classList.add('active');

            // Obtiene la URL de la imagen a mostrar.
            const newSrc = this.getAttribute('data-img-src');

            // Transición suave: reduce la opacidad, cambia la fuente y restablece la opacidad.
            productImageDisplay.style.opacity = '0';
            setTimeout(() => {
                productImageDisplay.src = newSrc;
                productImageDisplay.style.opacity = '1';
            }, 200); 
        });
    });


    /* =========================================
       5. Lógica de la Calculadora de Proyecto (Inclusión de Costo)
    ========================================= */
    const ROLL_LENGTH_METERS = 305; // Longitud estándar del rollo (1000 ft ≈ 304.8m)
    const PRICE_PER_ROLL_USD = 187.00;

    const networkPointsInput = document.getElementById('networkPoints');
    const avgDistanceInput = document.getElementById('avgDistance');
    const wasteFactorSelect = document.getElementById('wasteFactor');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const totalMetersDisplay = document.getElementById('totalMeters');
    const totalRollsDisplay = document.getElementById('totalRolls');
    const totalCostDisplay = document.getElementById('totalCost');

    /**
     * Realiza todos los cálculos de cable, rollos y costo basados en los inputs del usuario.
     */
    const calculateCable = () => {
        // 1. Obtener y parsear valores de input.
        const points = parseInt(networkPointsInput.value) || 0;
        const distance = parseFloat(avgDistanceInput.value) || 0;
        const wasteFactor = parseInt(wasteFactorSelect.value) / 100;

        if (points <= 0 || distance <= 0) {
            // Muestra valores por defecto si los inputs son inválidos.
            totalMetersDisplay.textContent = '0 m';
            totalRollsDisplay.textContent = '0 rollos';
            totalCostDisplay.textContent = '$0.00 USD';
            return;
        }

        // 2. Calcular el total de metros con el factor de desperdicio incluido.
        const rawMeters = points * distance;
        const totalMetersRequired = rawMeters * (1 + wasteFactor);

        // 3. Calcular la cantidad de rollos requeridos (siempre redondeando hacia el siguiente rollo).
        const totalRolls = Math.ceil(totalMetersRequired / ROLL_LENGTH_METERS);

        // 4. Calcular el costo total.
        const totalCost = totalRolls * PRICE_PER_ROLL_USD;

        // 5. Renderizar los resultados en la interfaz.
        totalMetersDisplay.textContent = `${Math.round(totalMetersRequired)} m`;
        totalRollsDisplay.textContent = `${totalRolls} rollos`;
        totalCostDisplay.textContent = `$${totalCost.toFixed(2)} USD`;
    };

    // Eventos para disparar el cálculo: clic en el botón y cambios en cualquier input.
    calculateBtn.addEventListener('click', calculateCable);
    networkPointsInput.addEventListener('input', calculateCable);
    avgDistanceInput.addEventListener('input', calculateCable);
    wasteFactorSelect.addEventListener('change', calculateCable);
    
    // Ejecuta el cálculo al cargar la página para mostrar los resultados iniciales.
    calculateCable();


    /* =========================================
       6. Lógica de Breadcrumbs (Migas de Pan) - Generación Dinámica
    ========================================= */
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    const breadcrumbData = [
        // Define la estructura de las migas de pan.
        { name: 'Inicio', href: '#inicio', active: false },
        { name: 'Cableado Estructurado', href: 'https://ds3comunicaciones.com/amp/CableadoEstructurado.html', active: false },
        { name: 'Categoría 6', href: 'https://ds3comunicaciones.com/amp/Cat6.html', active: false },
        { name: 'Cable UTP AMP Cat 6', href: '#', active: true } // El último elemento es el actual.
    ];

    /**
     * Itera sobre los datos y crea dinámicamente los elementos HTML (enlaces y separadores).
     */
    breadcrumbData.forEach((item, index) => {
        // Decide si crear un <span> (elemento activo) o un <a> (enlace).
        const element = document.createElement(item.active ? 'span' : 'a');
        element.textContent = item.name;
        element.classList.add('breadcrumb-item');
        
        if (item.active) {
            // Estilos y atributos para el elemento activo (accesibilidad).
            element.classList.add('active');
            element.setAttribute('aria-current', 'page');
        } else {
            // Atributos para los enlaces (navegación).
            element.href = item.href;
            element.title = `Ir a ${item.name}`;
            element.classList.add('hover:text-primary-custom/70'); 
        }

        breadcrumbContainer.appendChild(element);

        // Añade el separador '/' si no es el último elemento de la lista.
        if (index < breadcrumbData.length - 1) {
            const separator = document.createElement('span');
            separator.textContent = '/';
            separator.classList.add('breadcrumb-separator');
            breadcrumbContainer.appendChild(separator);
        }
    });

});