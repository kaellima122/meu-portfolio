/**
 * Kael Junior Portfolio - Core Engine
 * Responsabilidades: Gestão de sliders independentes, lightbox sincronizado, 
 * navegação por teclado e animações de interface.
 */

const Portfolio = {
    // Cache de Estado e Elementos
    state: {
        sliderPositions: [],
        activeProjectIndex: null,
    },
    
    elements: {
        wrappers: null,
        lightbox: null,
        imgAmpliada: null,
        counter: null,
    },

    // Inicialização do Sistema
    init() {
        // Cache de elementos do DOM para performance
        this.elements.wrappers = document.querySelectorAll('.slider-wrapper');
        this.elements.lightbox = document.getElementById('lightbox');
        this.elements.imgAmpliada = document.getElementById('img-ampliada');
        this.elements.counter = document.getElementById('lb-counter');

        // Inicialização dinâmica: cria uma posição 0 para cada projeto encontrado no HTML
        this.state.sliderPositions = Array.from(this.elements.wrappers).map(() => 0);

        this.setupAnimations();
        this.setupEventListeners();
    },

    // 1. GESTÃO DOS SLIDERS
    moveSlider(direction, sliderIndex) {
        const currentWrapper = this.elements.wrappers[sliderIndex];
        if (!currentWrapper) return;

        const images = currentWrapper.querySelectorAll('img');
        const totalImages = images.length;

        // Atualiza estado
        let newPos = this.state.sliderPositions[sliderIndex] + direction;

        // Lógica de Loop
        if (newPos >= totalImages) newPos = 0;
        if (newPos < 0) newPos = totalImages - 1;

        this.state.sliderPositions[sliderIndex] = newPos;

        // Aplica Transformação
        currentWrapper.style.transform = `translateX(${newPos * -100}%)`;

        // Sincroniza com Lightbox se estiver aberto
        if (this.state.activeProjectIndex === sliderIndex) {
            this.updateLightboxContent();
        }
    },

    // 2. GESTÃO DO LIGHTBOX
    openLightbox(projectSliderElement) {
        const allSliders = Array.from(document.querySelectorAll('.project-slider'));
        this.state.activeProjectIndex = allSliders.indexOf(projectSliderElement);
        
        this.updateLightboxContent();
        
        this.elements.lightbox.classList.add('active');
        this.elements.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        this.elements.lightbox.classList.remove('active');
        this.elements.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.state.activeProjectIndex = null;
    },

    moveLightbox(direction) {
        if (this.state.activeProjectIndex !== null) {
            this.moveSlider(direction, this.state.activeProjectIndex);
        }
    },

    updateLightboxContent() {
        try {
            const currentWrapper = this.elements.wrappers[this.state.activeProjectIndex];
            const images = currentWrapper.querySelectorAll('img');
            const currentIndex = this.state.sliderPositions[this.state.activeProjectIndex];
            const activeImg = images[currentIndex];

            if (activeImg) {
                this.elements.imgAmpliada.src = activeImg.src;
                this.elements.counter.innerText = `${currentIndex + 1} / ${images.length}`;
            }
        } catch (error) {
            console.error("Erro ao atualizar lightbox:", error);
        }
    },

    // 3. ANIMAÇÕES (Scroll & Entrada)
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            observer.observe(el);
        });
    },

    // 4. EVENTOS DE TECLADO
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // Só executa lógica de fechar/navegar se o lightbox estiver ativo (UX Refinada)
            if (this.state.activeProjectIndex !== null) {
                if (e.key === "Escape") this.closeLightbox();
                if (e.key === "ArrowRight") this.moveLightbox(1);
                if (e.key === "ArrowLeft") this.moveLightbox(-1);
            }
        });
    }
};

// Inicializa o objeto assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => Portfolio.init());

/**
 * MANTENDO COMPATIBILIDADE COM O HTML
 * Expondo as funções necessárias para os eventos 'onclick' das tags HTML
 */
window.moveSlider = (dir, idx) => Portfolio.moveSlider(dir, idx);
window.abrirLightbox = (el) => Portfolio.openLightbox(el);
window.fecharLightbox = () => Portfolio.closeLightbox();
window.moveLightbox = (dir) => Portfolio.moveLightbox(dir);