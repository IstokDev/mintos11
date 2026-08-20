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
