// Criar o objeto de áudio e configurar o loop continuo
const audio = new Audio('../../song/music.mp3');
audio.loop = true;

// Função principal que lê o localStorage e sincroniza TUDO (Som e Botões)
function sincronizarEstadoDoAudio() {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    // 1. Sincroniza o tempo do áudio (se houver tempo salvo)
    if (savedTime && audio.currentTime === 0) {
        audio.currentTime = parseFloat(savedTime);
    }

    // 2. Sincroniza o play/pause do som
    if (isPlaying) {
        // Tenta dar o play (se o navegador já estiver liberado por clique prévio)
        audio.play().catch(err => console.log("Aguardando interação do usuário para tocar."));
    } else {
        audio.pause();
    }

    // 3. Força a troca visual dos botões de acordo com o localStorage
    alternarBotoesVisuais(isPlaying);
}

// 1. Quando a página carrega por completo
window.addEventListener('DOMContentLoaded', () => {
    sincronizarEstadoDoAudio();
});

// 2. O GUARDA-COSTAS DO INJECT: Monitora a página para pegar o HTML assim que ele entrar na tela
const observer = new MutationObserver(() => {
    const btnEnable = document.getElementById('btn-enable');
    if (btnEnable) {
        // Encontrou o botão injetado! Sincroniza o estado na hora e para de observar
        sincronizarEstadoDoAudio();
        observer.disconnect(); 
    }
});

// Inicia o monitoramento de elementos adicionados na página
observer.observe(document.body, { childList: true, subtree: true });

// 3. Grava a posição atual da música a cada segundo para não perder o ponto
audio.addEventListener('timeupdate', () => {
    localStorage.setItem('musicTime', audio.currentTime);
});

// 4. DELEGAÇÃO DE EVENTOS: Trata os cliques nos botões injetados ou fixos
document.addEventListener('click', (e) => {
    const btnEnable = e.target.closest('#btn-enable');
    const btnDisable = e.target.closest('#btn-disable');

    if (btnEnable) {
        e.preventDefault();
        audio.play();
        localStorage.setItem('musicPlaying', 'true');
        alternarBotoesVisuais(true);
    }

    if (btnDisable) {
        e.preventDefault();
        audio.pause();
        localStorage.setItem('musicPlaying', 'false');
        alternarBotoesVisuais(false);
    }
});

// FUNÇÃO ALTERNAR VISUAL: Garante a troca exata adicionando !important nas propriedades
function alternarBotoesVisuais(tocando) {
    const btnEnable = document.getElementById('btn-enable');
    const btnDisable = document.getElementById('btn-disable');

    if (btnEnable && btnDisable) {
        if (tocando) {
            btnEnable.style.setProperty('display', 'none', 'important');
            btnDisable.style.setProperty('display', 'inline-flex', 'important');
        } else {
            btnEnable.style.setProperty('display', 'inline-flex', 'important');
            btnDisable.style.setProperty('display', 'none', 'important');
        }
    }
}
