// Variável global para controlar qual imagem do slider está aparecendo
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÇÃO DE REVELAÇÃO (STAT CARDS)
    // Faz os cards de "Foco", "Estudo" e "Status" aparecerem um por um
    const cards = document.querySelectorAll('.stat-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });

    // 2. ANIMAÇÃO DE REVELAÇÃO DOS PROJETOS (INTERSECTION OBSERVER)
    // Faz os projetos aparecerem quando você rola a página até eles
    const projectCards = document.querySelectorAll('.project-card');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});

// 3. LÓGICA DO SLIDER (CARROSSEL)
// Move as imagens para a esquerda ou direita
function moveSlider(direction) {
    const slider = document.getElementById('slider');
    const imagens = slider.querySelectorAll('img');
    const totalImages = imagens.length;

    currentIndex += direction;

    // Loop: se chegar no fim, volta pro começo. Se for pra trás do começo, vai pro fim.
    if (currentIndex >= totalImages) {
        currentIndex = 0;
    }
    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    }

    // Move o container das imagens
    const offset = currentIndex * -100;
    slider.style.transform = `translateX(${offset}%)`;
}

// 4. LÓGICA DO LIGHTBOX (TELA CHEIA)
// Abre a imagem que está visível no slider em tamanho grande
function abrirLightbox() {
    const slider = document.getElementById('slider');
    const imagens = slider.querySelectorAll('img');
    const lightbox = document.getElementById('lightbox');
    const imgAmpliada = document.getElementById('img-ampliada');

    // Pega o endereço (src) da imagem que o usuário está vendo no momento
    const srcImagemAtual = imagens[currentIndex].src;
    
    imgAmpliada.src = srcImagemAtual;
    lightbox.style.display = 'flex';
    
    // Bloqueia o scroll da página enquanto a foto está aberta
    document.body.style.overflow = 'hidden';
}

// Fecha a tela cheia
function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Devolve o scroll da página
    document.body.style.overflow = 'auto';
}

// Fecha a tela cheia se o usuário apertar a tecla "Esc"
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        fecharLightbox();
    }
});