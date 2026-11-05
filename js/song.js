// 1. CONFIGURAÇÃO INTELIGENTE DO CAMINHO DO ÁUDIO (Local vs GitHub Pages)
const repoName = window.location.pathname.split('/')[1]; // Pega o nome do repositório no GitHub
const isGitHubPages = window.location.hostname.includes('github.io');

// Se estiver no GitHub, inclui o nome do repositório antes da pasta /song/
const audioPath = isGitHubPages ? `/${repoName}/song/music.mp3` : '/song/music.mp3';

const audio = new Audio(audioPath);
audio.loop = true;

// 2. SINCRONIZAÇÃO DO ESTADO DO ÁUDIO (Som e Botões)
function sincronizarEstadoDoAudio() {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    // Recupera o tempo exato de onde parou
    if (savedTime && audio.currentTime === 0) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Gerencia o play/pause
    if (isPlaying) {
        audio.play().catch(err => console.log("Aguardando clique inicial do usuário para tocar o som."));
    } else {
        audio.pause();
    }

    // Força a atualização visual dos botões
    alternarBotoesVisuais(isPlaying);
}

// 3. EVENTOS DE CARREGAMENTO
// Quando a página termina de carregar o HTML básico
window.addEventListener('DOMContentLoaded', () => {
    sincronizarEstadoDoAudio();
});

// MONITOR DE INJEÇÃO (Para páginas que usam include/inject assíncrono)
const observer = new MutationObserver(() => {
    const btnEnable = document.getElementById('btn-enable');
    if (btnEnable) {
        sincronizarEstadoDoAudio(); // Sincroniza assim que os botões aparecerem
        observer.disconnect();      // Desliga o monitor para poupar memória
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// 4. SALVAMENTO DA POSIÇÃO DA MÚSICA (A cada segundo)
audio.addEventListener('timeupdate', () => {
    localStorage.setItem('musicTime', audio.currentTime);
});

// 5. DELEGAÇÃO DE EVENTOS DE CLIQUE (Funciona para botões fixos e injetados)
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

// 6. FUNÇÃO AUXILIAR PARA TROCA VISUAL DOS BOTÕES
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
