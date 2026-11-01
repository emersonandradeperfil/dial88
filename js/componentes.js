// script.js
function carregarHeader() {
    fetch('componentes/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o cabeçalho");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error(error));
}

// Executa a função assim que a página carrega
window.onload = carregarHeader;
