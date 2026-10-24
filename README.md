# RobCo Termlink — minigame de hacking de terminal

Minigame de navegador inspirado nos terminais retrô de fósforo verde: descubra a
senha certa entre palavras escondidas num dump de memória, usando as dicas de
**semelhança** que o terminal devolve a cada tentativa errada.

Feito em **JavaScript puro (ES modules)**, sem frameworks e sem etapa de build.
A interface é em português; as palavras do dump são em inglês.

## Como jogar

1. Escolha um nível de acesso (dificuldade). O terminal liga e exibe duas
   colunas de memória com palavras do mesmo tamanho misturadas a lixo (`!@#$%…`).
2. Selecione uma palavra. Se não for a senha, o terminal mostra
   `Semelhança=N`: quantas letras estão **na mesma posição** que na senha.
3. Use essa informação para eliminar candidatas. Você tem **4 tentativas**.
4. Pares de colchetes na **mesma linha** (`[..]`, `(..)`, `{..}`, `<..>`) são
   atalhos: removem uma palavra errada (resíduo) ou, às vezes, restauram suas
   tentativas.

| Nível | Tamanho das palavras | Palavras na grade |
|---|---|---|
| Muito fácil | 4–5 | 14–17 |
| Fácil | 6–8 | 12–15 |
| Médio | 9–10 | 10–13 |
| Difícil | 11–12 | 9–11 |
| Muito difícil | 13–15 | 8–10 |

### Controles

| Onde | Teclado | Mouse / toque |
|---|---|---|
| Menu | `↑` `↓` + `Enter`, ou `1`–`5` | clique na opção |
| Grade | setas movem o cursor, `Enter` seleciona | passe o mouse e clique; no toque, 1º toque marca, 2º confirma |
| Animações | qualquer tecla pula | clique pula |
| Jogo em andamento | `Esc` volta ao menu | — |
| Tela final | `R` reinicia, `D` troca a dificuldade | botões na tela |

## Executando

O jogo usa ES modules, então precisa ser servido por HTTP (abrir o
`index.html` direto via `file://` não funciona).

**Docker** (nginx):

```bash
docker compose up -d --build
# http://localhost:8083
```

A pasta `sounds/` é montada como volume: trocar sons exige só recarregar a
página. Mudanças em `src/`, `index.html` ou `styles.css` exigem `--build`.

**Sem Docker** (qualquer servidor estático):

```bash
python -m http.server 8000
# http://localhost:8000
```

## Sons

Os efeitos sonoros vêm de uma gravação própria (`sounds/sounds.mp3`), fatiada
por `sounds/manifest.json` — cada evento do jogo (ligar, digitação, cursor,
seleção, senha errada…) aponta para um trecho `{ file, start, dur, vol }` do
arquivo. Eventos sem trecho usam sons sintetizados via Web Audio. Detalhes em
[`sounds/README.md`](sounds/README.md).

## Estrutura

```
index.html            marcação das três telas (menu, terminal, tela final)
styles.css            visual CRT (scanlines, brilho, animação de ligar)
src/
  main.js             ponto de entrada: registra eventos e abre o menu
  config.js           dificuldades, geometria da grade, textos, tempos
  words.js            listas de palavras (4–15 letras) + validação
  rng.js              PRNG com seed (mulberry32) e helpers de sorteio
  grid.js             geração da grade (pura e determinística por seed)
  tokens.js util.js   tokens da grade, semelhança, endereços hex
  state.js            estado compartilhado da partida
  flow.js             menu, sequência de boot, início de rodada
  actions.js          tentativa de senha e uso de colchetes
  render.js cursor.js anim.js log.js screens.js end.js   interface
  input.js            teclado, mouse e toque
  audio.js            motor de áudio (amostras + síntese)
  audio-manifest.js   leitura do manifest de sons (pura)
sounds/               gravação, manifest e documentação dos sons
tests/                testes unitários (bun test)
```

Os módulos de lógica (`config`, `words`, `rng`, `util`, `grid`, `tokens`,
`audio-manifest`) não tocam no DOM, por isso podem ser testados fora do
navegador.

## Testes

Requer [Bun](https://bun.sh):

```bash
bun test
```

`tests/equivalence.test.js` compara as grades geradas com um fixture gravado a
partir da versão anterior à refatoração em módulos, garantindo que a mesma seed
produz exatamente a mesma partida.

## Depuração

- `?seed=N` na URL torna a partida reproduzível (ex.: `http://localhost:8083/?seed=123`).
- No console do navegador, `dbg.secret` mostra a senha e `dbg.seed` a seed da partida.
  `dbg` é o único global exposto; o resto do código fica encapsulado nos módulos.
