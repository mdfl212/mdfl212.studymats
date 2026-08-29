// Ensure tags array exists for every item
Q.forEach(q => { if (!q.tags) q.tags = []; });

const THEME_NAMES = ['', 'Obstetrics', 'Gynecology'];
const OPTS = ['A', 'B', 'C', 'D'];

let state = {
    mode: 'exam',
    answers: {},
    revealed: {},
    filter: { t: 'all', type: 'all', tag: 'all' },
    page: 0,
    perPage: 10,
    tableView: false
};

function getFiltered() {
    return Q.filter(q => {
        if (state.filter.t !== 'all' && q.t !== +state.filter.t) return false;
        if (state.filter.type === 'clinical' && !q.c) return false;
        if (state.filter.type === 'conceptual' && q.c) return false;
        if (state.filter.tag !== 'all' && !q.tags.includes(state.filter.tag)) return false;
        return true;
    });
}

function setMode(m) {
    state.mode = m;
    document.querySelectorAll('.tab').forEach((el, i) => {
        el.classList.toggle('active', ['exam', 'review', 'key'][i] === m);
    });
    state.page = 0;
    render();
    if (state.tableView) renderTable();
}

function applyFilter() {
    state.filter.t = document.getElementById('themeFilter').value;
    state.filter.type = document.getElementById('typeFilter').value;
    state.filter.tag = document.getElementById('tagFilter').value;
    state.page = 0;
    render();
    if (state.tableView) renderTable();
}

function changePerPage() {
    state.perPage = +document.getElementById('perPageSel').value;
    state.page = 0;
    render();
}

function resetAll() {
    if (!confirm('Reset all answers? This cannot be undone.')) return;
    state.answers = {};
    state.revealed = {};
    updateStats();
    render();
    if (state.tableView) renderTable();
}

function openScore() {
    const fq = getFiltered();
    const answered = fq.filter(x => state.answers[x.id] !== undefined).length;
    const correct = fq.filter(x => state.answers[x.id] === x.ans).length;
    const pct = answered > 0 ? Math.round(correct / answered * 100) : 0;
    const color = pct >= 75 ? '#00A6A6' : '#D94F70';
    const grade = pct >= 90 ? 'Distinction' : pct >= 75 ? 'Pass' : pct >= 60 ? 'Near Pass' : 'Needs Review';
    
    document.getElementById('modalScore').textContent = pct + '%';
    document.getElementById('modalScore').style.color = color;
    document.getElementById('modalGrade').textContent = grade;
    document.getElementById('modalGrade').style.color = color;
    document.getElementById('modalSub').textContent =
        `${fq.length} questions · Section: ${document.getElementById('themeFilter').options[document.getElementById('themeFilter').selectedIndex].text}`;
    document.getElementById('mdAns').textContent = answered;
    document.getElementById('mdCorr').textContent = correct;
    document.getElementById('mdWrong').textContent = answered - correct;
    document.getElementById('scoreModal').classList.add('open');
}

function closeScore(e) {
    if (!e || e.target.id === 'scoreModal' || e.target.className === 'btn primary') {
        document.getElementById('scoreModal').classList.remove('open');
    }
}

function updateStats() {
    const fq = getFiltered();
    const answered = fq.filter(x => state.answers[x.id] !== undefined).length;
    const correct = fq.filter(x => state.answers[x.id] === x.ans).length;
    
    document.getElementById('sTotal').textContent = fq.length;
    document.getElementById('sAnswered').textContent = answered;
    document.getElementById('sCorrect').textContent = correct;
    document.getElementById('sPct').textContent = answered > 0 ? Math.round(correct / answered * 100) + '%' : '—';
    
    const pct = Math.round(answered / Math.max(fq.length, 1) * 100);
    document.getElementById('progFill').style.width = pct + '%';
    document.getElementById('progLabel').textContent = `${answered} / ${fq.length} answered`;
    document.getElementById('progPct').textContent = pct + '%';
}

function selectAnswer(id, idx) {
    if (state.mode === 'key') return;
    state.answers[id] = idx;
    if (state.mode === 'review') state.revealed[id] = true;
    updateStats();
    render();
    if (state.tableView) renderTable();
}

function toggleReveal(id) {
    state.revealed[id] = !state.revealed[id];
    render();
    if (state.tableView) renderTable();
}

function prevPage() {
    if (state.page > 0) { 
        state.page--;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
}

function nextPage() {
    const total = Math.ceil(getFiltered().length / state.perPage);
    if (state.page < total - 1) { 
        state.page++;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
}

function toggleTableView() {
    state.tableView = !state.tableView;
    const wrap = document.getElementById('tableViewWrap');
    const btn = document.getElementById('tableToggleBtn');
    if (state.tableView) {
        wrap.classList.add('open');
        btn.classList.add('active');
        renderTable();
    } else {
        wrap.classList.remove('open');
        btn.classList.remove('active');
    }
}

function renderTable() {
    const fq = getFiltered();
    const search = document.getElementById('tableSearch').value.toLowerCase();
    let filtered = fq;
    if (search) {
        filtered = fq.filter(q =>
            q.stem.toLowerCase().includes(search) ||
            q.r.toLowerCase().includes(search) ||
            q.tags.some(t => t.toLowerCase().includes(search))
        );
    }
    const tbody = document.getElementById('tableBody');
    let html = '';
    filtered.forEach(q => {
        const userAns = state.answers[q.id];
        const reveal = state.revealed[q.id] || state.mode === 'key';
        let ansDisplay = '—';
        if (reveal || userAns !== undefined) {
            if (reveal) ansDisplay = OPTS[q.ans];
            else if (userAns !== undefined) ansDisplay = OPTS[userAns];
        }
        const correctMark = (reveal && userAns === q.ans) ? ' ✓' : '';
        const wrongMark = (reveal && userAns !== undefined && userAns !== q.ans) ? ' ✗' : '';
        const tagStr = q.tags.slice(0, 3).join(', ') + (q.tags.length > 3 ? '…' : '');
        html += `<tr>
            <td class="qnum-col">Q${q.id}</td>
            <td class="ans-col">${ansDisplay}${correctMark}${wrongMark}</td>
            <td class="stem-col">${q.stem}</td>
            <td class="r-col">${q.r}</td>
            <td class="tag-col">${tagStr}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
    document.getElementById('tableCount').textContent = `Showing ${filtered.length} of ${fq.length} questions`;
}

function render() {
    const filtered = getFiltered();
    const total = Math.ceil(filtered.length / state.perPage);
    const start = state.page * state.perPage;
    const visible = filtered.slice(start, start + state.perPage);
    
    document.getElementById('sTotal').textContent = filtered.length;
    document.getElementById('pageInfo').textContent =
        `Page ${state.page+1} of ${Math.max(total,1)} · Items ${start+1}–${Math.min(start+state.perPage, filtered.length)} of ${filtered.length}`;
    
    let html = '';
    let lastTheme = null;
    visible.forEach(q => {
        if (q.t !== lastTheme) {
            if (lastTheme !== null) {
                html += `<div class="theme-divider"><div class="theme-divider-line"></div><div class="theme-divider-label">${THEME_NAMES[q.t]}</div><div class="theme-divider-line"></div></div>`;
            }
            lastTheme = q.t;
        }
        const userAns = state.answers[q.id];
        const revealed = state.revealed[q.id] || state.mode === 'key';
        const tagHtml = q.tags.length ? q.tags.map(t => {
            let cls = 'tag';
            if (t === 'Preeclampsia' || t === 'Eclampsia') cls += ' tag-preeclampsia';
            if (t === 'Contraception') cls += ' tag-contraception';
            return `<span class="${cls}">${t}</span>`;
        }).join('') : '';
        
        const optHtml = q.opts.map((opt, i) => {
            let cls = 'opt';
            if (revealed) {
                if (i === q.ans) cls += ' correct';
                else if (userAns === i) cls += ' wrong';
            } else {
                if (userAns === i) cls += ' selected';
            }
            const click = state.mode !== 'key' ? `onclick="selectAnswer(${q.id},${i})"` : '';
            return `<button class="${cls}" ${click}><span class="opt-letter">${OPTS[i]}.</span><span>${opt}</span></button>`;
        }).join('');
        
        const rationaleHtml = revealed ?
            `<div class="rationale"><strong>Answer: ${OPTS[q.ans]}</strong> — ${q.r}</div>` :
            '';
        const revealBtn = state.mode === 'exam' && userAns !== undefined && !state.revealed[q.id] ?
            `<button class="reveal-btn" onclick="toggleReveal(${q.id})">Show answer &amp; rationale</button>` :
            '';
        
        let badges = `<span class="badge badge-theme">${THEME_NAMES[q.t]}</span>`;
        if (q.c) badges += ` <span class="badge badge-clinical">● Clinical</span>`;
        
        html += `<div class="q-card">
      <div class="q-meta"><span class="q-num">Q${q.id}</span>${badges}</div>
      <div class="tag-group">${tagHtml}</div>
      <div class="q-stem">${q.stem}</div>
      <div class="options">${optHtml}</div>
      ${revealBtn}
      ${rationaleHtml}
    </div>`;
    });
    
    document.getElementById('qContainer').innerHTML = html;
    updateStats();
}

// Global Event Listeners
window.addEventListener('scroll', () => {
    document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 300);
});

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'Escape') closeScore();
});

// Initial Render
render();