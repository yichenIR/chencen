document.addEventListener('DOMContentLoaded', () => {
    const startPracticeBtn = document.getElementById('start-practice');
    const currentTaskSpan = document.getElementById('current-task');
    const correctCountSpan = document.getElementById('correct-count');
    const practiceProgressSpan = document.getElementById('practice-progress');
    
    let correctCount = 0;
    const totalNotes = 8; // 一個八度的音符數量
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    let currentNote = null;

    function updateProgress() {
        const progress = Math.round((correctCount / totalNotes) * 100);
        practiceProgressSpan.textContent = `${progress}%`;
    }

    function generateRandomNote() {
        const randomIndex = Math.floor(Math.random() * notes.length);
        return notes[randomIndex];
    }

    function startPractice() {
        correctCount = 0;
        updateProgress();
        correctCountSpan.textContent = '0';
        startPracticeBtn.textContent = '練習中...';
        startPracticeBtn.disabled = true;
        
        currentNote = generateRandomNote();
        currentTaskSpan.textContent = `請彈奏 ${currentNote}`;
    }

    // 監聽鋼琴按鍵事件
    document.addEventListener('pianoKeyPlayed', (e) => {
        if (!startPracticeBtn.disabled) return;
        
        const playedNote = e.detail.note;
        if (playedNote === currentNote) {
            correctCount++;
            correctCountSpan.textContent = correctCount;
            updateProgress();

            if (correctCount >= totalNotes) {
                currentTaskSpan.textContent = '恭喜完成練習！';
                startPracticeBtn.textContent = '重新開始';
                startPracticeBtn.disabled = false;
            } else {
                currentNote = generateRandomNote();
                currentTaskSpan.textContent = `請彈奏 ${currentNote}`;
            }
        }
    });

    startPracticeBtn.addEventListener('click', startPractice);
});