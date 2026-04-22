document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardContent = document.getElementById('dashboard-content');
    const moduleContent = document.getElementById('module-content');

    if (!sidebar || !navItems.length) return;

    function setActiveNav(activeItem) {
        navItems.forEach((nav) => nav.classList.remove('active'));
        activeItem.classList.add('active');
    }

    function showDashboard() {
        if (dashboardContent) dashboardContent.hidden = false;
        if (moduleContent) {
            moduleContent.hidden = true;
            moduleContent.innerHTML = '';
        }
    }

    function showModule(label) {
        if (!moduleContent) return;
        if (dashboardContent) dashboardContent.hidden = true;
        moduleContent.hidden = false;
        moduleContent.innerHTML = `
            <section class="module-card">
                <h2>${label}</h2>
                <p>This section is now connected to the sidebar and ready for its dedicated content.</p>
                <button type="button" class="module-back-btn" data-go-dashboard="true">Back to Dashboard</button>
            </section>
        `;
    }

    // Desktop expand/collapse behavior
    sidebar.addEventListener('click', (event) => {
        if (window.innerWidth <= 768) return;
        if (event.target.closest('.nav-item') || event.target.closest('#sidebar-toggle')) return;
        sidebar.classList.toggle('expanded');
    });

    // Mobile menu toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            sidebar.classList.toggle('mobile-open');
        });
    }

    navItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            const href = item.getAttribute('href') || '';
            const isInPageItem = href === '#' || href.startsWith('#');

            setActiveNav(item);

            if (!isInPageItem) {
                return;
            }

            event.preventDefault();
            const label = item.querySelector('.nav-label')?.textContent?.trim() || item.getAttribute('title') || 'Module';
            if (label.toLowerCase().includes('dashboard')) {
                showDashboard();
            } else {
                showModule(label);
            }

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });

    if (moduleContent) {
        moduleContent.addEventListener('click', (event) => {
            const backBtn = event.target.closest('[data-go-dashboard]');
            if (!backBtn) return;

            const dashboardNav = Array.from(navItems).find((item) => {
                const text = item.querySelector('.nav-label')?.textContent?.trim().toLowerCase() || '';
                return text.includes('dashboard');
            });

            if (dashboardNav) setActiveNav(dashboardNav);
            showDashboard();
        });
    }

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', function () {
            tabs.forEach((t) => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
});