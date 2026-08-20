let currentFolder = 'root';
let openedFileName = null;
let trashContainer = [];
let calcExpression = "";

// ТВОЯ ЛИЧНАЯ ФИРМЕННАЯ СЛУЖБА: WINTUX TUNING & GPU BOOSTER
const wintuxGPUBooster = {
    currentMode: "STANDART",
    isTurbo: false,
    
    setMode(mode) {
        this.currentMode = mode;
        const modeText = document.getElementById('booster-mode-text');
        const clockText = document.getElementById('gpu-clock-text');
        const fanText = document.getElementById('gpu-fan-text');
        const logBox = document.getElementById('booster-log-box');
        
        if (!logBox) return;

        if (mode === "TURBO") {
            this.isTurbo = true;
            if (modeText) modeText.innerHTML = "🔥 NVIDIA TURBO BOOST ACTIVE";
            if (modeText) modeText.style.color = "#87cf3e";
            if (clockText) clockText.innerText = "2150 MHz (OC)";
            if (fanText) fanText.innerText = "Performance (85%)";
            logBox.innerText += "\n[SYSTEM]: Запущен разгон шины PCIe и ядер CUDA...";
            logBox.innerText += "\n[SYSTEM]: Оптимизация под Samsung Galaxy & PC завершена.";
        } else {
            this.isTurbo = false;
            if (modeText) modeText.innerHTML = "🌿 STANDART (ECO)";
            if (modeText) modeText.style.color = "#ffcc00";
            if (clockText) clockText.innerText = "1450 MHz";
            if (fanText) fanText.innerText = "Auto (45%)";
            logBox.innerText += "\n[SYSTEM]: Переключение в штатный энергосберегающий режим.";
        }
        logBox.scrollTop = logBox.scrollHeight;
    }
};

// ТЕРМИНАЛЬНЫЙ ДВИЖОК BASH С ТВОЕЙ СИСТЕМОЙ ЭМУЛЯЦИИ NVIDIA-SMI
const bashSimulator = {
    execute(commandStr) {
        const trimmed = commandStr.trim();
        if (!trimmed) return '';
        
        const args = trimmed.split(' ');
        const cmd = args[0].toLowerCase();
        const param = args.length > 1 ? args.slice(1).join(' ') : '';
        
        switch(cmd) {
            case 'clear':
                const history = document.getElementById('terminal-history');
                if (history) history.innerHTML = '';
                return 'clear_screen';
                
            case 'help':
                return `Доступные команды Wintux OS:\n` +
                       `  neofetch    - Вывести спецификации Wintux ПК и смартфона\n` +
                       `  nvidia-smi  - Проверить статус видеокарты Extreme Tuning\n` +
                       `  ls          - Показать файлы текущей директории Nemo\n` +
                       `  mkdir [имя] - Создать новую папку на виртуальном диске\n` +
                       `  rm [имя]    - Переместить выбранный файл в Корзину\n` +
                       `  clear       - Полностью очистить консоль\n` +
                       `  help        - Показать текущую справку`;
                       
            case 'nvidia-smi':
                const isTurboActive = wintuxGPUBooster.isTurbo;
                return `+-----------------------------------------------------------------------------+\n` +
                       `| NVIDIA-SMI 535.113.01   Driver Version: 535.113.01   CUDA Version: 12.2     |\n` +
                       `|-------------------------------+----------------------+----------------------+\n` +
                       `| GPU  Name          Persistence| Bus-Id        Disp.A | Volatile Uncorr. ECC |\n` +
                       `| Fan  Temp   Perf          Pwr:|       Memory-Usage   | GPU-Util  Compute M. |\n` +
                       `|===============================+======================+======================|\n` +
                       `|   0  Wintux GPU OC    On      | 00000000:01:00.0  On |                  N/A |\n` +
                       `| ${isTurboActive ? '85%' : '45%'}   62C    P2      ${isTurboActive ? '145W' : '45W'} |   2105MiB / 16384MiB |   ${isTurboActive ? '98%' : '12%'}      Default |\n` +
                       `+-------------------------------+----------------------+----------------------+\n` +
                       `| Режим Booster: ${isTurboActive ? '[TURBO OC ACTIVE]' : '[STANDART CLOCK]'}                                    |\n` +
                       `+-----------------------------------------------------------------------------+`;

            case 'neofetch':
                return `[GREEN]          eeeeeeeeeeeeeeeee[RESET]    user@wintux_pc\n` +
                       `[GREEN]      eeeeeeeeeeeeeeeeeeeeeee[RESET]  -------------\n` +
                       `[GREEN]    eeeee[RESET]  eeeeeeeeee  [GREEN]fffff[RESET]   OS: Wintux OS Extreme v4.0\n` +
                       `[GREEN]   eeee[RESET]  eeeeeeeeeeeee  [GREEN]fffff[RESET]  Kernel: Wintux Secure Sandbox Core\n` +
                       `[GREEN]  eeee[RESET]  eeeeeeeeeeeeeee  [GREEN]ffff[RESET]  DE: Cinnamon-Mica Secure DE\n` +
                       `[GREEN]  eee[RESET]  eeeeeeeeeeeeeeee  [GREEN]ffff[RESET]  Shell: bash simulator v2.5\n` +
                       `[GREEN]  eee[RESET]  eeeeeeeeeeeeeeee  [GREEN]ffff[RESET]  GPU Tuning: Wintux Tuning & GPU Booster Enabled\n` +
                       `[GREEN]  eeee[RESET]  eeeeeeeeeeeeeee  [GREEN]ffff[RESET]  Resolution: ${window.innerWidth}x${window.innerHeight}\n` +
                       `[GREEN]   eeee[RESET]  eeeeeeeeeeeee  [GREEN]ffff[RESET]   Target devices: Ноутбук / Samsung Galaxy\n` +
                       `[GREEN]    eeeee[RESET]  eeeeeeeeee  [GREEN]fffff[RESET]   Memory: 1.2GB / 16GB Virtual Allocated\n` +
                       `[GREEN]      eeeeeeeeeeeeeeeeeeeeeee[RESET]  Status: Все ошибки исправлены!`;
                       
            case 'ls':
                const files = FSCore.getFiles(currentFolder);
                if (files.length === 0) return 'Папка пуста';
                return files.map(f => f.type === 'folder' ? `[GREEN]${f.name}/[RESET]` : f.name).join('   ');
                
            case 'mkdir':
                if (!param) return 'mkdir: пропущен операнд имени папки';
                FSCore.createFolder(currentFolder, param);
                renderExplorer(currentFolder);
                return `Директория "${param}" успешно создана.`;

            case 'rm':
                if (!param) return 'rm: пропущен операнд имени файла';
                const fileList = FSCore.getFiles(currentFolder);
                const targetFile = fileList.find(f => f.name === param && f.type === 'file');
                if (!targetFile) return `rm: невозможно удалить "${param}": такого файла нет`;
                
                moveToTrash(param);
                return `Файл "${param}" перемещен в Корзину.`;
                
            default:
                return `bash: ${cmd}: команда не найдена. Введите "help" для справки.`;
        }
    }
};

// ОТРИСОВКА ВИРТУАЛЬНОГО ДИСКА NEMO
function renderExplorer(folderKey) {
    currentFolder = folderKey;
    const view = document.getElementById('fileView');
    if (!view) return;
    view.innerHTML = '';

    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`.sidebar-item[data-folder="${folderKey}"]`);
    if (activeItem) activeItem.classList.add('active');

    const files = FSCore.getFiles(folderKey);
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item';
        let icon = file.type === 'folder' ? '📁' : '📄';
        if (file.name.endsWith('.txt') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
            icon = '📝';
        }
        
        item.innerHTML = `<div style="font-size:32px;">${icon}</div><p>${file.name}</p>` +
                         `${file.type === 'file' ? `<button class="file-delete-btn" title="Удалить">✕</button>` : ''}`;
        
        if (file.type === 'file') {
            const delBtn = item.querySelector('.file-delete-btn');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    moveToTrash(file.name);
                });
            }
        }

        if (file.type === 'folder') {
            item.addEventListener('click', () => renderExplorer(file.target));
        } else {
            item.addEventListener('click', () => {
                openedFileName = file.name;
                document.getElementById('notepadText').value = file.content || "";
                document.getElementById('notepad-title').innerText = `📝 Xed — ${file.name}`;
                
                const runBtn = document.getElementById('btn-run-code');
                if (file.name.endsWith('.html')) {
                    if (runBtn) runBtn.style.display = 'inline';
                } else {
                    if (runBtn) runBtn.style.display = 'none';
                }
                openWindow('notepad');
            });
        }
        view.appendChild(item);
    });
}

function moveToTrash(filename) {
    const fileList = FSCore.getFiles(currentFolder);
    const targetFile = fileList.find(f => f.name === filename);
    if (!targetFile) return;

    trashContainer.push({ ...targetFile, originalFolder: currentFolder });
    FSCore.data[currentFolder] = FSCore.data[currentFolder].filter(f => f.name !== filename);
    FSCore.save();
    
    renderExplorer(currentFolder);
    renderTrashView();
    alert(`Файл "${filename}" успешно отправлен в Корзину.`);
}
// Отрисовка файлов внутри окна Корзины
function renderTrashView() {
    const trashView = document.getElementById('trashFileView');
    if (!trashView) return;
    trashView.innerHTML = '';

    if (trashContainer.length === 0) {
        trashView.innerHTML = '<div style="color:#a4a9b6; padding:15px; font-size:12px;">Корзина пуста</div>';
        return;
    }

    trashContainer.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<div style="font-size:32px; opacity:0.6;">🗑️</div><p>${file.name}</p>` +
                         `<button class="file-delete-btn" style="background:#4caf50;" title="Восстановить">↺</button>`;
        
        const restoreBtn = item.querySelector('.file-delete-btn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const origFolder = file.originalFolder;
                if (!FSCore.data[origFolder]) FSCore.data[origFolder] = [];
                
                FSCore.data[origFolder].push({ name: file.name, type: 'file', content: file.content });
                FSCore.save();
                
                trashContainer = trashContainer.filter((_, i) => i !== index);
                renderTrashView();
                renderExplorer(currentFolder);
                alert(`Файл "${file.name}" восстановлен.`);
            });
        }
        trashView.appendChild(item);
    });
}

function startSystemClock() {
    const clockEl = document.getElementById('system-clock');
    if (!clockEl) return;
    
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        clockEl.innerText = timeStr;
        clockEl.title = dateStr;
    }, 1000);
}

function initBatteryStatus() {
    const batEl = document.getElementById('battery-status');
    if (!batEl) return;

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateAllBatteryInfo() {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? " (Заряжается ⚡)" : "";
                batEl.innerText = `🔋 Статус питания: ${level}%${charging}`;
            }
            updateAllBatteryInfo();
            battery.addEventListener('levelchange', updateAllBatteryInfo);
            battery.addEventListener('chargingchange', updateAllBatteryInfo);
        });
    } else {
        batEl.innerText = "🔋 Статус питания: 100% (Внешний источник)";
    }
}
function checkSystemAuth() {
    const savedPassword = localStorage.getItem('wintux_sys_pwd');
    const authScreen = document.getElementById('wintux-auth-screen');
    const titleEl = document.getElementById('auth-title');
    
    if (!authScreen) return;
    authScreen.style.display = 'flex';

    if (!savedPassword) {
        if (titleEl) titleEl.innerText = "Создание пароля Wintux";
        const pwdInput = document.getElementById('auth-password-input');
        if (pwdInput) pwdInput.placeholder = "Придумайте пароль...";
    } else {
        if (titleEl) titleEl.innerText = "Вход в Wintux OS";
        const pwdInput = document.getElementById('auth-password-input');
        if (pwdInput) pwdInput.placeholder = "Введите пароль...";
    }
}

function submitAuthPassword() {
    const inputEl = document.getElementById('auth-password-input');
    const errorEl = document.getElementById('auth-error-msg');
    const authScreen = document.getElementById('wintux-auth-screen');
    const savedPassword = localStorage.getItem('wintux_sys_pwd');
    
    if (!inputEl) return;
    const value = inputEl.value.trim();

    if (!value) {
        alert("Пароль не может быть пустым!");
        return;
    }

    if (!savedPassword) {
        localStorage.setItem('wintux_sys_pwd', value);
        alert("Пароль успешно создан! Запомните его.");
        if (errorEl) errorEl.style.display = 'none';
        if (authScreen) authScreen.style.display = 'none';
        playSystemLogin();
    } else {
        if (value === savedPassword) {
            if (errorEl) errorEl.style.display = 'none';
            if (authScreen) authScreen.style.display = 'none';
            inputEl.value = '';
            playSystemLogin();
        } else {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.innerText = "Неверный пароль! Доступ заблокирован.";
            }
            inputEl.value = '';
        }
    }
}

function playSystemLogin() {
    const audio = document.getElementById('login-sound');
    if (audio) {
        audio.play().catch(e => console.log("Аудио заблокировано до клика"));
    }
}

function triggerSystemShutdown() {
    const plymouth = document.getElementById('plymouth-screen');
    const statusText = document.getElementById('plymouth-status');
    const powerBtn = document.getElementById('btn-boot-pc');
    const startMenu = document.getElementById('start-menu');
    const logoutDlg = document.getElementById('mint-logout-dialog');
    
    if (startMenu) startMenu.classList.remove('open');
    if (logoutDlg) logoutDlg.style.display = 'none';
    if (!plymouth) return;

    plymouth.style.display = 'flex';
    if (statusText) statusText.innerText = "Завершение процессов Wintux OS... Отключение ядер GPU Booster...";
    if (powerBtn) powerBtn.style.display = 'none';
    
    setTimeout(() => {
        if (statusText) statusText.innerText = "Система выключена (wintux_pc halted).";
        const spinner = plymouth.querySelector('.plymouth-spinner');
        if (spinner) spinner.style.display = 'none';
        if (powerBtn) powerBtn.style.display = 'block';
    }, 3000);
}

function triggerSystemBoot() {
    const plymouth = document.getElementById('plymouth-screen');
    const statusText = document.getElementById('plymouth-status');
    const powerBtn = document.getElementById('btn-boot-pc');
    
    if (!plymouth) return;
    if (powerBtn) powerBtn.style.display = 'none';

    const spinner = plymouth.querySelector('.plymouth-spinner');
    if (spinner) spinner.style.display = 'block';

    let stages = [
        "Инициализация ядра Wintux Core 2026...",
        "Проверка секторов LocalStorage (nemo_fs)... OK",
        "Запуск утилит GPU Booster и разгона NVIDIA...",
        "Синхронизация с базой заметок Wintux Notes..."
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
        if (currentStage < stages.length) {
            if (statusText) statusText.innerText = stages[currentStage];
            currentStage++;
        } else {
            clearInterval(interval);
            plymouth.style.display = 'none';
            checkSystemAuth();
        }
    }, 1000);
}
// ГЛОБАЛЬНЫЙ ЗАПУСК ВСЕХ ОБРАБОТЧИКОВ И ИНИЦИАЛИЗАЦИЯ WINTUX
document.addEventListener('DOMContentLoaded', () => {
    // Безопасный вызов загрузки ядра только после полной готовности DOM
    triggerSystemBoot();

    const submitAuthBtn = document.getElementById('btn-submit-auth');
    if (submitAuthBtn) submitAuthBtn.addEventListener('click', submitAuthPassword);
    
    const authInput = document.getElementById('auth-password-input');
    if (authInput) {
        authInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitAuthPassword(); });
    }

    const bootBtn = document.getElementById('btn-boot-pc');
    if (bootBtn) bootBtn.addEventListener('click', () => {
        const pScreen = document.getElementById('plymouth-screen');
        if (pScreen) {
            const spinner = pScreen.querySelector('.plymouth-spinner');
            if (spinner) spinner.style.display = 'block';
        }
        triggerSystemBoot();
    });

    // Обработчики кнопок твоего разгонного GPU Booster
    const btnTurbo = document.getElementById('btn-booster-turbo');
    const btnNormal = document.getElementById('btn-booster-normal');
    if (btnTurbo) btnTurbo.addEventListener('click', () => wintuxGPUBooster.setMode("TURBO"));
    if (btnNormal) btnNormal.addEventListener('click', () => wintuxGPUBooster.setMode("NORMAL"));

    // Автозагрузка и автосохранение твоих личных Wintux Quick Notes
    const quickNotesArea = document.getElementById('quickNotesText');
    if (quickNotesArea) {
        quickNotesArea.value = localStorage.getItem('wintux_quick_notes_data') || "";
        quickNotesArea.addEventListener('input', () => {
            localStorage.setItem('wintux_quick_notes_data', quickNotesArea.value);
        });
    }

    const startPowerBtn = document.getElementById('start-power-btn');
    const logoutDlg = document.getElementById('mint-logout-dialog');
    const startMenu = document.getElementById('start-menu');

    if (startPowerBtn && logoutDlg) {
        startPowerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (startMenu) startMenu.classList.remove('open');
            logoutDlg.style.display = 'flex';
        });
    }

    const dlgCancel = document.getElementById('dlg-btn-cancel');
    if (dlgCancel && logoutDlg) dlgCancel.addEventListener('click', () => logoutDlg.style.display = 'none');

    const dlgLock = document.getElementById('dlg-btn-lock');
    if (dlgLock && logoutDlg) {
        dlgLock.addEventListener('click', () => {
            logoutDlg.style.display = 'none';
            checkSystemAuth();
        });
    }

    const dlgReboot = document.getElementById('dlg-btn-reboot');
    if (dlgReboot) {
        dlgReboot.addEventListener('click', () => {
            if (logoutDlg) logoutDlg.style.display = 'none';
            triggerSystemBoot();
        });
    }

    const dlgShutdown = document.getElementById('dlg-btn-shutdown');
    if (dlgShutdown) dlgShutdown.addEventListener('click', triggerSystemShutdown);

    // Привязка ярлыков, панели задач и меню Пуск Wintux
    const shortcuts = {
        'shortcut-explorer': 'explorer', 'shortcut-terminal': 'terminal',
        'shortcut-notepad': 'notepad', 'shortcut-booster': 'booster-window',
        'shortcut-quick-notes': 'quick-notes-window', 'shortcut-cs': 'cs',
        'shortcut-calc': 'calc', 'shortcut-trash': 'trash-window',
        'taskbar-explorer': 'explorer', 'taskbar-terminal': 'terminal',
        'taskbar-notepad': 'notepad', 'taskbar-booster': 'booster-window',
        'taskbar-quick-notes': 'quick-notes-window', 'taskbar-cs': 'cs',
        'taskbar-calc': 'calc', 'start-app-explorer': 'explorer',
        'start-app-terminal': 'terminal', 'start-app-notepad': 'notepad',
        'start-app-cs': 'cs', 'start-app-calc': 'calc'
    };
    
    for (let id in shortcuts) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openWindow(shortcuts[id]));
    }
    const csShortcut = document.getElementById('shortcut-cs');
    if (csShortcut) {
        csShortcut.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const helper = document.getElementById('cs-mobile-touch-helper');
                if (helper) helper.style.display = 'block';
                const csWin = document.getElementById('cs');
                if (csWin) csWin.classList.add('maximized');
            }
        });
    }

    const startBtn = document.getElementById('start-menu-btn');
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('open'); });
        document.addEventListener('click', () => startMenu.classList.remove('open'));
    }

    ['explorer', 'notepad', 'terminal', 'cs', 'web-viewer', 'calc', 'trash-window', 'booster-window', 'quick-notes-window'].forEach(id => {
        const closeBtn = document.getElementById('close-' + id);
        if (closeBtn) closeBtn.addEventListener('click', () => closeWindow(id));
    });

    document.querySelectorAll('.max-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleMaximize(e.target.getAttribute('data-window')));
    });

    const clockBtn = document.getElementById('system-clock');
    const settingsPanel = document.getElementById('quick-settings');
    if (clockBtn && settingsPanel) {
        clockBtn.addEventListener('click', (e) => { e.stopPropagation(); settingsPanel.classList.toggle('open'); });
        document.addEventListener('click', () => settingsPanel.classList.remove('open'));
        settingsPanel.addEventListener('click', (e) => e.stopPropagation());
    }

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bgType = e.target.getAttribute('data-bg');
            if (bgType === 'mint') document.body.style.background = 'radial-gradient(circle at 50% 30%, #2b3a22 0%, #141910 60%, #080a06 100%)';
            if (bgType === 'dark') document.body.style.background = 'radial-gradient(circle at 50% 30%, #14161d 0%, #0b0c10 60%, #020203 100%)';
            if (bgType === 'win11') document.body.style.background = 'radial-gradient(circle at 50% 30%, #1e4570 0%, #0a1836 60%, #020714 100%)';
            alert(`Системные обои переключены на режим: ${e.target.innerText}`);
        });
    });

    const saveNoteBtn = document.getElementById('btn-save-note');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
            const text = document.getElementById('notepadText').value;
            let filename = openedFileName || prompt('Введите имя файла (например: index.html):', 'index.html');
            if (filename) {
                FSCore.createFile('documents', filename, text);
                alert(`Файл "${filename}" успешно записан.`);
                closeWindow('notepad');
                renderExplorer(currentFolder);
            }
        });
    }

    const runCodeBtn = document.getElementById('btn-run-code');
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', () => {
            const code = document.getElementById('notepadText').value;
            const viewerFrame = document.getElementById('webViewerFrame');
            if (viewerFrame) { viewerFrame.srcdoc = code; openWindow('web-viewer'); }
        });
    }

    const emptyTrashBtn = document.getElementById('btn-empty-trash');
    if (emptyTrashBtn) {
        emptyTrashBtn.addEventListener('click', () => {
            if (trashContainer.length === 0) return;
            if (confirm("Вы уверены, что хотите очистить Корзину?")) {
                trashContainer = []; renderTrashView(); alert("Корзина очищена.");
            }
        });
    }

    const termInput = document.getElementById('terminal-input');
    const termHistory = document.getElementById('terminal-history');
    const clickZone = document.getElementById('terminal-click-zone');
    if (clickZone && termInput) clickZone.addEventListener('click', () => termInput.focus());

    if (termInput && termHistory) {
        termInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = termInput.value; termInput.value = '';
                const userLine = document.createElement('div');
                userLine.innerHTML = `<span style="color:#87cf3e;font-weight:bold;">user@wintux_pc:~$</span> ${rawCmd}`;
                termHistory.appendChild(userLine);
                const output = bashSimulator.execute(rawCmd);
                if (output && output !== 'clear_screen') {
                    const responseLine = document.createElement('div');
                    responseLine.style.whiteSpace = 'pre-wrap';
                    let formatted = output.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('[GREEN]', '<span style="color:#87cf3e;">').replaceAll('[RESET]', '</span>');
                    responseLine.innerHTML = formatted; termHistory.appendChild(responseLine);
                }
                termHistory.scrollTop = termHistory.scrollHeight;
            }
        });
    }

    const createFolderBtn = document.getElementById('btn-create-folder');
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', () => {
            const name = prompt('Имя новой папки:');
            if (name) { FSCore.createFolder(currentFolder, name); renderExplorer(currentFolder); }
        });
    }

    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', (e) => renderExplorer(e.target.getAttribute('data-folder')));
    });

    ['explorer', 'notepad', 'terminal', 'cs', 'web-viewer', 'calc', 'trash-window', 'booster-window', 'quick-notes-window'].forEach(id => {
        initDrag('header-' + id, id);
        const winEl = document.getElementById(id);
        if (winEl) winEl.addEventListener('pointerdown', function() { focusWindow(this); });
    });

    startSystemClock();
    initBatteryStatus();
    renderExplorer('root');
    renderTrashView();
});
