// ===== VARIÁVEIS GLOBAIS =====
const DOM = {
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('nav-menu'),
    loadingScreen: document.getElementById('carregamento'),
    backToTop: document.getElementById('back-to-top'),
    skillsGrid: document.getElementById('skills-grid'),
    particles: document.getElementById('particles'),
    typedText: document.getElementById('typed-text')
};

// Estado da aplicação
const state = {
    isMenuOpen: false,
    currentPage: 'inicio',
    skills: [],
    projects: [],
    certificates: []
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfólio Giovanni Barbosa carregado!');
    
    inicializarAplicacao();
});

async function inicializarAplicacao() {
    try {
        // Mostrar loading
        mostrarCarregamento();
        
        // Inicializar componentes
        await Promise.all([
            inicializarNavegacao(),
            inicializarAnimacoes(),
            inicializarParticulas(),
            inicializarSkills(),
            inicializarContadores(),
            inicializarScrollAnimations(),
            inicializarTypingEffect()
        ]);
        
        // Esconder loading após 2 segundos
        setTimeout(() => {
            esconderCarregamento();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        esconderCarregamento();
    }
}

// ===== LOADING SCREEN =====
function mostrarCarregamento() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.style.display = 'flex';
        DOM.loadingScreen.classList.remove('hide');
    }
}

function esconderCarregamento() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.add('hide');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== NAVEGAÇÃO =====
function inicializarNavegacao() {
    // Event listeners para navegação
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener('click', toggleMenu);
    }
    
    // Scroll spy para navbar
    window.addEventListener('scroll', handleScroll);
    
    // Fechar menu ao clicar em link (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) {
                toggleMenu();
            }
        });
    });
    
    // Back to top button
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    
    if (DOM.hamburger) {
        DOM.hamburger.classList.toggle('active');
    }
    
    if (DOM.navMenu) {
        DOM.navMenu.classList.toggle('active');
    }
    
    // Prevenir scroll quando menu está aberto
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (DOM.navbar) {
        if (scrollY > 100) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
    }
    
    // Back to top button
    if (DOM.backToTop) {
        if (scrollY > 500) {
            DOM.backToTop.classList.add('show');
        } else {
            DOM.backToTop.classList.remove('show');
        }
    }
    
    // Scroll spy para links ativos
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== PARTÍCULAS =====
function inicializarParticulas() {
    if (!DOM.particles) return;
    
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        criarParticula();
    }
}

function criarParticula() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Tamanho aleatório
    const size = Math.random() * 4 + 2;
    
    // Duração da animação aleatória
    const duration = Math.random() * 6 + 4;
    
    particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    DOM.particles.appendChild(particle);
}

// ===== SKILLS =====
async function inicializarSkills() {
    state.skills = [
        { name: 'HTML5', icon: 'fab fa-html5', level: 95 },
        { name: 'CSS3', icon: 'fab fa-css3-alt', level: 90 },
        { name: 'JavaScript', icon: 'fab fa-js-square', level: 85 },
        { name: 'React', icon: 'fab fa-react', level: 80 },
        { name: 'Node.js', icon: 'fab fa-node-js', level: 75 },
        { name: 'Python', icon: 'fab fa-python', level: 70 },
        { name: 'Firebase', icon: 'fas fa-fire', level: 85 },
        { name: 'Git', icon: 'fab fa-git-alt', level: 80 },
        { name: 'Figma', icon: 'fab fa-figma', level: 75 },
        { name: 'WordPress', icon: 'fab fa-wordpress', level: 70 }
    ];
    
    renderizarSkills();
}

function renderizarSkills() {
    if (!DOM.skillsGrid) return;
    
    DOM.skillsGrid.innerHTML = state.skills.map(skill => `
        <div class="skill-item" data-level="${skill.level}">
            <i class="${skill.icon}"></i>
            <h4>${skill.name}</h4>
        </div>
    `).join('');
    
    // Adicionar hover effects
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const level = item.dataset.level;
            item.title = `Nível: ${level}%`;
        });
    });
}

// ===== CONTADORES ANIMADOS =====
function inicializarContadores() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContadores();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animarContadores() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            counter.textContent = Math.floor(current);
        }, duration / steps);
    });
}

// ===== TYPING EFFECT =====
function inicializarTypingEffect() {
    if (!DOM.typedText) return;
    
    const texts = [
        'Desenvolvedor Full-Stack',
        'Designer UI/UX',
        'Criador de Experiências',
        'Apaixonado por Tecnologia'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            DOM.typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            DOM.typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pausa no final
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pausa entre textos
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// ===== SCROLL ANIMATIONS =====
function inicializarScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    const animatedElements = document.querySelectorAll(
        '.service-card, .detail-item, .skill-item, .about-text, .hero-text, .hero-image'
    );
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// ===== ANIMAÇÕES =====
function inicializarAnimacoes() {
    // Adicionar classes de animação aos elementos
    addScrollAnimation('.service-card', 'fadeInUp', 0.2);
    addScrollAnimation('.detail-item', 'slideInLeft', 0.1);
    addScrollAnimation('.skill-item', 'bounceIn', 0.05);
    addScrollAnimation('.stat-item', 'zoomIn', 0.1);
}

function addScrollAnimation(selector, animationClass, delay = 0) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}s`;
        element.classList.add(animationClass);
    });
}

// ===== UTILITIES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
function navegarPara(pagina) {
    switch(pagina) {
        case 'inicio':
            window.location.href = 'index.html';
            break;
        case 'projetos':
            window.location.href = './paginas/projetos.html';
            break;
        case 'galeria':
            window.location.href = './paginas/galeria.html';
            break;
        case 'certificados':
            window.location.href = './paginas/certificados.html';
            break;
        case 'contato':
            window.location.href = './paginas/contato.html';
            break;
        default:
            console.warn('Página não encontrada:', pagina);
    }
}

// ===== EVENT LISTENERS GLOBAIS =====
window.addEventListener('resize', debounce(() => {
    // Recriar partículas em resize
    if (DOM.particles) {
        DOM.particles.innerHTML = '';
        inicializarParticulas();
    }
    
    // Fechar menu mobile em resize
    if (window.innerWidth > 768 && state.isMenuOpen) {
        toggleMenu();
    }
}, 250));

// Prevenir comportamento padrão de alguns elementos
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('selectstart', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // e.preventDefault();
});

// ===== PERFORMANCE MONITORING =====
function monitorarPerformance() {
    // Monitorar tempo de carregamento
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Página carregada em ${Math.round(loadTime)}ms`);
        
        // Enviar métricas para analytics (se configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: Math.round(loadTime)
            });
        }
    });
}

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', (e) => {
    console.error('❌ Erro na aplicação:', e.error);
    
    // Mostrar notificação amigável ao usuário
    mostrarNotificacao('Ops! Algo deu errado. Tente recarregar a página.', 'erro');
});

// ===== NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(tipo)}"></i>
            <span>${mensagem}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remover
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duracao);
    
    // Botão fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(tipo) {
    const icons = {
        info: 'info-circle',
        sucesso: 'check-circle',
        aviso: 'exclamation-triangle',
        erro: 'times-circle'
    };
    return icons[tipo] || icons.info;
}

// ===== LAZY LOADING DE IMAGENS =====
function inicializarLazyLoading() {
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
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== THEME SWITCHER (OPCIONAL) =====
function inicializarTemaEscuro() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        mostrarNotificacao(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'sucesso');
    });
}

// ===== ANALYTICS =====
function inicializarAnalytics() {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Tracking de eventos personalizados
    trackCustomEvents();
}

function trackCustomEvents() {
    // Track cliques em botões importantes
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'engagement',
                    event_label: btn.textContent.trim()
                });
            }
        });
    });
    
    // Track cliques em redes sociais
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    event_category: 'social',
                    event_label: link.dataset.tooltip || 'social_link'
                });
            }
        });
    });
}

// ===== SERVICE WORKER (PWA) =====
function inicializarPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('❌ Falha ao registrar Service Worker:', error);
                });
        });
    }
}

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.GiovanniPortfolio = {
    navegarPara,
    mostrarNotificacao,
    state,
    DOM
};

// Inicializar recursos adicionais
document.addEventListener('DOMContentLoaded', () => {
    inicializarLazyLoading();
    inicializarTemaEscuro();
    inicializarAnalytics();
    inicializarPWA();
    monitorarPerformance();
});

console.log('🎨 Giovanni Barbosa Portfolio v1.0.0 - Carregado com sucesso!');