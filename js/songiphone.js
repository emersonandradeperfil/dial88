// 1. CONFIGURAÇÃO DO CAMINHO DO ÁUDIO PARA HOSTGATOR
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
        // Tenta dar o play
        audio.play()
            .then(() => {
                // Se o navegador aceitou e tocou, mostra o botão DISABLE
                alternarBotoesVisuais(true);
            })
            .catch(err => {
                console.log("Autoplay bloqueado pelo sistema operacional (ex: iPhone).");
                // O PULO DO GATO: Se o iPhone bloqueou, força o botão a voltar para o modo ENABLE
                // Assim o usuário precisa dar apenas 1 clique normal para ativar o som!
                alternarBotoesVisuais(false);
            });
    } else {
        audio.pause();
        alternarBotoesVisuais(false);
    }
}

// 2. EVENTOS DE CARREGAMENTO
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

// 4. CLIQUES DIRETOS NOS BOTÕES
document.addEventListener('click', (e) => {
    const btnEnable = e.target.closest('#btn-enable');
    const btnDisable = e.target.closest('#btn-disable');

    if (btnEnable) {
        e.preventDefault();
        audio.play()
            .then(() => {
                localStorage.setItem('musicPlaying', 'true');
                alternarBotoesVisuais(true);
            })
            .catch(err => console.log("Bloqueado:", err));
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
