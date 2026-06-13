const GRID = [
    ['P','A','S','T','O','R','Z','K','X','F'],
    ['O','M','I','J','H','B','U','E','N','W'],
    ['Y','F','O','J','H','N','T','Y','H','P'],
    ['E','N','A','Y','E','Z','C','G','V','I'],
    ['N','O','L','L','A','M','A','X','I','D'],
    ['H','H','A','B','E','L','X','K','D','A'],
    ['S','I','G','U','E','N','D','S','A','I'],
    ['K','L','Z','R','V','Z','V','I','U','S'],
    ['W','F','D','C','I','Y','I','Z','U','M'],
    ['X','P','Q','E','O','T','Y','G','J','K']
];

const WORDS = ['BUEN', 'LLAMA', 'PASTOR', 'OYEN', 'SIGUEN', 'VIDA'];

const WORD_POSITIONS = {
    'BUEN':   { row: 1, col: 5, dir: 'right' },
    'LLAMA':  { row: 4, col: 2, dir: 'right' },
    'PASTOR': { row: 0, col: 0, dir: 'right' },
    'OYEN':   { row: 1, col: 0, dir: 'down' },
    'SIGUEN': { row: 6, col: 0, dir: 'right' },
    'VIDA':   { row: 3, col: 8, dir: 'down' }
};

const ROWS = GRID.length;
const COLS = GRID[0].length;

let startCell = null;
let foundWords = [];
let isSelecting = false;

function init() {
    try {
        renderGrid();
        updateProgress();
    } catch (e) {
        console.error('Error al inicializar el juego:', e);
    }
}

function renderGrid() {
    try {
        const gridEl = document.getElementById('wordGrid');
        if (!gridEl) throw new Error('No se encontró el elemento wordGrid');

        gridEl.innerHTML = '';

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.textContent = GRID[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;

                cell.addEventListener('click', () => onCellClick(r, c, cell));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    onCellClick(r, c, cell);
                }, { passive: false });

                gridEl.appendChild(cell);
            }
        }
    } catch (e) {
        console.error('Error al renderizar la cuadrícula:', e);
    }
}

function onCellClick(row, col, cellEl) {
    try {
        if (foundWords.length === WORDS.length) return;

        clearTempHighlights();

        if (!startCell) {
            startCell = { row, col, el: cellEl };
            cellEl.classList.add('start-cell');
            isSelecting = true;
            return;
        }

        if (startCell.row === row && startCell.col === col) {
            startCell.el.classList.remove('start-cell');
            startCell = null;
            isSelecting = false;
            return;
        }

        const line = getLine(startCell.row, startCell.col, row, col);
        if (!line) {
            startCell.el.classList.remove('start-cell');
            startCell = null;
            isSelecting = false;
            showInvalidSelection(cellEl);
            return;
        }

        const wordFromLine = line.map(c => GRID[c.row][c.col]).join('');
        const reverseWord = wordFromLine.split('').reverse().join('');

        let matchedWord = null;
        for (const w of WORDS) {
            if (!foundWords.includes(w) && (wordFromLine === w || reverseWord === w)) {
                matchedWord = w;
                break;
            }
        }

        if (matchedWord) {
            startCell.el.classList.remove('start-cell');
            line.forEach(c => {
                const el = getCellElement(c.row, c.col);
                if (el) el.classList.add('found');
            });
            foundWords.push(matchedWord);
            markWordChip(matchedWord);
            updateProgress();
            startCell = null;
            isSelecting = false;

            if (foundWords.length === WORDS.length) {
                setTimeout(showCelebration, 600);
            }
        } else {
            highlightTemp(line);
            setTimeout(() => {
                clearTempHighlights();
                if (startCell) startCell.el.classList.remove('start-cell');
                startCell = null;
                isSelecting = false;
            }, 800);
        }
    } catch (e) {
        console.error('Error al procesar clic:', e);
        if (startCell) startCell.el.classList.remove('start-cell');
        startCell = null;
        isSelecting = false;
    }
}

function getLine(r1, c1, r2, c2) {
    try {
        const dr = r2 - r1;
        const dc = c2 - c1;

        const absDr = Math.abs(dr);
        const absDc = Math.abs(dc);

        if (dr === 0 && dc === 0) return null;

        if (dr === 0) {
            const step = dc > 0 ? 1 : -1;
            const line = [];
            for (let c = c1; c !== c2 + step; c += step) {
                line.push({ row: r1, col: c });
            }
            return line;
        }

        if (dc === 0) {
            const step = dr > 0 ? 1 : -1;
            const line = [];
            for (let r = r1; r !== r2 + step; r += step) {
                line.push({ row: r, col: c1 });
            }
            return line;
        }

        if (absDr === absDc) {
            const stepR = dr > 0 ? 1 : -1;
            const stepC = dc > 0 ? 1 : -1;
            const line = [];
            let r = r1, c = c1;
            while (true) {
                line.push({ row: r, col: c });
                if (r === r2 && c === c2) break;
                r += stepR;
                c += stepC;
                if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
            }
            return line;
        }

        return null;
    } catch (e) {
        console.error('Error al calcular línea:', e);
        return null;
    }
}

function getCellElement(row, col) {
    try {
        const gridEl = document.getElementById('wordGrid');
        if (!gridEl) return null;
        const index = row * COLS + col;
        return gridEl.children[index] || null;
    } catch (e) {
        console.error('Error al obtener celda:', e);
        return null;
    }
}

function highlightTemp(line) {
    try {
        line.forEach(c => {
            const el = getCellElement(c.row, c.col);
            if (el) el.classList.add('selected');
        });
    } catch (e) {
        console.error('Error al resaltar celdas:', e);
    }
}

function clearTempHighlights() {
    try {
        document.querySelectorAll('.grid-cell.selected').forEach(el => {
            el.classList.remove('selected');
        });
    } catch (e) {
        console.error('Error al limpiar resaltado:', e);
    }
}

function showInvalidSelection(cellEl) {
    try {
        cellEl.classList.add('selected');
        setTimeout(() => cellEl.classList.remove('selected'), 400);
    } catch (e) {
        console.error('Error al mostrar selección inválida:', e);
    }
}

function markWordChip(word) {
    try {
        const chip = document.querySelector(`.word-chip[data-word="${word}"]`);
        if (chip) chip.classList.add('found');
    } catch (e) {
        console.error('Error al marcar palabra:', e);
    }
}

function updateProgress() {
    try {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (!fill || !text) return;

        const pct = (foundWords.length / WORDS.length) * 100;
        fill.style.width = pct + '%';
        text.textContent = `${foundWords.length} / ${WORDS.length} palabras encontradas`;
    } catch (e) {
        console.error('Error al actualizar progreso:', e);
    }
}

function showCelebration() {
    try {
        const celebration = document.getElementById('celebration');
        if (celebration) {
            celebration.classList.add('active');
            launchConfetti();
        }
    } catch (e) {
        console.error('Error al mostrar celebración:', e);
    }
}

function launchConfetti() {
    try {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        container.innerHTML = '';

        const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#55efc4', '#ff7675', '#74b9ff'];

        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 10 + 6) + 'px';
            piece.style.height = (Math.random() * 10 + 6) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            piece.style.animationDelay = (Math.random() * 1.5) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => { container.innerHTML = ''; }, 5000);
    } catch (e) {
        console.error('Error al lanzar confeti:', e);
    }
}

function validateSentences() {
    try {
        const answers = {
            sentence1: 'BUEN',
            sentence2: 'PASTOR',
            sentence3: 'LLAMA',
            sentence4: 'OYEN',
            sentence5: 'SIGUEN',
            sentence6: 'VIDA'
        };

        let allCorrect = true;

        for (const [id, expected] of Object.entries(answers)) {
            const input = document.getElementById(id);
            if (!input) {
                console.error(`No se encontró el input: ${id}`);
                continue;
            }

            const value = input.value.trim().toUpperCase();
            input.classList.remove('correct', 'incorrect');

            if (value === expected) {
                input.classList.add('correct');
            } else {
                input.classList.add('incorrect');
                allCorrect = false;
            }
        }

        if (allCorrect) {
            showMiniCelebration();
        }
    } catch (e) {
        console.error('Error al validar frases:', e);
    }
}

function showMiniCelebration() {
    try {
        const btn = document.querySelector('.btn-verify');
        if (!btn) return;

        const originalText = btn.textContent;
        btn.textContent = '¡Correcto! 🎉';
        btn.style.background = 'linear-gradient(145deg, #00b894, #00a381)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    } catch (e) {
        console.error('Error en celebración mini:', e);
    }
}

function resetGame() {
    try {
        foundWords = [];
        startCell = null;
        isSelecting = false;

        const celebration = document.getElementById('celebration');
        if (celebration) celebration.classList.remove('active');

        document.querySelectorAll('.word-chip.found').forEach(el => {
            el.classList.remove('found');
        });

        document.querySelectorAll('.grid-cell.found, .grid-cell.selected, .grid-cell.start-cell').forEach(el => {
            el.classList.remove('found', 'selected', 'start-cell');
        });

        document.querySelectorAll('.sentence input').forEach(el => {
            el.classList.remove('correct', 'incorrect');
            el.value = '';
        });

        updateProgress();
    } catch (e) {
        console.error('Error al reiniciar juego:', e);
    }
}

document.addEventListener('DOMContentLoaded', init);
