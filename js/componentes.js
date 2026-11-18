// Função genérica modificada para aceitar uma função de callback (que roda após injetar)
function carregarComponente(idContainer, nomeArquivo, callback) {
    // CAMINHO ABSOLUTO: Começa com '/' para apontar direto para a raiz do site, 
    // funcionando em qualquer nível de subpasta (raiz, pages/, pages/products/, etc.)
    let caminhoCorreto = '/js/componentes/' + nomeArquivo;
    
    fetch(caminhoCorreto)
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar: ${nomeArquivo} (Status: ${response.status})`);
            return response.text();
        })
        .then(data => {
            const container = document.getElementById(idContainer);
            if (container) {
                container.innerHTML = data;
                if (callback) callback();
            }
        })
        .catch(error => console.error(error));
}

// Executa o carregamento dos componentes
window.onload = function() {
    carregarComponente('header-container', 'header.html');
    carregarComponente('elements-container', 'elements.html');
    carregarComponente('social-container', 'social.html');
    carregarComponente('song-container', 'song.html');
    
    // CARREGA O LGPD E SÓ DEPOIS ATIVA OS BOTÕES E O BANNER!
    carregarComponente('lgpd-container', 'lgpd.html', function() {
        inicializarLGPD(); // Chama a lógica do banner agora que ele já existe na tela!
    });

    carregarComponente('footer-container', 'footer.html');
};

// A lógica do banner que estava no lgpd.js agora fica protegida aqui dentro:
function inicializarLGPD() {
    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('cookie-accept');
    const btnReject = document.getElementById('cookie-reject');

    if (!banner) return; // Segurança caso o elemento não exista

    const consentimento = localStorage.getItem('user_cookie_consent');

    if (!consentimento) {
        banner.style.display = 'block'; // Mostra se não escolheu
    } else if (consentimento === 'accepted') {
        carregarGoogleTag(); // Carrega se já aceitou antes
    }

    btnAccept.addEventListener('click', () => {
        localStorage.setItem('user_cookie_consent', 'accepted');
        banner.style.display = 'none';
        carregarGoogleTag();
    });

    btnReject.addEventListener('click', () => {
        localStorage.setItem('user_cookie_consent', 'rejected');
        banner.style.display = 'none';
    });
}

// Função que injeta a Tag do Google
function carregarGoogleTag() {
    const measurementId = 'AW-18503940072';
    if (document.getElementById('google-tag-script')) return;

    const scriptTag = document.createElement('script');
    scriptTag.id = 'google-tag-script';
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(scriptTag);

    const scriptConfig = document.createElement('script');
    scriptConfig.id = 'google-tag-config';
    scriptConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
    `;
    document.head.appendChild(scriptConfig);
}