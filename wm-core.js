let activeZIndex = 10; // Глобальный трекер слоев окон

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'flex';
    focusWindow(win);
    
    // Закрываем системное меню Старт при открытии любого приложения
    const startMenu = document.getElementById('start-menu');
    if (startMenu) startMenu.classList.remove('open');
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (win) win.classList.toggle('maximized');
}

function focusWindow(win) {
    activeZIndex++;
    win.style.zIndex = activeZIndex;
}

function initDrag(headerId, windowId) {
    const header = document.getElementById(headerId);
    const win = document.getElementById(windowId);
    if (!header || !win) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragStart(e) {
        // На мобильных экранах или в полноэкранном режиме драг отключается
        if (window.innerWidth <= 768 || win.classList.contains('maximized')) return;
        focusWindow(win);
        
        const clientX = e.type === 'touchstart' ? e.touches.clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches.clientY : e.clientY;
        
        pos3 = clientX; 
        pos4 = clientY;
        
        if (e.type === 'mousedown') {
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('mousemove', dragMove);
        } else {
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('touchmove', dragMove, { passive: false });
        }
    }

    function dragMove(e) {
        const clientX = e.type === 'touchmove' ? e.touches.clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches.clientY : e.clientY;

        pos1 = pos3 - clientX; 
        pos2 = pos4 - clientY;
        pos3 = clientX; 
        pos4 = clientY;

        win.style.top = (win.offsetTop - pos2) + "px";
        win.style.left = (win.offsetLeft - pos1) + "px";
    }

    function dragEnd() {
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchend', dragEnd);
        document.removeEventListener('touchmove', dragMove);
    }

    header.addEventListener('mousedown', dragStart);
    header.addEventListener('touchstart', dragStart);
}
