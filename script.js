const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('collapseBtn');
const collapseIcon = collapseBtn.querySelector('i');
const BREAKPOINT = 1024;

function setCollapseState(collapsed) {
    if (collapsed) {
        sidebar.classList.add('collapsed');
        collapseIcon.classList.replace('ph-caret-left', 'ph-caret-right');
    } else {
        sidebar.classList.remove('collapsed');
        collapseIcon.classList.replace('ph-caret-right', 'ph-caret-left');
    }
}

collapseBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.contains('collapsed');
    setCollapseState(!isCollapsed);
});

// Responsive behavior
function handleResize() {
    if (window.innerWidth <= BREAKPOINT) {
        if (!sidebar.classList.contains('collapsed')) {
            setCollapseState(true);
        }
    } else {
        if (sidebar.classList.contains('collapsed')) {
            setCollapseState(false);
        }
    }
}

window.addEventListener('resize', handleResize);

// Submenu Toggle
const projectsToggle = document.getElementById('projects-toggle');
const projectsSubmenu = document.getElementById('projects-submenu');
const projectsCaret = projectsToggle.querySelector('.submenu-caret');

projectsToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (sidebar.classList.contains('collapsed')) {
        // Optionally expand sidebar first if clicking a menu item that has a submenu
        setCollapseState(false);
    }
    
    projectsToggle.classList.toggle('expanded');
    if (projectsToggle.classList.contains('expanded')) {
        projectsSubmenu.style.display = 'flex';
        projectsCaret.classList.replace('ph-caret-down', 'ph-caret-up');
    } else {
        projectsSubmenu.style.display = 'none';
        projectsCaret.classList.replace('ph-caret-up', 'ph-caret-down');
    }
});

// AI Chat Toggle
const aiChatBtn = document.getElementById('aiChatBtn');
const aiPanel = document.getElementById('aiPanel');
const closeAiPanel = document.getElementById('closeAiPanel');

aiChatBtn.addEventListener('click', () => {
    aiPanel.classList.toggle('open');
});

closeAiPanel.addEventListener('click', () => {
    aiPanel.classList.remove('open');
});

// Skip Link Focus
const skipLink = document.querySelector('.skip-link');
const mainContent = document.getElementById('main');

skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Find first focusable element in main
    const focusable = mainContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
        focusable[0].focus();
    } else {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
    }
});

// Initial check on load
handleResize();