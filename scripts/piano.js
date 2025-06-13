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
    
    // 音符設定
    const notes = {
        white: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        black: ['C#', 'D#', 'F#', 'G#', 'A#']
    };
    const octaves = [3, 4];
    let synth = null;

    // 節拍器設定
    let metronome = null;
    let isMetronomeOn = false;

    // 初始化 Tone.js
    async function initAudio() {
        await Tone.start();
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }

    // 創建鋼琴鍵盤
    function createPiano() {
        const whiteKeysContainer = document.createElement('div');
        whiteKeysContainer.className = 'white-keys';
        const blackKeysContainer = document.createElement('div');
        blackKeysContainer.className = 'black-keys';
        
        octaves.forEach(octave => {
            // 創建白鍵
            notes.white.forEach((note, index) => {
                const key = createKey(note, octave, false);
                whiteKeysContainer.appendChild(key);
            });
            
            // 創建黑鍵
            notes.black.forEach((note, index) => {
                const key = createKey(note, octave, true);
                key.dataset.position = index.toString();
                blackKeysContainer.appendChild(key);
            });
        });

        pianoContainer.appendChild(whiteKeysContainer);
        pianoContainer.appendChild(blackKeysContainer);
    }

    // 創建單個琴鍵
    function createKey(note, octave, isBlack) {
        const key = document.createElement('div');
        key.className = `piano-key ${isBlack ? 'black' : 'white'}`;
        key.dataset.note = `${note}${octave}`;
        
        const label = document.createElement('div');
        label.className = 'key-label';
        label.textContent = `${note}${octave}`;
        key.appendChild(label);

        key.addEventListener('mousedown', () => playNote(note + octave));
        key.addEventListener('mouseup', () => stopNote());
        key.addEventListener('mouseleave', () => stopNote());

        return key;
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

    // 鍵盤映射
    const keyMap = {
        // 第一個八度 (低音)
        'z': 'C3', 'x': 'D3', 'c': 'E3', 
        'v': 'F3', 'b': 'G3', 'n': 'A3', 
        'm': 'B3', 's': 'C#3', 'd': 'D#3',
        'g': 'F#3', 'h': 'G#3', 'j': 'A#3',
        
        // 第二個八度 (高音)
        'q': 'C4', 'w': 'D4', 'e': 'E4',
        'r': 'F4', 't': 'G4', 'y': 'A4',
        'u': 'B4', '2': 'C#4', '3': 'D#4',
        '5': 'F#4', '6': 'G#4', '7': 'A#4'
    };

    // 鍵盤事件處理
    document.addEventListener('keydown', (e) => {
        if (keyMap[e.key] && !e.repeat) {
            playNote(keyMap[e.key]);
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