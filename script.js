// Dados dos canais
const channels = [
    { name: "Globo", category: "Entretenimento", icon: "fas fa-globe" },
    { name: "SBT", category: "Entretenimento", icon: "fas fa-tv" },
    { name: "Record", category: "Entretenimento", icon: "fas fa-broadcast-tower" },
    { name: "Band", category: "Entretenimento", icon: "fas fa-satellite" },
    { name: "RedeTV", category: "Entretenimento", icon: "fas fa-video" },
    { name: "Sportv", category: "Esportes", icon: "fas fa-baseball-ball" },
    { name: "ESPN", category: "Esportes", icon: "fas fa-football-ball" },
    { name: "Fox Sports", category: "Esportes", icon: "fas fa-basketball-ball" },
    { name: "Premiere", category: "Esportes", icon: "fas fa-trophy" },
    { name: "HBO", category: "Filmes", icon: "fas fa-film" },
    { name: "Cinemax", category: "Filmes", icon: "fas fa-clapperboard" },
    { name: "Fox", category: "Filmes", icon: "fas fa-star" },
    { name: "AXN", category: "Séries", icon: "fas fa-play-circle" },
    { name: "TNT", category: "Séries", icon: "fas fa-video" },
    { name: "Warner", category: "Séries", icon: "fas fa-tv" },
    { name: "Discovery", category: "Documentários", icon: "fas fa-globe-americas" },
    { name: "National Geo", category: "Documentários", icon: "fas fa-mountain" },
    { name: "Animal Planet", category: "Documentários", icon: "fas fa-paw" },
    { name: "Cartoon", category: "Infantil", icon: "fas fa-child" },
    { name: "Disney", category: "Infantil", icon: "fas fa-magic" },
    { name: "Nickelodeon", category: "Infantil", icon: "fas fa-smile" },
    { name: "MTV", category: "Música", icon: "fas fa-music" },
    { name: "BIS", category: "Música", icon: "fas fa-headphones" },
    { name: "Multishow", category: "Música", icon: "fas fa-microphone" }
];

// Inicialização do site
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando TopCine Brasil...');
    loadChannels();
    setupSmoothScroll();
    setupNavigation();
    initializeSheetsIntegration();
});

// Carregar canais na grid
function loadChannels() {
    const grid = document.querySelector('.channels-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    channels.forEach(channel => {
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        channelCard.innerHTML = `
            <div class="channel-logo-small">
                <i class="${channel.icon}"></i>
            </div>
            <div class="channel-name-small">${channel.name}</div>
            <div class="channel-category">${channel.category}</div>
        `;
        channelCard.addEventListener('click', () => showChannelPreview(channel));
        grid.appendChild(channelCard);
    });
}

// Preview do canal
function showChannelPreview(channel) {
    const modal = document.getElementById('loginModal');
    const modalHeader = modal.querySelector('.modal-header h2');
    const modalContent = modal.querySelector('.login-form');
    
    modalHeader.textContent = `${channel.name} - ${channel.category}`;
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="width: 80px; height: 80px; background: var(--primary-color); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem;">
                <i class="${channel.icon}"></i>
            </div>
            <h3 style="color: var(--text-white); margin-bottom: 1rem;">${channel.name}</h3>
            <p style="color: var(--text-gray);">Para assistir ${channel.name}, faça login em sua conta.</p>
        </div>
        <div class="form-group">
            <label>Usuário</label>
            <input type="text" placeholder="Seu usuário" required>
        </div>
        <div class="form-group">
            <label>Senha</label>
            <input type="password" placeholder="Sua senha" required>
        </div>
        <div class="form-group">
            <label>URL do Servidor</label>
            <input type="text" placeholder="http://seuservidor.com" required>
        </div>
        <button type="submit" class="btn-login-submit">
            <i class="fas fa-sign-in-alt"></i>
            Entrar e Assistir
        </button>
    `;
    
    openLogin();
}

// Navegação suave
function setupSmoothScroll() {
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
}

// Navegação ativa
function setupNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll para seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal functions
function openLogin() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar modal clicando fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLogin();
    }
});

// Selecionar plano
function selectPlan(planName) {
    const modal = document.getElementById('loginModal');
    const modalHeader = modal.querySelector('.modal-header h2');
    const modalContent = modal.querySelector('.login-form');
    
    modalHeader.textContent = `Assinar ${planName}`;
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="width: 60px; height: 60px; background: var(--primary-color); border-radius: 15px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem;">
                <i class="fas fa-crown"></i>
            </div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">Plano ${planName}</h3>
            <p style="color: var(--text-gray);">Preencha seus dados para finalizar a assinatura</p>
        </div>
        <div class="form-group">
            <label>Nome Completo</label>
            <input type="text" placeholder="Seu nome completo" required>
        </div>
        <div class="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" required>
        </div>
        <div class="form-group">
            <label>CPF</label>
            <input type="text" placeholder="000.000.000-00" required>
        </div>
        <div class="form-group">
            <label>Forma de Pagamento</label>
            <select style="width: 100%; padding: 12px 15px; background: var(--background-dark); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-white); font-size: 1rem;">
                <option value="">Selecione...</option>
                <option value="pix">PIX</option>
                <option value="credit">Cartão de Crédito</option>
                <option value="boleto">Boleto Bancário</option>
            </select>
        </div>
        <button type="submit" class="btn-login-submit">
            <i class="fas fa-check"></i>
            Finalizar Assinatura
        </button>
    `;
    
    openLogin();
}

// Efeitos de animação
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.channel-card, .plan-card');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// CSS para animações
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .channel-card, .plan-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .channel-card:nth-child(even) {
        transition-delay: 0.1s;
    }
    
    .channel-card:nth-child(odd) {
        transition-delay: 0.2s;
    }
`;
document.head.appendChild(animationStyle);

// Debug helper
window.debugSheets = function() {
    console.log('🔧 Debug Info:');
    console.log('- sheetsIntegration:', sheetsIntegration);
    console.log('- CONFIG:', CONFIG);
    console.log('- paymentHandler:', paymentHandler);
};