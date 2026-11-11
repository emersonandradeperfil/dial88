// js/componentes.js

function carregarComponente(idContainer, nomeArquivo) {
    // Detecta se a página atual está dentro de qualquer subpasta de /pages/
    // Como: /pages/legal/, /pages/products/ ou /pages/articles/
    const estaNaSubpasta = window.location.pathname.includes('/pages/');
    
    // Se estiver na subpasta (2 níveis abaixo), usa "../../" para voltar para a raiz.
    // Se estiver na index.html (raiz), o prefixo fica vazio ""
    const prefixo = estaNaSubpasta ? '../../' : '';

    // Monta o caminho exato baseado na sua árvore de arquivos: js/componentes/nome.html
    const caminhoCorreto = `${prefixo}js/componentes/${nomeArquivo}`;

    fetch(caminhoCorreto)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo: ${nomeArquivo}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(idContainer).innerHTML = data;
        })
        .catch(error => console.error(error));
}

// Executa e carrega o cabeçalho e o rodapé juntos assim que a página abre
window.onload = function() {
    carregarComponente('header-container', 'header.html');
    carregarComponente('elements-container', 'elements.html');
    carregarComponente('social-container', 'social.html');
    carregarComponente('song-container', 'song.html');
    carregarComponente('footer-container', 'footer.html');
};
