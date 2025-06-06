document.addEventListener('DOMContentLoaded', () => {
    const pianoContainer = document.getElementById('piano-container');
    const practiceBtn = document.getElementById('practice-btn');
    const progressElement = document.getElementById('progress');
    
    // 鋼琴音符設定
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = 4; // 起始八度音
    let synth = null;

    // 初始化 Tone.js
    async function initAudio() {
        await Tone.start();
        synth = new Tone.Synth().toDestination();
    }

    // 創建鋼琴鍵盤
    function createPiano() {
        notes.forEach((note, index) => {
            const key = document.createElement('div');
            key.className = `piano-key ${note.includes('#') ? 'black' : 'white'}`;
            key.dataset.note = note + octave;
            
            // 加入音符標籤
            const label = document.createElement('div');
            label.className = 'key-label';
            label.textContent = note;
            key.appendChild(label);

            // 點擊事件
            key.addEventListener('mousedown', () => playNote(note + octave));
            key.addEventListener('mouseup', () => stopNote());
            key.addEventListener('mouseleave', () => stopNote());
            
            pianoContainer.appendChild(key);
        });
    }

    // 播放音符
    function playNote(note) {
        if (!synth) return;
        synth.triggerAttack(note);
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) key.classList.add('active');
    }

    // 停止播放
    function stopNote() {
        if (!synth) return;
        synth.triggerRelease();
        document.querySelectorAll('.piano-key').forEach(key => {
            key.classList.remove('active');
        });
    }

    // 練習模式
    let practiceMode = false;
    let currentNote = null;
    let correctNotes = 0;
    const totalNotes = 8; // 練習目標音符數

    function startPractice() {
        practiceMode = true;
        correctNotes = 0;
        updateProgress();
        selectRandomNote();
        practiceBtn.textContent = '練習中...';
    }

    function selectRandomNote() {
        const randomIndex = Math.floor(Math.random() * notes.length);
        currentNote = notes[randomIndex] + octave;
        alert(`請彈奏 ${notes[randomIndex]} 音符`);
    }

    function checkNote(playedNote) {
        if (!practiceMode || !currentNote) return;
        
        if (playedNote === currentNote) {
            correctNotes++;
            updateProgress();
            
            if (correctNotes >= totalNotes) {
                alert('恭喜完成練習！');
                practiceMode = false;
                practiceBtn.textContent = '開始練習';
                return;
            }
            
            selectRandomNote();
        }
    }

    function updateProgress() {
        const progress = (correctNotes / totalNotes) * 100;
        progressElement.textContent = `${Math.round(progress)}%`;
    }

    // 事件監聽
    practiceBtn.addEventListener('click', startPractice);

    // 鍵盤控制
    const keyMap = {
        'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 
        'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4',
        'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4'
    };

    document.addEventListener('keydown', (e) => {
        if (keyMap[e.key] && !e.repeat) {
            playNote(keyMap[e.key]);
            checkNote(keyMap[e.key]);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keyMap[e.key]) {
            stopNote();
        }
    });

    // 初始化
    initAudio();
    createPiano();
});