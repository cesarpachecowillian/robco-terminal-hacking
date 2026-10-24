# Sons personalizados

Por padrão o jogo usa sons sintetizados. Para usar os seus próprios, coloque
arquivos de áudio (ogg/mp3/wav) **que você obteve legalmente** nesta pasta e
mapeie-os em `manifest.json`:

```json
{ "hover": "hover.ogg", "type": ["key1.ogg", "key2.ogg", "key3.ogg"] }
```

Também dá para usar **uma gravação longa** e fatiar: cada entrada pode ser uma
string ou um objeto `{ "file", "start", "dur" }` (segundos). O arquivo é baixado
e decodificado uma única vez, mesmo usado por vários slots:

```json
{
  "hover": { "file": "all.ogg", "start": 1.20, "dur": 0.08 },
  "type":  [ { "file": "all.ogg", "start": 3.00, "dur": 0.05 },
             { "file": "all.ogg", "start": 3.40, "dur": 0.05 } ],
  "enter": "enter.ogg"
}
```

Opcionalmente, `"vol"` ajusta o ganho daquela entrada (linear, padrão `1`,
máximo `4`; ex.: `0.5` ≈ −6 dB) para equilibrar recortes gravados em níveis
diferentes.

Sem `dur`, toca até o fim do arquivo. Há um fade de ~4 ms no início e no fim
para evitar cliques. Atenção: arquivos muito longos ocupam muita memória
depois de decodificados (PCM descomprimido); corte só o que for necessário.

Um array sorteia uma variação a cada vez que o som toca. Slots sem arquivo (ou
com arquivo ausente/inválido) continuam com o som sintetizado.

## Slots

- `poweron` — terminal ligando (início do boot)
- `type` — tique por caractere durante digitação (boot, log, tela final)
- `hover` — cursor passa para uma nova palavra/símbolo, opção de menu ou botão final
- `key` — cursor movido com as setas do teclado (sem arquivo, usa `hover` se existir)
- `enter` — selecionar palavra/colchete ou opção de menu
- `denied` — senha errada
- `dud` — resíduo removido por colchete
- `replenish` — tentativas restauradas
- `granted` — acesso concedido
- `locked` — terminal bloqueado

Com Docker, a pasta `sounds/` é montada como volume (somente leitura): ao
adicionar ou trocar arquivos basta recarregar a página (ou `docker compose
restart`). Sem o volume, é preciso `docker compose up -d --build`.

Observação: abrir o jogo via `file://` não carrega os arquivos (use o servidor/Docker).
