// Criar o objeto de áudio e configurar o loop continuo
const audio = new Audio('../song/music.mp3'); // <--- Substitua aqui pelo caminho correto da sua música se necessário
audio.loop = true;

// Seleciona os botões do header criados no seu HTML
const btnEnable = document.getElementById('btn-enable');
const btnDisable = document.getElementById('btn-disable');

// 1. Recuperar o estado salvo no navegador ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const savedTime = localStorage.getItem('musicTime');
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';

    // Restaura o tempo exato de onde a música parou na página anterior
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Se a música já estava tocando antes, continua tocando e exibe o botão DISABLE
    if (isPlaying) {
        audio.play().catch(err => console.log("Aguardando clique inicial do usuário para liberar o som."));
        alternarBotoesVisuais(true);
    } else {
        alternarBotoesVisuais(false);
    }
});

// 2. Grava a posição atual da música a cada segundo para não perder o ponto
audio.addEventListener('timeupdate', () => {
    localStorage.setItem('musicTime', audio.currentTime);
});

// 3. Ação ao clicar em ENABLE (Dá play e altera o visual)
btnEnable.addEventListener('click', (e) => {
    e.preventDefault();
    audio.play();
    localStorage.setItem('musicPlaying', 'true');
    alternarBotoesVisuais(true);
});

// 4. Ação ao clicar em DISABLE (Dá pause e altera o visual)
btnDisable.addEventListener('click', (e) => {
    e.preventDefault();
    audio.pause();
    localStorage.setItem('musicPlaying', 'false');
    alternarBotoesVisuais(false);
});

// FUNÇÃO INTERNA: Faz sumir um botão e aparecer o outro dinamicamente
function alternarBotoesVisuais(tocando) {
    if (tocando) {
        btnEnable.style.setProperty('display', 'none', 'important');
        btnDisable.style.setProperty('display', 'inline-flex', 'important');
    } else {
        btnEnable.style.setProperty('display', 'inline-flex', 'important');
        btnDisable.style.setProperty('display', 'none', 'important');
    }
}
