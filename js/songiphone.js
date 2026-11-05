// 1. CAMINHO DO ÁUDIO PARA HOSTGATOR
const audioPath = '/song/music.mp3';
const audio = new Audio(audioPath);
audio.loop = true;

// Função principal que lê o localStorage e sincroniza tudo
function sincronizarEstadoDoAudio() {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedTime && audio.currentTime === 0) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (isPlaying) {
        // Tenta dar play. Se o iPhone bloquear, ativa o desbloqueador por toque
        audio.play().catch(err => {
            console.log("iOS bloqueou o autoplay. Aguardando toque na tela...");
            ativarDesbloqueioPorToqueNoMobile();
        });
    } else {
        audio.pause();
    }

    alternarBotoesVisuais(isPlaying);
}

// FUNÇÃO ESPECIAL PARA IPHONE: Libera o som no primeiro toque na tela
function activarDesbloqueioPorToqueNoMobile() {
    const liberarSom = () => {
        const isPlaying = localStorage.getItem('musicPlaying') === 'true';
        // Se o usuário mudou de página com o som ligado, dá o play no primeiro toque
        if (isPlaying && audio.paused) {
            audio.play().catch(e => console.log(e));
        }
        // Remove os ouvintes para não ficar rodando toda hora
        document.removeEventListener('click', liberarSom);
        document.removeEventListener('touchstart', liberarSom);
    };

    // Escuta tanto cliques normais quanto toques na tela (mobile)
    document.addEventListener('click', liberarSom);
    document.addEventListener('touchstart', liberarSom);
}

// 2. EVENTOS DE CARREGAMENTO (Mantém igual)
window.addEventListener('DOMContentLoaded', () => {
    sincronizarEstadoDoAudio();
});

const observer = new MutationObserver(() => {
    const btnEnable = document.getElementById('btn-enable');
    if (btnEnable) {
        sincronizarEstadoDoAudio();
        observer.disconnect(); 
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// 3. SALVAMENTO DA POSIÇÃO DA MÚSICA
audio.addEventListener('timeupdate', () => {
    localStorage.setItem('musicTime', audio.currentTime);
});

// 4. CLIQUES NOS BOTÕES (Mantém igual)
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

// 5. TROCA VISUAL DOS BOTÕES
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
