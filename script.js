/**
 * KAEL PORTFOLIO ENGINE
 * Foco: Integridade da interface, performance e usabilidade.
 * Este script gerencia a interatividade do portfólio de forma estruturada.
 */

const Portfolio = {
    // Estado da Aplicação (Single Source of Truth)
    state: {
        sliderPositions: [],      // Armazena a imagem atual de cada projeto
        activeProjectIndex: null, // Rastreia qual projeto está aberto no lightbox
    },
    
    // Referências do DOM
    elements: {
        wrappers: null,
        lightbox: null,
        imgAmpliada: null,
        counter: null,
    },

    // Inicialização do Sistema
    init() {
        this.elements.wrappers = document.querySelectorAll('.slider-wrapper');
        this.elements.lightbox = document.getElementById('lightbox');
        this.elements.imgAmpliada = document.getElementById('img-ampliada');
        this.elements.counter = document.getElementById('lb-counter');

        // Mapeia os sliders existentes para controle independente
        this.state.sliderPositions = Array.from(this.elements.wrappers).map(() => 0);

        this.setupAnimations();
        this.setupEventListeners();
        console.log("Sistemas de interface inicializados com sucesso.");
    },

    // --- CONTROLE DE SLIDERS ---
    moveSlider(direction, sliderIndex) {
        const currentWrapper = this.elements.wrappers[sliderIndex];
        if (!currentWrapper) return; // Silent fail para integridade

        const images = currentWrapper.querySelectorAll('img');
        const totalImages = images.length;

        // Cálculo da nova posição com lógica de loop
        let newPos = this.state.sliderPositions[sliderIndex] + direction;

        if (newPos >= totalImages) newPos = 0;
        if (newPos < 0) newPos = totalImages - 1;

        this.state.sliderPositions[sliderIndex] = newPos;

        // Aplicação visual (Transformação CSS para melhor performance)
        currentWrapper.style.transform = `translateX(${newPos * -100}%)`;

        // Se o lightbox estiver ativo para este projeto, atualiza a imagem ampliada
        if (this.state.activeProjectIndex === sliderIndex) {
            this.updateLightboxContent();
        }
    },

    // --- SISTEMA DE LIGHTBOX (EXPOSIÇÃO DE EVIDÊNCIAS) ---
    openLightbox(projectSliderElement) {
        const allSliders = Array.from(document.querySelectorAll('.project-slider'));
        this.state.activeProjectIndex = allSliders.indexOf(projectSliderElement);
        
        this.updateLightboxContent();
        
        this.elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    },

    closeLightbox() {
        this.elements.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Libera o scroll
        this.state.activeProjectIndex = null;
    },

    updateLightboxContent() {
        try {
            const currentWrapper = this.elements.wrappers[this.state.activeProjectIndex];
            const images = currentWrapper.querySelectorAll('img');
            const currentIndex = this.state.sliderPositions[this.state.activeProjectIndex];
            const activeImg = images[currentIndex];

            if (activeImg) {
                this.elements.imgAmpliada.src = activeImg.src;
                this.elements.counter.innerText = `Evidência ${currentIndex + 1} de ${images.length}`;
            }
        } catch (error) {
            console.error("Erro na atualização do Lightbox:", error);
        }
    },

    // --- ANIMAÇÕES DE ENTRADA (MÉTODO REATIVO) ---
    setupAnimations() {
        const observerOptions = { threshold: 0.15 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target); // Melhora a performance parando de observar
                }
            });
        }, observerOptions);

        // Aplica observação em elementos chave
        document.querySelectorAll('.project-card, .stat-card, .section-title').forEach(el => {
            el.classList.add('hide-before-reveal'); // Classe inicial via JS para evitar problemas de SEO
            observer.observe(el);
        });
    },

    // --- EVENTOS GLOBAIS E ACESSIBILIDADE ---
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.state.activeProjectIndex === null) return;

            const actions = {
                'Escape': () => this.closeLightbox(),
                'ArrowRight': () => this.moveSlider(1, this.state.activeProjectIndex),
                'ArrowLeft': () => this.moveSlider(-1, this.state.activeProjectIndex)
            };

            if (actions[e.key]) actions[e.key]();
        });
    }
};

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => Portfolio.init());

// Exportação de funções para compatibilidade com o HTML (onclick)
window.moveSlider = (dir, idx) => Portfolio.moveSlider(dir, idx);
window.abrirLightbox = (el) => Portfolio.openLightbox(el);
window.fecharLightbox = () => Portfolio.closeLightbox();
window.moveLightbox = (dir) => {
    if (Portfolio.state.activeProjectIndex !== null) {
        Portfolio.moveSlider(dir, Portfolio.state.activeProjectIndex);
    }
};