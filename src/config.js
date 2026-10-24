// Static configuration: difficulty tiers, grid geometry, messages, timings.

/**
 * @typedef {Object} Difficulty
 * @property {string} key
 * @property {string} label
 * @property {string} desc
 * @property {number} lenMin   shortest word length
 * @property {number} lenMax   longest word length
 * @property {number} minW     minimum words (relaxed after GRID_RELAX_AFTER failed tries)
 * @property {number} maxW     maximum words in the grid
 * @property {number} maxAttempts
 * @property {number} bPerCol  max bracket pairs per column
 */

// ─── DIFFICULTY CONFIG ────────────────────────────────────────────────────────

/** @type {Record<string, Difficulty>} */
export const DIFF = {
  MUITO_FACIL:   { key: 'MUITO_FACIL',   label: 'MUITO FÁCIL',   desc: '4–5 letras  ·  4 tentativas',   lenMin: 4,  lenMax: 5,  minW: 14, maxW: 17, maxAttempts: 4, bPerCol: 5 },
  FACIL:         { key: 'FACIL',         label: 'FÁCIL',         desc: '6–8 letras  ·  4 tentativas',   lenMin: 6,  lenMax: 8,  minW: 12, maxW: 15, maxAttempts: 4, bPerCol: 5 },
  MEDIO:         { key: 'MEDIO',         label: 'MÉDIO',         desc: '9–10 letras  ·  4 tentativas',  lenMin: 9,  lenMax: 10, minW: 10, maxW: 13, maxAttempts: 4, bPerCol: 4 },
  DIFICIL:       { key: 'DIFICIL',       label: 'DIFÍCIL',       desc: '11–12 letras  ·  4 tentativas', lenMin: 11, lenMax: 12, minW: 9,  maxW: 11, maxAttempts: 4, bPerCol: 4 },
  MUITO_DIFICIL: { key: 'MUITO_DIFICIL', label: 'MUITO DIFÍCIL', desc: '13–15 letras  ·  4 tentativas', lenMin: 13, lenMax: 15, minW: 8,  maxW: 10, maxAttempts: 4, bPerCol: 3 }
};

// ─── GRID ─────────────────────────────────────────────────────────────────────

/** Filler characters: no bracket chars and no '.' (reserved for removed cells). */
export const JUNK = '!@#$%^&*-_=+:;\'",?|~/\\`';
/** Opening/closing bracket pairs usable as "dud remover" tokens. */
export const BRACKET_PAIRS = [['[', ']'], ['(', ')'], ['{', '}'], ['<', '>']];

export const ROWS  = 17;
export const COLS  = 12;
export const TOTAL = ROWS * COLS;   // chars per column stream

export const UINT32 = 4294967296;   // 2^32, RNG scale

export const REPLENISH_CHANCE = 0.2;   // chance a bracket restores attempts
export const GRID_RELAX_AFTER = 20;    // tryGrid failures before the min-word rule is relaxed
export const BRACKET_ATTEMPTS = 300;   // placement tries per column
export const BRACKET_INNER_MIN = 1;
export const BRACKET_INNER_MAX = 4;
export const HEX_BASE_MIN = 0xF000;
export const HEX_BASE_MAX = 0xFE64;

// ─── UI ───────────────────────────────────────────────────────────────────────

export const MSG_PROMPT = 'INSIRA A SENHA AGORA';
export const MSG_ALERT  = '!!! ATENÇÃO: ÚLTIMA TENTATIVA !!!';

export const LOG_MAX_LINES = 40;
export const SR_MAX_LINES  = 6;

// typing speed (ms per char) and pauses (ms)
export const TYPE_HEADER_MS  = 8;
export const TYPE_LOG_MS     = 6;
export const TYPE_END_TITLE_MS = 8;
export const TYPE_END_MSG_MS = 5;
export const BOOT_PAUSE_MS   = 120;
export const BOOT_ROW_MS     = 12;
export const END_PAUSE_WON_MS  = 500;
export const END_PAUSE_LOST_MS = 400;
export const END_TITLE_PAUSE_MS = 120;
export const FLICKER_MS      = 70;

/**
 * Text of a difficulty menu button (label padded with non-breaking spaces).
 * @param {Difficulty} d
 * @param {number} idx  0-based position in the menu
 * @returns {string}
 */
export function menuLabel(d, idx) {
  return `[${idx + 1}] ${d.label.padEnd(14, '\u00A0')} ${d.desc}`;
}

/** Flavor texts shown (one at random) on the win screen. */
export const LORE = [
  'ARQUIVOS CLASSIFICADOS: O Vault 101 nunca foi projetado para abrir. Seus habitantes são sujeitos do Experimento 17-C da Vault-Tec. Nenhum deles sabe disso.',
  'REGISTRO INTERCEPTADO: Em 23 de outubro de 2077, às 9h47 EST, o primeiro ICBM foi detectado. O mundo acabou em duas horas.',
  'DIÁRIO DO SR. HOUSE: O Lucky 38 possui reservas de Nuka-Cola Quantum para 847 anos. Essa informação é CLASSIFICADA NÍVEL PLATINUM.',
  'RELATÓRIO ENCLAVE: A Operação Pureza Total foi aprovada. O Project Purity foi adulterado com FEV modificado. A "purificação" procede conforme planejado.',
  'TRANSMISSÃO BROTHERHOOD: Paladin Danse reporta infiltração Synth em todos os assentamentos do Commonwealth. Não se pode confiar em ninguém.',
  'MEMÓRIA SYNTH RECUPERADA: Eu não sabia que era um Synth. Vivi minha vida inteira acreditando ser humano. O Instituto pode ter substituído qualquer pessoa.',
  'GRAVAÇÃO VAULT-TEC: Os experimentos dos Vaults nunca foram sobre sobrevivência. Eram coleta de dados comportamentais para controle pós-guerra.',
  'ARQUIVO NCR: A República da Nova Califórnia se expande além de Hoover Dam. Com a expansão vem a corrupção. O sonho pode ser apenas uma nova opressão.'
];
