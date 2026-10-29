// Função genérica para injetar qualquer componente HTML externo
async function carregarComponente(idElemento, caminhoArquivo) {
    try {
        const resposta = await fetch(caminhoArquivo);
        if (!resposta.ok) {
            throw new Error(`Não foi possível carregar o arquivo: ${caminhoArquivo}`);
        }
        
        const html = await resposta.text();
        document.getElementById(idElemento).innerHTML = html;
        
    } catch (erro) {
        console.error("Erro ao carregar componente:", erro);
    }
}

// Função principal que executa a injeção assim que a página é totalmente carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarComponente("rodape-global", "/componentes/footer.html");
    carregarComponente("botao-global", "/componentes/butao.html");
});

