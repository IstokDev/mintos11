const FSCore = {
    storageKey: 'mintos_fs_data',
    // Инициализация оригинальной структуры директорий /home/user
    defaultFS: {
        root: [
            { name: 'Документы', type: 'folder', target: 'documents' },
            { name: 'Изображения', type: 'folder', target: 'images' },
            { name: 'Видео', type: 'folder', target: 'videos' },
            { name: 'Музыка', type: 'folder', target: 'music' },
            { name: 'Загрузки', type: 'folder', target: 'downloads' }
        ],
        documents: [], // Системные папки изначально пустые
        images: [],
        videos: [],
        music: [],
        downloads: []
    },
    data: {},
    init() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try { this.data = JSON.parse(saved); } catch(e) { this.data = this.defaultFS; }
        } else {
            this.data = this.defaultFS;
            this.save();
        }
    },
    save() { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); },
    getFiles(folder) { return this.data[folder] || []; },
    createFolder(parentFolder, name) {
        if (!this.data[parentFolder]) this.data[parentFolder] = [];
        const cleanName = name.trim();
        if (!cleanName) return;
        const targetKey = 'folder_' + Date.now();
        this.data[parentFolder].push({ name: cleanName, type: 'folder', target: targetKey });
        this.data[targetKey] = [];
        this.save();
    },
    createFile(parentFolder, name, content = "") {
        if (!this.data[parentFolder]) this.data[parentFolder] = [];
        const cleanName = name.trim();
        if (!cleanName) return;
        
        // Перезаписываем файл, если имя совпадает
        this.data[parentFolder] = this.data[parentFolder].filter(f => f.name !== cleanName);
        this.data[parentFolder].push({ name: cleanName, type: 'file', content: content });
        this.save();
    }
};
FSCore.init();
