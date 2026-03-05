# TN-82MS — Calculadora Científica (protótipo)

Protótipo estático que replica visual e comportamento básico da calculadora TN-82MS.

Estrutura do projeto:
- `index.html` — layout principal
- `src/styles/style.css` — estilos (tema escuro, botões semelhantes à TN-82MS)
- `src/scripts/script.js` — lógica da calculadora (aritmética, memória e funções científicas)
- `test/test.js` — testes automatizados usando `jsdom`

Como executar (local):
1. Abra o diretório do projeto e instale dependências:

```bash
cd '/home/isaque/Documentos/Programação/Calculadora TN-82MS'
npm install
```

2. Abra `index.html` no navegador para usar a interface gráfica.

3. Para rodar os testes automatizados (validação headless):

```bash
npm test
```

Funcionalidades implementadas (resumo):
- Digitação de números e ponto decimal
- Operações básicas: `+`, `-`, `×`, `÷`, `=`
- Memory: `MC`, `MR`, `M+`, `M-`, `STO`, `RCL`
- Porcentagem `%`, `AC`, `DEL`, `Ans`
- Funções científicas: `sin`, `cos`, `tan`, `ln`, `log`, `eˣ`, `xʸ`, `π`, `n!`, `nCr`, `nPr`, `x⁻¹`
- Toggles: `SHIFT`, `ALPHA`, `MODE` (exibe modo entre `RAD`/`DEG` but trig uses radians by default), `hyp` (activa funções hiperbólicas)

Observações importantes:
- A trigonometria usa radianos por padrão conforme solicitado.
- `nCr` e `nPr` usam os valores inteiros atualmente armazenados em `primarySlot` (n) e `secondarySlot` (k); para calcular `nCr` interativamente na UI atualmente é preciso definir `secondarySlot` usando uma operação (ex.: digite `k`, pressione `+` para mover para `secondarySlot`, depois digite `n` e pressione `nCr`).

Contribuições e próximos passos:
- Ajustes finos de layout (tamanhos e posicionamento) e suporte a mais modos de input (history, replay) podem ser adicionados.

---
Feito com HTML/CSS/JS; inspirado no repositório `Calculadora_CLA_9835`.
