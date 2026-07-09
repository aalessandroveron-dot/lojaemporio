// ==========================================================================
// 1. MAPEANDO OS ELEMENTOS DO HTML
// ==========================================================================
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const carrossel = document.querySelector('.carrossel-container');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.products-grid a');
function aplicarFiltro(marcaSelecionada){
 if(marcaSelecionada!=='todos'){carrossel.style.display='none';sessionStorage.setItem('filtroCategoria',marcaSelecionada);}else{carrossel.style.display='block';sessionStorage.removeItem('filtroCategoria');}
 cards.forEach(card=>{const m=card.getAttribute('data-marca');card.style.display=(marcaSelecionada==='todos'||m===marcaSelecionada)?'block':'none';});
}

// ==========================================================================
// 2. LÓGICA DO MENU LATERAL (Abrir e Fechar)
// ==========================================================================
function fecharSidebar() {
    sidebar.classList.remove('active');
    document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.remove('open');
        sub.style.maxHeight = null;
    });
    document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('aberto'));
}

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
}

if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', fecharSidebar);
}

// Fecha a sidebar ao clicar fora dela (e fora do botão de menu)
document.addEventListener('click', (e) => {
    if (!sidebar.classList.contains('active')) return;

    const cliqueForaDaSidebar = !sidebar.contains(e.target);
    const cliqueForaDoMenuBtn = !menuBtn.contains(e.target);

    if (cliqueForaDaSidebar && cliqueForaDoMenuBtn) {
        fecharSidebar();
    }
});

// ==========================================================================
// 3. SANFONA MULTI-NÍVEL DINÂMICA
// ==========================================================================
const toggleButtons = document.querySelectorAll('.toggle-btn');

toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const itemPai = btn.parentElement;
        const submenuFilho = itemPai.querySelector('.submenu');
        
        if (submenuFilho.classList.contains('open')) {
            submenuFilho.classList.remove('open');
            submenuFilho.style.maxHeight = null;
            itemPai.classList.remove('aberto');
            
            submenuFilho.querySelectorAll('.submenu').forEach(sub => {
                sub.classList.remove('open');
                sub.style.maxHeight = null;
            });
            submenuFilho.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('aberto'));
        } else {
            submenuFilho.classList.add('open');
            submenuFilho.style.maxHeight = submenuFilho.scrollHeight + "px";
            itemPai.classList.add('aberto');
        }
        
        recalcularAlturasMenusAcima(itemPai);
    });
});

function recalcularAlturasMenusAcima(elemento) {
    let paiAcima = elemento.parentElement.closest('.submenu');
    while (paiAcima) {
        let alturaTotal = 0;
        paiAcima.querySelectorAll(':scope > li').forEach(li => {
            alturaTotal += li.offsetHeight;
            const subDoLi = li.querySelector('.submenu.open');
            if (subDoLi) {
                alturaTotal += subDoLi.scrollHeight;
            }
        });
        paiAcima.style.maxHeight = alturaTotal + "px";
        paiAcima = paiAcima.parentElement.closest('.submenu');
    }
}

// ==========================================================================
// 4. CARROSSEL AUTOMÁTICO E MANUAL (Fade + 6s)
// ==========================================================================
let slideAtual = 0;
let temporizador;

function mostrarSlide(index) {
    if (slides.length === 0) return;
    slides[slideAtual].classList.remove('active');
    slideAtual = (index + slides.length) % slides.length;
    slides[slideAtual].classList.add('active');
    reiniciarTemporizador();
}

function iniciarTemporizador() {
    temporizador = setInterval(() => mostrarSlide(slideAtual + 1), 6000);
}

function reiniciarTemporizador() {
    clearInterval(temporizador);
    iniciarTemporizador();
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => mostrarSlide(slideAtual + 1));
    prevBtn.addEventListener('click', () => mostrarSlide(slideAtual - 1));
}

iniciarTemporizador();

// ==========================================================================
// 5. LÓGICA DA BARRA DE PESQUISA
// ==========================================================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase();
        
        if (termoBusca.length > 0) {
            carrossel.style.display = "none";
        } else {
            carrossel.style.display = "block";
        }
        
        cards.forEach(card => {
            const tituloTenis = card.querySelector('.product-title').textContent.toLowerCase();
            if (tituloTenis.includes(termoBusca)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// ==========================================================================
// 6. LÓGICA DOS FILTROS POR CATEGORIA
// ==========================================================================
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const marcaSelecionada = btn.getAttribute('data-filter');
        sidebar.classList.remove('active');
        
        aplicarFiltro(marcaSelecionada);
        
        document.querySelectorAll('.submenu').forEach(sub => {
            sub.classList.remove('open');
            sub.style.maxHeight = null;
        });
        document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('aberto'));
    });
});

const filtroSalvo=sessionStorage.getItem('filtroCategoria');if(filtroSalvo){aplicarFiltro(filtroSalvo);}

// ==========================================================================
// 7. LINKS DO RODAPÉ
// ==========================================================================
const footerInicio = document.getElementById('footer-inicio');
const footerProdutos = document.getElementById('footer-produtos');

if (footerInicio) {
    footerInicio.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (footerProdutos) {
    footerProdutos.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        sidebar.classList.add('active');
    });
}

// Se chegou no index.html vindo do rodapé de uma página de produto
// (link index.html?abrirMenu=1), já abre o menu lateral sozinho
if (new URLSearchParams(window.location.search).get('abrirMenu') === '1') {
    sidebar.classList.add('active');
}
