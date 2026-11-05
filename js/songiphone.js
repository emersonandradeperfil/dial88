// 1. CONFIGURAÇÃO DO CAMINHO DO ÁUDIO PARA HOSTGATOR
const audioPath = '/song/music.mp3';
const audio = new Audio(audioPath);
audio.loop = true;

// Função que lê o localStorage e tenta sincronizar
function sincronizarEstadoDoAudio() {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedTime && audio.currentTime === 0) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (isPlaying) {
        // Tenta o play automático (funciona em Desktop/Android)
        audio.play().catch(err => {
            console.log("iOS bloqueou o autoplay. O som tocará na próxima interação direta.");
        });
    } else {
        audio.pause();
    }

    alternarBotoesVisuais(isPlaying);
}

// 2. INTERCEPTADOR SÍNCRONO PARA MOBILE (O pulo do gato para o iPhone)
// Captura qualquer clique na página antes que o navegador mude a ação
document.addEventListener('click', (e) => {
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    
    // Se o localStorage diz que o som deveria estar tocando, mas o iOS pausou
    if (isPlaying && audio.paused) {
        // Força o play IMEDIATAMENTE no contexto do clique do usuário
        audio.play().catch(e => console.log("Erro ao forçar áudio:", e));
    }
}, { passive: false });

// 3. EVENTOS DE CARREGAMENTO
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

// 4. SALVAMENTO DA POSIÇÃO DA MÚSICA
audio.addEventListener('timeupdate', () => {
    localStorage.setItem('musicTime', audio.currentTime);
});

// 5. CLIQUES DIRETOS NOS BOTÕES DO COMPONENTE
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

// 6. TROCA VISUAL DOS BOTÕES
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
