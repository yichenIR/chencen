document.addEventListener('DOMContentLoaded', () => {
    const pianoContainer = document.getElementById('piano-container');
    const practiceBtn = document.getElementById('practice-btn');
    const progressElement = document.getElementById('progress');
    const decreaseOctaveBtn = document.getElementById('decrease-octave');
    const increaseOctaveBtn = document.getElementById('increase-octave');
    const currentOctaveDisplay = document.getElementById('current-octave');
    const metronomeBtn = document.getElementById('metronome-btn');
    const tempoSlider = document.getElementById('tempo');
    const tempoValue = document.getElementById('tempo-value');
    
    // 鋼琴音符設定
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const startOctave = 3; // 起始八度音
    const endOctave = 5;   // 結束八度音
    let synth = null;

    // 節拍器設定
    let metronome = null;
    let isMetronomeOn = false;

    // 初始化 Tone.js
    async function initAudio() {
        await Tone.start();
        synth = new Tone.Synth().toDestination();
    }

    // 創建鋼琴鍵盤
    function createPiano() {
        for (let octave = startOctave; octave <= endOctave; octave++) {
            const octaveContainer = document.createElement('div');
            octaveContainer.className = 'octave-container';
            
            notes.forEach((note, index) => {
                const key = document.createElement('div');
                key.className = `piano-key ${note.includes('#') ? 'black' : 'white'}`;
                key.dataset.note = note + octave;
                
                // 加入音符標籤
                const label = document.createElement('div');
                label.className = 'key-label';
                label.textContent = `${note}${octave}`;
                key.appendChild(label);

                // 點擊事件
                key.addEventListener('mousedown', () => playNote(note + octave));
                key.addEventListener('mouseup', () => stopNote());
                key.addEventListener('mouseleave', () => stopNote());
                
                octaveContainer.appendChild(key);
            });
            
            pianoContainer.appendChild(octaveContainer);
        }
    }

    // 播放音符
    function playNote(note) {
        if (!synth) return;
        synth.triggerAttack(note);
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) key.classList.add('active');

        if (practiceMode) {
            checkNote(note);
        }
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
        const randomOctave = Math.floor(Math.random() * (endOctave - startOctave + 1)) + startOctave;
        const randomIndex = Math.floor(Math.random() * notes.length);
        const selectedNote = notes[randomIndex];
        currentNote = selectedNote + randomOctave;
        alert(`請彈奏 ${selectedNote}${randomOctave} 音符`);
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

    // 節拍器相關
    function initMetronome() {
        const clickSound = new Tone.Player({
            url: 'https://tonejs.github.io/audio/berklee/woodblock.mp3',
            autostart: false
        }).toDestination();

        return new Tone.Loop(time => {
            clickSound.start(time);
        }, '4n');
    }

    function updateTempo(value) {
        if (metronome) {
            Tone.Transport.bpm.value = value;
            tempoValue.textContent = value;
        }
    }

    function toggleMetronome() {
        if (!metronome) {
            metronome = initMetronome();
        }

        if (!isMetronomeOn) {
            Tone.Transport.start();
            metronome.start(0);
            isMetronomeOn = true;
            metronomeBtn.textContent = '停止節拍器';
            metronomeBtn.classList.replace('btn-info', 'btn-warning');
        } else {
            Tone.Transport.stop();
            metronome.stop();
            isMetronomeOn = false;
            metronomeBtn.textContent = '開始節拍器';
            metronomeBtn.classList.replace('btn-warning', 'btn-info');
        }
    }

    // 更新八度音顯示
    function updateOctaveDisplay() {
        currentOctaveDisplay.textContent = `八度：${currentOctave}`;
    }

    // 鍵盤對應
    const keyboardMap = {
        'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 'g': 'G', 'h': 'A', 'j': 'B',
        'w': 'C#', 'e': 'D#', 't': 'F#', 'y': 'G#', 'u': 'A#'
    };

    let currentOctave = 4; // 當前選擇的八度音
    
    // 鍵盤控制
    document.addEventListener('keydown', (e) => {
        const note = keyboardMap[e.key.toLowerCase()];
        if (note) {
            e.preventDefault();
            playNote(note + currentOctave);
        }
        // 切換八度音
        else if (e.key === 'z' && currentOctave > startOctave) {
            currentOctave--;
        }
        else if (e.key === 'x' && currentOctave < endOctave) {
            currentOctave++;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keyboardMap[e.key.toLowerCase()]) {
            stopNote();
        }
    });

    // 初始化
    initAudio().then(() => {
        createPiano();
        updateOctaveDisplay();
    });

    // 事件監聽
    practiceBtn.addEventListener('click', startPractice);

    decreaseOctaveBtn.addEventListener('click', () => {
        if (currentOctave > startOctave) {
            currentOctave--;
            updateOctaveDisplay();
        }
    });

    increaseOctaveBtn.addEventListener('click', () => {
        if (currentOctave < endOctave) {
            currentOctave++;
            updateOctaveDisplay();
        }
    });

    metronomeBtn.addEventListener('click', () => {
        toggleMetronome();
    });

    tempoSlider.addEventListener('input', (e) => {
        updateTempo(e.target.value);
    });
});