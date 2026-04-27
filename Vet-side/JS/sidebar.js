document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) {
        return;
    }
    const navRoot = sidebar.querySelector(".sidebar-nav");
    if (!navRoot) {
        return;
    }

    const navItems = Array.from(navRoot.querySelectorAll(".nav-item"));
    if (!navItems.length) {
        return;
    }

    const routeByLabel = {
        dashboard: "index.html",
        "appointment management": "appointment.html",
        "patient records": "patientRecords.html",
        report: "report.html",
        "disease analytics": "DiseaseAnalytics.html",
        "lost and found": "Lost&Found.html",
        "chatbot management": "chatbotmanagement.html",
        "mass vaccination": "MassVacc.html"
    };

    const swappedIconByLabel = {
        "appointment management": "/Vet-side/Images/n.svg",
        "patient records": "/Vet-side/Images/paw.svg"
    };

    const activeIconCapable = new Set(["paw", "n", "graph", "chatbot", "lostandFound", "calendar"]);

    const sidebarHeader = sidebar.querySelector(".sidebar-header");
    let sidebarToggle = document.getElementById("sidebar-toggle");
    if (!sidebarToggle && sidebarHeader) {
        sidebarToggle = document.createElement("button");
        sidebarToggle.type = "button";
        sidebarToggle.className = "sidebar-toggle";
        sidebarToggle.id = "sidebar-toggle";
        sidebarToggle.setAttribute("aria-label", "Toggle sidebar menu");
        sidebarToggle.innerHTML = "&#9776;";
        sidebarHeader.prepend(sidebarToggle);
    }

    const footer = sidebar.querySelector(".sidebar-footer");
    if (footer) {
        footer.innerHTML = `
            <article class="sidebar-profile-card" aria-label="Veterinarian profile">
                <img src="https://i.pravatar.cc/120?img=47" alt="Dr. Kizea Igaya" class="sidebar-profile-avatar">
                <div class="sidebar-profile-meta">
                    <strong class="sidebar-profile-name">Dr. Kizea Bien Igaya</strong>
                    <span class="sidebar-profile-role">Vet III</span>
                </div>
            </article>
        `;

        const profileCard = footer.querySelector(".sidebar-profile-card");
        if (profileCard) {
            profileCard.addEventListener("click", () => {
                if (!window.location.pathname.toLowerCase().endsWith("/profile.html") && !window.location.pathname.toLowerCase().endsWith("profile.html")) {
                    window.location.href = "profile.html";
                }
            });
        }
    }

    const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    navItems.forEach((item) => {
        const rawLabel = item.querySelector(".nav-label")?.textContent?.trim().toLowerCase() || "";
        const route = routeByLabel[rawLabel];
        if (route) {
            item.setAttribute("href", route);
        }

        const icon = item.querySelector(".nav-icon");
        if (icon && swappedIconByLabel[rawLabel]) {
            icon.setAttribute("src", swappedIconByLabel[rawLabel]);
        }

        const targetFile = (item.getAttribute("href") || "").split("/").pop().toLowerCase();
        const isActive = Boolean(targetFile) && targetFile === currentFile;
        item.classList.toggle("active", isActive);

        if (icon) {
            const source = icon.getAttribute("src") || "";
            const lastSlash = source.lastIndexOf("/");
            const folder = lastSlash >= 0 ? source.slice(0, lastSlash + 1) : "";
            const fileName = lastSlash >= 0 ? source.slice(lastSlash + 1) : source;
            const dotIndex = fileName.lastIndexOf(".");
            const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;
            const extension = dotIndex >= 0 ? fileName.slice(dotIndex) : "";
            const normalizedBase = baseName.endsWith("-active") ? baseName.slice(0, -7) : baseName;

            if (activeIconCapable.has(normalizedBase)) {
                const resolvedName = isActive ? `${normalizedBase}-active${extension}` : `${normalizedBase}${extension}`;
                icon.setAttribute("src", `${folder}${resolvedName}`);
            }
        }

        item.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("mobile-open");
            }
        });
    });

    sidebar.addEventListener("click", (event) => {
        if (window.innerWidth <= 768) {
            return;
        }
        if (event.target.closest(".nav-item") || event.target.closest("#sidebar-toggle")) {
            return;
        }
        sidebar.classList.toggle("expanded");
        syncToggleState();
    });

    function syncToggleState() {
        if (!sidebarToggle) {
            return;
        }
        sidebarToggle.setAttribute("aria-expanded", sidebar.classList.contains("expanded") ? "true" : "false");
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("mobile-open");
                return;
            }
            sidebar.classList.toggle("expanded");
            syncToggleState();
        });
    }

    document.addEventListener("click", (event) => {
        if (window.innerWidth > 768) {
            return;
        }
        if (!sidebar.contains(event.target)) {
            sidebar.classList.remove("mobile-open");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("mobile-open");
        }
        syncToggleState();
    });

    syncToggleState();

    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            tabs.forEach((otherTab) => otherTab.classList.remove("active"));
            this.classList.add("active");
        });
    });
});