const QUESTIONS = [
  {q: 'Periode Jomon di Jepang terkenal karena…', opts:['Kerajaan besar','Tembikar bercorak tali','Istana batu','Kuil Buddha tertua']},
  {q: 'Tokoh yang dianggap mendirikan Gojoseon adalah…', opts:['Amaterasu','Jimmu','Dangun','Gwanggaeto']},
  {q: 'Agama yang dibawa Korea ke Jepang dan sangat mempengaruhi budaya Jepang adalah…', opts:['Shintō','Taoisme','Animisme','Buddhisme']},
  {q: 'Shintō berfokus pada…', opts:['Penaklukan kerajaan','Pemujaan kami (roh alam)','Penguasaan perdagangan','Kode hukum tertulis']},
  {q: 'Korea disebut ‘jembatan budaya’ karena…', opts:['Rajanya suka jalan-jalan','Letaknya di tengah Cina–Jepang','Semua teknologinya berasal dari Eropa','Tidak punya kontak dengan negara lain']},
  {q: 'Kemiripan seni lukis Goguryeo dan makam Jepang era Kofun menunjukkan…', opts:['Jepang menginvasi Korea','Seniman Jepang meniru Cina','Migrasi dan transfer budaya ke Jepang','Tidak ada hubungan budaya sama sekali']},
  {q: 'Letak Jepang sebagai kepulauan vulkanik memengaruhi masyarakatnya dengan…', opts:['Tidak bisa bertani','Membentuk budaya adaptif & bergantung pada laut','Memaksa penduduk tinggal di pegunungan','Menjadikan Jepang pusat perdagangan daratan Asia']},
  {q: 'Meski kerajaan Korea saling berperang, budaya mereka tetap sampai ke Jepang karena…', opts:['Tidak pernah konflik','Perdagangan & diplomasi tetap berjalan','Jepang menyalin dari India','Raja Jepang memerintah Korea']},
  {q: 'Jepang lebih selektif menyerap budaya Cina dibanding Korea karena…', opts:['Jepang mengisolasi diri','Jepang tidak punya laut','Letaknya terpisah dari tekanan langsung Cina','Penduduk Jepang menolak budaya asing']},
  {q: 'Bukti hubungan Jepang–Korea melibatkan transfer teknologi adalah…', opts:['Korea mengirim pasukan','Migrasi bangsawan & biksu Baekje membawa teknologi','Jepang melarang pengaruh Korea','Korea hanya menjual makanan']}
];

const ANSWERS = ['B','C','D','B','B','C','B','B','C','B'];

let state = {name:'', answers: Array(QUESTIONS.length).fill(null), index:0};

const slides = document.getElementById('slides');
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('nameInput');
const questionArea = document.getElementById('questionArea');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

function showSlide(name){
  document.querySelectorAll('.slide').forEach(s=>s.classList.remove('active'));
  const node = document.querySelector(`.slide[data-slide="${name}"]`);
  if(node) node.classList.add('active');
}

function renderQuestion(i){
  const data = QUESTIONS[i];
  questionArea.innerHTML = `
    <div class="question">
      <div class="question-title">${i+1}. ${data.q}</div>
      <div class="options" role="list">
        ${data.opts.map((o, idx)=>{
          const label = String.fromCharCode(65+idx);
          const sel = state.answers[i]===label? 'selected': '';
          return `<div class="option ${sel}" data-opt="${label}" role="listitem"> <strong>${label}.</strong> ${o}</div>`
        }).join('')}
      </div>
    </div>
  `;
  // wire option clicks
  questionArea.querySelectorAll('.option').forEach(el=>{
    el.onclick = ()=>{
      const opt = el.getAttribute('data-opt');
      state.answers[i]=opt;
      renderQuestion(i);
    }
  });
}

startBtn.onclick = ()=>{
  const name = nameInput.value.trim() || 'Peserta';
  state.name = name;
  state.index = 0;
  renderQuestion(0);
  showSlide('questions');
};

prevBtn.onclick = ()=>{
  if(state.index>0) state.index--;
  renderQuestion(state.index);
};

nextBtn.onclick = ()=>{
  // if not answered, allow moving but encourage selection
  if(state.index < QUESTIONS.length-1){
    state.index++;
    renderQuestion(state.index);
  } else {
    // finish
    showResult();
    showSlide('result');
  }
};

function showResult(){
  const resultSummary = document.getElementById('resultSummary');
  let correct = 0;
  resultSummary.innerHTML = '';
  QUESTIONS.forEach((q, i)=>{
    const user = state.answers[i] || '-';
    const correctAns = ANSWERS[i];
    if(user === correctAns) correct++;
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `<div><strong>${i+1}.</strong> ${q.q}</div><div>${user} → ${correctAns}</div>`;
    resultSummary.appendChild(row);
  });
  const scoreNumber = document.getElementById('scoreNumber');
  scoreNumber.textContent = `${correct}/${QUESTIONS.length}`;
  // badge logic
  const badgeBox = document.getElementById('badgeBox');
  const pct = correct / QUESTIONS.length;
  let badge = 'Explorer';
  if(pct === 1) badge = 'Samurai Scholar';
  else if(pct >= 0.8) badge = 'Korea Ancient Master';
  else if(pct >= 0.5) badge = 'Cultural Student';
  else badge = 'Curious Seeker';
  badgeBox.textContent = `${state.name} — ${badge}`;
}

restartBtn.onclick = ()=>{
  state.answers = Array(QUESTIONS.length).fill(null);
  state.index = 0;
  nameInput.value = '';
  showSlide('intro');
};

// small keyboard accessibility
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight') nextBtn.click();
  if(e.key === 'ArrowLeft') prevBtn.click();
});

// initial
showSlide('intro');
