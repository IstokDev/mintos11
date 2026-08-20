let currentFolder = 'root';
let openedFileName = null;

// Локальная база данных сайтов для имитации интернета (Полный обход CSP и CORS блокировок через srcdoc)
const localWebDatabase = {
    search(query) {
        const q = query.toLowerCase();
        let results = [];
        if (q.includes('гугл') || q.includes('google')) {
            results.push({ title: 'Google Поиск Proxy', desc: 'Добро пожаловать в крупнейшую поисковую систему интернета.', action: 'google' });
        }
        if (q.includes('вики') || q.includes('wiki') || q.includes('wikipedia')) {
            results.push({ title: 'Википедия — Свободная энциклопедия', desc: 'Миллионы статей на любые темы, создаваемые пользователями.', action: 'wiki' });
        }
        if (q.includes('новост') || q.includes('news')) {
            results.push({ title: 'Служба новостей PutterOS', desc: 'Главные события: Наша игровая веб-система переведена в ультра-автономный режим!', action: 'news' });
        }
        if (q.includes('вк') || q.includes('vk') || q.includes('vkontakte')) {
            results.push({ title: 'ВКонтакте (Локальный прокси-клиент)', desc: 'Общайтесь с друзьями, делитесь фотографиями и смотрите видео.', action: 'vk' });
        }
        if (q.includes('ютуб') || q.includes('youtube') || q.includes('видео') || q.includes('video')) {
            results.push({ title: 'YouTube Видео-Хаб', desc: 'Смотрите любимые видеоролики и стримы прямо внутри окна эмулятора без лагов и блокировок фреймов.', action: 'youtube' });
        }
        if (results.length === 0) {
            results.push({ title: `Результаты безопасного поиска для: "${query}"`, desc: 'Оффлайн-прокси успешно обработал запрос. Для тестирования попробуйте ввести в поиск: гугл, новости, вики или ютуб.', action: 'generic' });
        }
        return results;
    },
    getPage(action) {
        if (action === 'google') {
            return `<div style="text-align:center;padding:35px;background:#fff;height:100vh;color:#000;font-family:sans-serif;"><h1 style="font-size:42px;margin:0;"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></h1><input type="text" style="width:85%;padding:12px 15px;border:1px solid #dfe1e5;border-radius:24px;margin-top:20px;outline:none;box-shadow:0 1px 6px rgba(32,33,36,0.28);" value="Поиск проксирован через верхнюю панель Edge!"><br><button style="margin-top:20px;padding:10px 20px;background:#f8f9fa;border:1px solid #f8f9fa;border-radius:4px;cursor:pointer;color:#3c4043;font-weight:bold;">Поиск в сети Proxy</button></div>`;
        }
        if (action === 'wiki') {
            return `<div style="padding:20px;background:#fff;height:100vh;color:#000;font-family:sans-serif;"><h2>🌐 Википедия — PutterOS Edition</h2><p style="margin-top:12px;line-height:1.6;font-size:14px;"><b>Википедия</b> работает внутри эмулятора через изолированные текстовые ноды. Это гарантирует защиту вашего смартфона или ПК от CORS-блокировок и ошибок frame-ancestors на 100%.</p></div>`;
        }
        if (action === 'news') {
            return `<div style="padding:20px;background:#fff;height:100vh;color:#000;font-family:sans-serif;"><h2>📰 Вестник PutterOS</h2><p style="margin-top:12px;line-height:1.6;font-size:14px;"><b>Важное обновление:</b> Мы полностью пересобрали систему под игровой Путтер! Убрали все ломающиеся внешние магазины и зависимости. Теперь игры запускаются в один клик с рабочего стола, а браузер поддерживает просмотр видео.</p></div>`;
        }
        if (action === 'vk') {
            return `<div style="background:#0077FF;color:white;padding:25px;height:100vh;font-family:sans-serif;"><h2>ВКонтакте для WebOS</h2><p style="margin-top:10px;font-size:14px;">Локальный прокси-профиль администратора успешно загружен. Сетевые блокировки безопасности Cross-Origin полностью обойдены.</p></div>`;
        }
        if (action === 'youtube') {
            return `<div style="padding:15px;background:#181818;height:100vh;color:white;font-family:sans-serif;text-align:center;">
                <h2 style="color:#FF0000;margin-bottom:15px;">📺 YouTube Видео-Плеер</h2>
                <p style="font-size:13px;color:#aaa;margin-bottom:15px;">Видео воспроизводится через встроенный прокси-декодер</p>
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5);">
                    <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" src="https://youtube.com" allowfullscreen></iframe>
                </div>
            </div>`;
        }
        return `<div style="padding:20px;background:#fff;height:100vh;color:#000;font-family:sans-serif;"><h2>🌐 Оффлайн страница Прокси</h2><p style="margin-top:10px;font-size:14px;">Вы перешли на тестовую текстовую страницу эмулятора. Контент успешно обработан внутренним движком рендеринга.</p></div>`;
    }
};
// Функция оффлайн-браузера, объявленная в самом верху (исправляет ReferenceError)
function processSearch() {
    let input = document.getElementById('urlInput').value.trim();
    const frame = document.getElementById('browserFrame');
    if (!input || !frame) return;

    const results = localWebDatabase.search(input);
    let resultsHTML = `<div style="padding:20px;font-family:sans-serif;background:#fff;height:100%;overflow-y:auto;color:#000;"><h3>Результаты оффлайн-поиска PutterOS:</h3><div style="display:flex;flex-direction:column;gap:16px;margin-top:15px;">`;
    
    results.forEach((res, index) => {
        resultsHTML += `<div style="cursor:pointer;" id="search-link-${index}"><h4 style="color:#1a0dab;margin:0;font-size:16px;">${res.title}</h4><p style="color:#4d5156;margin:4px 0 0 0;font-size:13px;">${res.desc}</p></div>`;
    });
    resultsHTML += `</div></div>`;

    frame.srcdoc = resultsHTML;

    frame.onload = () => {
        const frameDoc = frame.contentDocument || frame.contentWindow.document;
        results.forEach((res, index) => {
            const link = frameDoc.getElementById(`search-link-${index}`);
            if (link) {
                link.addEventListener('click', () => {
                    frameDoc.body.innerHTML = localWebDatabase.getPage(res.action);
                });
            }
        });
    };
}

// Локальный терминальный движок (bash)
const bashSimulator = {
    execute(commandStr) {
        const trimmed = commandStr.trim();
        if (!trimmed) return '';
        
        const args = trimmed.split(' ');
        const cmd = args[0].toLowerCase();
        const param = args.length > 1 ? args.slice(1).join(' ') : '';
        
        switch(cmd) {
            case 'clear':
                document.getElementById('terminal-history').innerHTML = '';
                return 'clear_screen';
                
            case 'help':
                return `Доступные команды PutterOS:\n` +
                       `  neofetch    - Вывести характеристики игрового Путтера\n` +
                       `  ls          - Показать файлы в текущей папке\n` +
                       `  mkdir [имя] - Создать новую директорию\n` +
                       `  rm [имя]    - Переместить файл в Корзину\n` +
                       `  clear       - Очистить экран терминала\n` +
                       `  help        - Вывести эту справку`;
                       
            case 'neofetch':
                return `[GREEN]          eeeeeeeeeeeeeeeee[RESET]    user@putter_pc\n` +
                       `[GREEN]      eeeeeeeeeeeeeeeeeeeeeee[RESET]  -------------\n` +
                       `[GREEN]    eeeee[RESET]  eeeeeeeeee  [GREEN]fffff[RESET]   OS: PutterOS v2.0 (Gaming & Dev Edition)\n` +
                       `[GREEN]   eeee[RESET]  eeeeeeeeeeeee  [GREEN]fffff[RESET]  Kernel: WebOS Performance Engine 2026\n` +
                       `[GREEN]  eeee[RESET]  eeeeeeeeeeeeeee  [GREEN]ffff[RESET]  Uptime: 10 mins\n` +
                       `[GREEN]  eee[RESET]  eeeeeeeeeeeeeeee  [GREEN]ffff[RESET]  Shell: bash simulator v1.5\n` +
                       `[GREEN]  eee[RESET]  eeeeeeeeeeeeeeee  [GREEN]ffff[RESET]  Resolution: ${window.innerWidth}x${window.innerHeight}\n` +
                       `[GREEN]  eeee[RESET]  eeeeeeeeeeeeeee  [GREEN]ffff[RESET]  DE: Cinnamon-Mica Ultra\n` +
                       `[GREEN]   eeee[RESET]  eeeeeeeeeeeee  [GREEN]ffff[RESET]   WM: PutterWindowManager\n` +
                       `[GREEN]    eeeee[RESET]  eeeeeeeeee  [GREEN]fffff[RESET]   Terminal: putter-terminal-js\n` +
                       `[GREEN]      eeeeeeeeeeeeeeeeeeeeeee[RESET]  Memory: 1.2GB / 16GB (Ultra Performance)`;
                       
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
// Хранилище Системной корзины в оперативной памяти (дублируется в localStorage)
let trashContainer = [];

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
        
        // Рендерим иконку файла и скрытую кнопку удаления
        item.innerHTML = `<div style="font-size:32px;">${icon}</div><p>${file.name}</p>` +
                         `${file.type === 'file' ? `<button class="file-delete-btn" title="Удалить">✕</button>` : ''}`;
        
        // Навешиваем событие удаления на крестик
        if (file.type === 'file') {
            const delBtn = item.querySelector('.file-delete-btn');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Чтобы не открывался сам блокнот
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
                    runBtn.style.display = 'inline';
                } else {
                    runBtn.style.display = 'none';
                }
                openWindow('notepad');
            });
        }
        view.appendChild(item);
    });
}

// Логика перемещения файлов в Корзину (Фича 2)
function moveToTrash(filename) {
    const fileList = FSCore.getFiles(currentFolder);
    const targetFile = fileList.find(f => f.name === filename);
    if (!targetFile) return;

    // Добавляем в массив корзины и удаляем из текущей папки
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
        
        // Восстановление файла обратно в его родную папку
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

// ЛОГИКА КАЛЬКУЛЯТОРA MINT CALC
let calcExpression = "";

function pressCalc(val) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    
    if (display.value === "0" && !isNaN(val)) {
        calcExpression = val;
    } else {
        calcExpression += val;
    }
    display.value = calcExpression;
}

function clearCalc() {
    calcExpression = "";
    const display = document.getElementById('calc-display');
    if (display) display.value = "0";
}

function calculateResult() {
    const display = document.getElementById('calc-display');
    if (!display || !calcExpression) return;
    
    try {
        // Безопасное математическое вычисление встроенным интерпретатором JS
        const result = Function('"use strict";return (' + calcExpression + ')')();
        display.value = result;
        calcExpression = result.toString();
    } catch (e) {
        display.value = "Ошибка";
        calcExpression = "";
    }
}
// Функция запуска живых системных часов в трее Cinnamon
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

// Получение реального заряда батареи смартфона/ПК через Battery API (Фича 1)
function initBatteryStatus() {
    const batEl = document.getElementById('battery-status');
    if (!batEl) return;

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateAllBatteryInfo() {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging ? " (Заряжается ⚡)" : "";
                batEl.innerText = `🔋 Батарея: ${level}%${charging}`;
            }
            updateAllBatteryInfo();
            battery.addEventListener('levelchange', updateAllBatteryInfo);
            battery.addEventListener('chargingchange', updateAllBatteryInfo);
        });
    } else {
        batEl.innerText = "🔋 Батарея: 100% (API не подд.)";
    }
}

// Безопасный запуск всех обработчиков интерфейса
document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация системных служб времени и питания
    startSystemClock();
    initBatteryStatus();

    // 2. Безопасная привязка ярлыков Рабочего стола
    const shortcuts = {
        'shortcut-explorer': 'explorer',
        'shortcut-terminal': 'terminal',
        'shortcut-browser': 'browser',
        'shortcut-calc': 'calc',
        'shortcut-trash': 'trash-window',
        'shortcut-cs': 'cs',
        'shortcut-mc': 'app-mc'
    };
    for (let id in shortcuts) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openWindow(shortcuts[id]));
    }
    
    const shortcutNotepad = document.getElementById('shortcut-notepad');
    if (shortcutNotepad) {
        shortcutNotepad.addEventListener('click', () => {
            openedFileName = null;
            document.getElementById('notepadText').value = "";
            document.getElementById('notepad-title').innerText = "📝 Xed — Новый файл";
            document.getElementById('btn-run-code').style.display = 'none';
            openWindow('notepad');
        });
    }

    // 3. Безопасная привязка элементов Панели задач Cinnamon
    const taskbarIcons = {
        'taskbar-explorer': 'explorer',
        'taskbar-terminal': 'terminal',
        'taskbar-browser': 'browser',
        'taskbar-calc': 'calc',
        'taskbar-cs': 'cs'
    };
    for (let id in taskbarIcons) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openWindow(taskbarIcons[id]));
    }

    const taskbarNotepad = document.getElementById('taskbar-notepad');
    if (taskbarNotepad) taskbarNotepad.addEventListener('click', () => openWindow('notepad'));
    // 4. Логика работы гибридного Меню Пуск
    const startBtn = document.getElementById('start-menu-btn');
    const startMenu = document.getElementById('start-menu');
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('open'); });
        document.addEventListener('click', () => startMenu.classList.remove('open'));
        startMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    // Запуск приложений внутри Меню Пуск
    const startApps = {
        'start-app-explorer': 'explorer',
        'start-app-terminal': 'terminal',
        'start-app-browser': 'browser',
        'start-app-calc': 'calc',
        'start-app-cs': 'cs',
        'start-app-notepad': 'notepad'
    };
    for (let id in startApps) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openWindow(startApps[id]));
    }

    // 5. Управление окнами (Закрытие и Максимизация)
    ['explorer', 'notepad', 'terminal', 'browser', 'cs', 'app-mc', 'web-viewer', 'calc', 'trash-window'].forEach(id => {
        const closeBtn = document.getElementById('close-' + id);
        if (closeBtn) closeBtn.addEventListener('click', () => closeWindow(id));
    });

    document.querySelectorAll('.max-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleMaximize(e.target.getAttribute('data-window')));
    });

    // 6. Логика Шторки уведомлений и переключателя CSS-обоев
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

    // 7. Функции Текстового редактора Xed и компилятора HTML
    const saveNoteBtn = document.getElementById('btn-save-note');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
            const text = document.getElementById('notepadText').value;
            let filename = openedFileName || prompt('Введите имя файла с кастомным расширением (например: index.html, script.js, text.txt):', 'index.html');
            if (filename) {
                FSCore.createFile('documents', filename, text);
                alert(`Файл "${filename}" успешно записан в память ядра.`);
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

    // 8. Системная очистка Корзины
    const emptyTrashBtn = document.getElementById('btn-empty-trash');
    if (emptyTrashBtn) {
        emptyTrashBtn.addEventListener('click', () => {
            if (trashContainer.length === 0) return;
            if (confirm("Вы уверены, что хотите навсегда стереть файлы из Корзины?")) {
                trashContainer = []; renderTrashView(); alert("Корзина полностью очищена.");
            }
        });
    }

    // 9. Интерактивная обработка ввода в Терминале Linux
    const termInput = document.getElementById('terminal-input');
    const termHistory = document.getElementById('terminal-history');
    const clickZone = document.getElementById('terminal-click-zone');
    if (clickZone && termInput) clickZone.addEventListener('click', () => termInput.focus());

    if (termInput && termHistory) {
        termInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = termInput.value; termInput.value = '';
                const userLine = document.createElement('div');
                userLine.innerHTML = `<span style="color:#87cf3e;font-weight:bold;">user@putter_pc:~$</span> ${rawCmd}`;
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

    // 10. Поисковая строка Браузера и создание папок в Nemo
    const btnNavigate = document.getElementById('btnNavigate');
    const urlInput = document.getElementById('urlInput');
    if (btnNavigate) btnNavigate.addEventListener('click', processSearch);
    if (urlInput) urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processSearch(); });

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

    // 11. Активация драг-менеджера и фокуса для всех окон MintOS
    ['explorer', 'notepad', 'terminal', 'browser', 'cs', 'app-mc', 'web-viewer', 'calc', 'trash-window'].forEach(id => {
        initDrag('header-' + id, id);
        const winEl = document.getElementById(id);
        if (winEl) winEl.addEventListener('pointerdown', function() { focusWindow(this); });
    });

    // Запуск первичного рендеринга диска при старте ядра
    renderExplorer('root');
    renderTrashView();
});
