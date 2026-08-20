let currentFolder = 'root';
let openedFileName = null;
let calcExpression = "";

// 1. СЛУЖБА КВАНТОВЫХ ЧАСОВ И СИНХРОНИЗАЦИИ ВРЕМЕНИ СЕКУНДА В СЕКУНДУ
function initWindowsClock() {
    const lockTime = document.getElementById('lock-time');
    const lockDate = document.getElementById('lock-date');
    const trayTime = document.getElementById('tray-time');
    const trayDate = document.getElementById('tray-date');
    
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const trayTimeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const lockDateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
        const trayDateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        if (lockTime) lockTime.innerText = timeStr;
        if (lockDate) lockDate.innerText = lockDateStr.charAt(0).toUpperCase() + lockDateStr.slice(1);
        if (trayTime) trayTime.innerText = trayTimeStr;
        if (trayDate) trayDate.innerText = trayDateStr;
    }, 1000);
}

// 2. ДИСПЕТЧЕР ОПРОСА ЗАРЯДА БАТАРЕИ GALAXY & LAPTOP
function initWindowsBattery() {
    const batteryEl = document.getElementById('tray-battery');
    if (!batteryEl) return;
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateInfo() {
                const level = Math.round(battery.level * 100);
                batteryEl.innerText = `🔋 ${level}%${battery.charging ? " ⚡" : ""}`;
            }
            updateInfo();
            battery.addEventListener('levelchange', updateInfo);
            battery.addEventListener('chargingchange', updateInfo);
        });
    } else {
        batteryEl.innerText = "🔌 100%";
    }
}

// 3. УНИКАЛЬНЫЙ СЦЕНАРИЙ ЗАГРУЗКИ QUANTUM BOOT (БЕЗ КОПИРОВАНИЯ BIOS И WINDOWS)
function runWindowsBootSequence() {
    const bootScreen = document.getElementById('aura-boot-screen');
    const statusText = document.getElementById('aura-boot-status');
    const welcomeScreen = document.getElementById('aura-welcome-screen');
    const startupSound = document.getElementById('aura-startup-sound');

    if (!bootScreen) return;

    // Логи загрузки твоих игровых ядер AuraOS
    let bootStages = [
        "Loading Aura_Core Framework v5.0...",
        "Initializing Glassmorphic Render Engine... OK",
        "Mounting Aura_Disk storage (V:)... OK",
        "Preloading Counter-Strike 1.6 secure node...",
        "AuraOS Core fully loaded. Ready for auth."
    ];

    let currentStage = 0;
    const bootInterval = setInterval(() => {
        if (currentStage < bootStages.length) {
            if (statusText) statusText.innerText = bootStages[currentStage];
            currentStage++;
        } else {
            clearInterval(bootInterval);
            bootScreen.style.display = 'none';
            if (welcomeScreen) welcomeScreen.style.display = 'flex';
            if (startupSound) {
                startupSound.play().catch(() => console.log("Аудиосистемы ждут первого клика пользователя"));
            }
        }
    }, 900);
}
// 4. ФИРМЕННЫЙ КИБЕР-ПРОЦЕССОР AURA TERMINAL
const cmdSimulator = {
    execute(commandStr) {
        const trimmed = commandStr.trim();
        if (!trimmed) return '';
        const args = trimmed.split(' ');
        const cmd = args[0].toLowerCase();
        const param = args.length > 1 ? args.slice(1).join(' ') : '';
        
        switch(cmd) {
            case 'clear':
                const historyEl = document.getElementById('cmd-history');
                if (historyEl) historyEl.innerHTML = '';
                return 'cls_active';
                
            case 'help':
                return `Доступные кибер-команды AuraOS Core:\n` +
                       `  info        - Показать спецификации независимого ядра\n` +
                       `  matrix      - Активировать протокол цифрового дождя\n` +
                       `  dir         - Вывести структуру каталогов накопителя V:\n` +
                       `  mkdir [имя] - Выделить сектор под новую папку\n` +
                       `  clear       - Полностью очистить терминал`;
                       
            case 'info':
                return `👨‍💻 OS Name: AuraOS Next-Gen Web\n` +
                       `🛸 Core Node: Aura_Core_Engine v5.0\n` +
                       `🔋 Environment: Ноутбук & Смартфон Galaxy A14 OK\n` +
                       `⚡ Status: Работает на независимых веб-модулях`;
                       
            case 'matrix':
                setTimeout(() => {
                    const history = document.getElementById('cmd-history');
                    if (history) {
                        let lines = 0;
                        const matInterval = setInterval(() => {
                            const line = document.createElement('div');
                            line.style.color = '#00ffcc';
                            line.style.fontSize = '12px';
                            let code = "";
                            for(let i=0; i<40; i++) code += Math.random() > 0.5 ? "1" : "0";
                            line.innerText = code;
                            history.appendChild(line);
                            history.scrollTop = history.scrollHeight;
                            lines++;
                            if (lines > 30) clearInterval(matInterval);
                        }, 50);
                    }
                }, 100);
                return `[PROTOCOL]: Запуск цифрового дождя Matrix...`;
                
            case 'dir':
                if (typeof FSCore !== 'undefined' && FSCore.getFiles) {
                    const files = FSCore.getFiles(currentFolder);
                    if (files.length === 0) return 'Директория накопителя V: пуста.';
                    return files.map(f => f.type === 'folder' ? `[DIR]     ${f.name}` : `[FILE]    ${f.name}`).join('\n');
                }
                return 'Ошибка: накопитель V: не подключен.';
                
            case 'mkdir':
                if (!param) return 'Синтаксис: mkdir [имя_сектора]';
                if (typeof FSCore !== 'undefined' && FSCore.createFolder) {
                    FSCore.createFolder(currentFolder, param);
                    renderExplorerView(currentFolder);
                    return `Сектор "${param}" успешно создан на V:.`;
                }
                return 'Ошибка записи I/O.';
                
            default:
                return `AuraOS://core_shell: "${cmd}" — неизведанная команда. Наберите "help".`;
        }
    }
};

// 5. ОТРИСОВКА СЕТКИ ФАЙЛОВ НАКОПИТЕЛЯ V:
function renderExplorerView(folderKey) {
    currentFolder = folderKey;
    const view = document.getElementById('explorer-file-view');
    const driveC = document.getElementById('explorer-drive-c');
    const btnBack = document.getElementById('explorer-btn-root');
    if (!view) return;
    
    view.innerHTML = '';
    if (folderKey === 'root') {
        if (driveC) driveC.style.display = 'flex';
        if (btnBack) btnBack.style.display = 'none';
        view.style.display = 'none';
        return;
    }
    
    if (driveC) driveC.style.display = 'none';
    if (btnBack) btnBack.style.display = 'inline-block';
    view.style.display = 'flex';

    if (typeof FSCore !== 'undefined' && FSCore.getFiles) {
        FSCore.getFiles(folderKey).forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-grid-item';
            item.innerHTML = `<div style="font-size:24px;">🗒️</div><div>${file.name}</div>`;
            item.addEventListener('click', () => {
                openedFileName = file.name;
                const txtArea = document.getElementById('notepad-textarea');
                const nTitle = document.getElementById('notepad-window-title');
                if (txtArea) txtArea.value = file.content || "";
                if (nTitle) nTitle.innerText = `${file.name} — Редактор скриптов`;
                openWindow('win-window-notepad');
            });
            view.appendChild(item);
        });
    }
}
// 6. НЕУБИВАЕМЫЙ ПОТОКОВЫЙ ДВИЖОК ОКОН NEBULA GLASS
function openWindow(id) {
    const win = document.getElementById(id);
    if (win) { win.style.display = 'flex'; focusWindow(win); }
    const tIconId = id.replace('win-window-', 'taskbar-');
    const tIcon = document.getElementById(tIconId);
    if (tIcon) tIcon.classList.add('active');
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
    const tIconId = id.replace('win-window-', 'taskbar-');
    const tIcon = document.getElementById(tIconId);
    if (tIcon) tIcon.classList.remove('active');
}

function focusWindow(win) {
    document.querySelectorAll('.metro-window').forEach(w => w.style.zIndex = '10');
    win.style.zIndex = '100';
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (win) win.classList.toggle('maximized');
}

// 7. СЛУЖБА ПЕРЕТАСКИВАНИЯ ОКОН (POINTER DRAG ENGINE — МЫШЬ И ТАЧ GALAXY А14)
function initWindowDrag(headerId, winId) {
    const header = document.getElementById(headerId);
    const win = document.getElementById(winId);
    if (!header || !win) return;

    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    header.addEventListener('touchstart', dragStart, { passive: true });

    function dragStart(e) {
        if (win.classList.contains('maximized')) return;
        focusWindow(win);
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === header || header.contains(e.target)) { isDragging = true; }
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function drag(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
        win.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px)`;
    }

    function dragEnd() { isDragging = false; }
}

function changeDesktopWallpaper(imgSrc) {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;
    desktop.style.backgroundImage = `url('${imgSrc}')`;
    localStorage.setItem('aura_wallpaper', imgSrc);
}
// 8. ГЛОБАЛЬНЫЙ СТАРТ ВСЕЙ СРЕДЫ DOM INTERFACE
document.addEventListener('DOMContentLoaded', () => {
    runWindowsBootSequence();
    initWindowsClock();
    initWindowsBattery();

    // Авторизация Aura ID в один клик
    const btnAuraLogin = document.getElementById('btn-aura-login');
    const welcomeScreen = document.getElementById('aura-welcome-screen');
    if (btnAuraLogin && welcomeScreen) {
        btnAuraLogin.addEventListener('click', () => {
            welcomeScreen.style.transform = 'scale(1.2)';
            welcomeScreen.style.opacity = '0';
            setTimeout(() => welcomeScreen.style.display = 'none', 300);
        });
    }

    // Панель Aura Grid (системное меню старта)
    const startBtn = document.getElementById('win-start-btn');
    const startMenu = document.getElementById('aura-start-menu');
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.style.bottom = startMenu.style.bottom === '44px' ? '-550px' : '44px';
        });
        document.addEventListener('click', () => { if (startMenu) startMenu.style.bottom = '-550px'; });
    }

    const btnAuraShutdown = document.getElementById('btn-aura-shutdown');
    if (btnAuraShutdown) btnAuraShutdown.addEventListener('click', () => { if(confirm("Выключить ядро AuraOS?")) location.reload(); });

    // Поиск Edge в Aura Web через DuckDuckGo без CORS-блоков
    const btnBrowserGo = document.getElementById('browser-go-btn');
    const inputBrowserUrl = document.getElementById('browser-url-input');
    const frameBrowser = document.getElementById('browser-frame-core');
    if (btnBrowserGo && inputBrowserUrl && frameBrowser) {
        btnBrowserGo.addEventListener('click', () => {
            let url = inputBrowserUrl.value.trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://duckduckgo.com' + encodeURIComponent(url);
            } else if (url.includes('duckduckgo.com') && !url.includes('html=1')) {
                url += '&html=1';
            }
            frameBrowser.src = url;
            inputBrowserUrl.value = url;
        });
    }

    // Тюнинг обоев пространства Canvas
    document.querySelectorAll('.wp-select-img').forEach(img => {
        img.addEventListener('click', (e) => {
            document.querySelectorAll('.wp-select-img').forEach(i => i.style.borderColor = 'transparent');
            e.target.style.borderColor = '#a347ff';
            changeDesktopWallpaper(e.target.src);
        });
    });

    const btnWpApply = document.getElementById('btn-wp-apply');
    if (btnWpApply) {
        btnWpApply.addEventListener('click', () => {
            const url = document.getElementById('wp-custom-url').value.trim();
            if (url) { changeDesktopWallpaper(url); alert("Пространство Canvas перенастроено!"); }
        });
    }

    // Мапинг ярлыков и чистой панели задач без подписей
    const winApps = {
        'shortcut-pc': 'win-window-pc', 'taskbar-pc': 'win-window-pc', 'start-app-pc': 'win-window-pc',
        'shortcut-cmd': 'win-window-cmd', 'taskbar-cmd': 'win-window-cmd', 'start-app-cmd': 'win-window-cmd',
        'shortcut-browser': 'win-window-browser', 'taskbar-browser': 'win-window-browser', 'start-app-browser': 'win-window-browser',
        'shortcut-cs': 'win-window-cs', 'taskbar-cs': 'win-window-cs', 'start-app-cs': 'win-window-cs',
        'shortcut-wallpaper': 'win-window-wallpaper', 'start-app-wallpaper': 'win-window-wallpaper'
    };
    for (let id in winApps) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => { openWindow(winApps[id]); });
    }

    // Автоматический мобильный тач-пад CS 1.6 под Samsung Galaxy A14 твоего друга
    const csShortcut = document.getElementById('shortcut-cs');
    if (csShortcut) {
        csShortcut.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const helper = document.getElementById('cs-touch-helper');
                if (helper) helper.style.display = 'block';
                const csWin = document.getElementById('win-window-cs');
                if (csWin) csWin.classList.add('maximized');
            }
        });
    }

    ['pc', 'cmd', 'cs', 'browser', 'wallpaper'].forEach(id => {
        const closeBtn = document.getElementById('close-' + id);
        if (closeBtn) closeBtn.addEventListener('click', () => closeWindow('win-window-' + id));
    });
    document.querySelectorAll('.max-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleMaximize(e.target.getAttribute('data-window')));
    });

    const btnDriveC = document.getElementById('explorer-drive-c');
    if (btnDriveC) btnDriveC.addEventListener('click', () => renderExplorerView('documents'));
    const btnRoot = document.getElementById('explorer-btn-root');
    if (btnRoot) btnRoot.addEventListener('click', () => renderExplorerView('root'));

    // Поля ввода терминала и обработка фокуса
    const cmdInput = document.getElementById('cmd-input');
    const cmdHistory = document.getElementById('cmd-history');
    const cmdClickZone = document.getElementById('win-window-cmd');
    if (cmdClickZone && cmdInput) cmdClickZone.addEventListener('click', () => cmdInput.focus());

    if (cmdInput && cmdHistory) {
        cmdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = cmdInput.value; cmdInput.value = '';
                const line = document.createElement('div'); line.innerHTML = `<span style="color:#a347ff;">aura_node_admin@core:~#</span> ${rawCmd}`;
                cmdHistory.appendChild(line);
                const out = cmdSimulator.execute(rawCmd);
                if (out && out !== 'cls_active') {
                    const res = document.createElement('div'); res.style.whiteSpace = 'pre-wrap';
                    res.innerHTML = out.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
                    cmdHistory.appendChild(res);
                }
                cmdHistory.scrollTop = cmdHistory.scrollHeight;
            }
        });
    }

    // Связывание Drag-событий Pointer на заголовки окон AuraOS
    ['pc', 'cmd', 'cs', 'browser', 'wallpaper'].forEach(id => {
        initWindowDrag('header-' + id, 'win-window-' + id);
        const winEl = document.getElementById('win-window-' + id);
        if (winEl) winEl.addEventListener('pointerdown', function() { focusWindow(this); });
    });

    const savedWp = localStorage.getItem('aura_wallpaper');
    if (savedWp) changeDesktopWallpaper(savedWp);

    renderExplorerView('root');
});
