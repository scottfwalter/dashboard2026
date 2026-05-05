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

// Search trigger (popover wired in follow-up)
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', () => {
    console.log('search popover: TODO');
});

window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchBtn.click();
    }
});

// Notification bell
const bellIcon = document.querySelector('#notificationBtn .bell-icon');
const bellBadge = document.getElementById('bellBadge');
let notificationCount = 0;
let ringAnimation = null;

const RING_KEYFRAMES = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(15deg)', offset: 0.10 },
    { transform: 'rotate(-13deg)', offset: 0.20 },
    { transform: 'rotate(11deg)', offset: 0.30 },
    { transform: 'rotate(-9deg)', offset: 0.40 },
    { transform: 'rotate(6deg)', offset: 0.55 },
    { transform: 'rotate(-4deg)', offset: 0.70 },
    { transform: 'rotate(2deg)', offset: 0.85 },
    { transform: 'rotate(0deg)' },
];

const RING_OPTIONS = {
    duration: 1100,
    easing: 'cubic-bezier(.36,.07,.19,.97)',
};

function ringBell() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (ringAnimation) ringAnimation.cancel();
    ringAnimation = bellIcon.animate(RING_KEYFRAMES, RING_OPTIONS);
}

function setNotificationCount(n) {
    const next = Math.max(0, Math.floor(Number(n) || 0));
    if (next === notificationCount) return;
    notificationCount = next;
    if (next > 0) {
        bellBadge.textContent = next > 99 ? '99+' : String(next);
        bellBadge.hidden = false;
    } else {
        bellBadge.hidden = true;
    }
    ringBell();
}

window.setNotificationCount = setNotificationCount;

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

function getTabbableElements() {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(document.querySelectorAll(selector))
        .filter(el => el.offsetParent !== null && !el.hidden);
}

// Row action menu (kebab dropdown)
const actionMenu = document.getElementById('actionMenu');
const actionMenuItems = Array.from(actionMenu.querySelectorAll('.action-menu__item'));
const kebabButtons = Array.from(document.querySelectorAll('.kebab-btn'));
let actionMenuTrigger = null;

function openActionMenu(triggerBtn) {
    triggerBtn.style.anchorName = '--kebab-anchor';
    actionMenu.hidden = false;
    triggerBtn.setAttribute('aria-expanded', 'true');
    actionMenuTrigger = triggerBtn;
    actionMenuItems[0].focus({ preventScroll: true });
}

function closeActionMenu({ restoreFocus = true } = {}) {
    if (actionMenu.hidden) return;
    if (actionMenuTrigger) {
        const trigger = actionMenuTrigger;
        actionMenuTrigger = null;
        trigger.style.anchorName = '';
        trigger.setAttribute('aria-expanded', 'false');
        if (restoreFocus) trigger.focus({ preventScroll: true });
    }
    actionMenu.hidden = true;
}

kebabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (actionMenuTrigger === btn) {
            closeActionMenu();
        } else {
            if (actionMenuTrigger) closeActionMenu({ restoreFocus: false });
            openActionMenu(btn);
        }
    });
});

actionMenuItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        const row = actionMenuTrigger ? actionMenuTrigger.closest('tr') : null;
        const employeeName = row ? (row.querySelector('.user-info span')?.textContent || 'unknown') : 'unknown';
        console.log(`row action: ${action} -> ${employeeName}`);
        closeActionMenu();
    });

    item.addEventListener('keydown', (e) => {
        const focusOpts = { preventScroll: true };
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                actionMenuItems[(idx + 1) % actionMenuItems.length].focus(focusOpts);
                break;
            case 'ArrowUp':
                e.preventDefault();
                actionMenuItems[(idx - 1 + actionMenuItems.length) % actionMenuItems.length].focus(focusOpts);
                break;
            case 'Home':
                e.preventDefault();
                actionMenuItems[0].focus(focusOpts);
                break;
            case 'End':
                e.preventDefault();
                actionMenuItems[actionMenuItems.length - 1].focus(focusOpts);
                break;
            case 'Escape':
                e.preventDefault();
                closeActionMenu();
                break;
            case 'Tab': {
                e.preventDefault();
                const trigger = actionMenuTrigger;
                const direction = e.shiftKey ? -1 : 1;
                closeActionMenu({ restoreFocus: false });
                if (trigger) {
                    const tabbables = getTabbableElements();
                    const triggerIdx = tabbables.indexOf(trigger);
                    const next = triggerIdx >= 0 ? tabbables[triggerIdx + direction] : null;
                    (next || trigger).focus({ preventScroll: false });
                }
                break;
            }
        }
    });
});

document.addEventListener('mousedown', (e) => {
    if (actionMenu.hidden) return;
    if (actionMenu.contains(e.target)) return;
    if (actionMenuTrigger && actionMenuTrigger.contains(e.target)) return;
    closeActionMenu({ restoreFocus: false });
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