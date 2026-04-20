document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: '2026-04-24',
            headerToolbar: {
                left: '',
                center: '',
                right: ''
            },
            events: [
                { title: 'Deworming: Cooper', date: '2026-04-24', backgroundColor: '#1B6D24' },
                { title: 'Vaccination: Buddy', date: '2026-04-25', backgroundColor: '#004080' },
                { title: 'Consultation: Felix', date: '2026-04-28', backgroundColor: '#999' }
            ],
            dayCellDidMount: function(info) {
                // Highlight weekends lightly
                if (info.date.getDay() === 0 || info.date.getDay() === 6) {
                    info.el.style.backgroundColor = '#f9f9f9';
                }
            }
        });
        calendar.render();
    }

    const patientVolumeCtx = document.getElementById('patientVolumeChart');
    if (patientVolumeCtx) {
        new Chart(patientVolumeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Patient Volume',
                        data: [120, 190, 150, 221, 200, 290, 250],
                        borderColor: '#002A58',
                        backgroundColor: 'rgba(0, 42, 88, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#002A58',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(216.75, 216.75, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#737781'
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#737781'
                        }
                    }
                }
            }
        });
    }

    // ===========================
    // DISEASE CASES CHART
    // ===========================
    const diseaseCtx = document.getElementById('diseaseChart');
    if (diseaseCtx) {
        new Chart(diseaseCtx, {
            type: 'line',
            data: {
                labels: ['Poblacion', 'San Jose', 'Tangos', 'Matangtubig', 'Makinabang', 'Virgen delas Flores', 'Tilapayong', 'Tibag', 'Tiaong', 'Santo Niño', 'Santo Cristo', 'Santa Barbara'],
                datasets: [
                    {
                        label: 'Number Of Cases',
                        data: [5, 2, 4, 10, 5, 3, 7, 2, 4, 3, 2, 2],
                        borderColor: '#002A58',
                        backgroundColor: 'rgba(255, 146, 138, 0.15)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#002A58',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Predictive Cases',
                        data: [7, 3, 5, 8, 6, 4, 5, 3, 5, 4, 3, 3],
                        borderColor: '#677BAE',
                        backgroundColor: 'rgba(137.05, 121.10, 255, 0.15)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#677BAE',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#002A58',
                            font: {
                                size: 12,
                                weight: '600'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(216.75, 216.75, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#737781',
                            stepSize: 2
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#737781',
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }


    const vaccinatedCtx = document.getElementById('vaccinatedChart');
    if (vaccinatedCtx) {
        new Chart(vaccinatedCtx, {
            type: 'doughnut',
            data: {
                labels: ['Rabies', 'Parvo'],
                datasets: [
                    {
                        data: [60, 40],
                        backgroundColor: [
                            '#1B6D24',
                            '#E2E2E8'
                        ],
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                cutout: '70%'
            },
            plugins: [{
                id: 'textCenter',
                beforeDatasetsDraw(chart) {
                    const { width, height, ctx } = chart;
                    ctx.save();
                    
                    const fontSize = (height / 200).toFixed(2);
                    const centerX = width / 2;
                    const centerY = height / 2;
                    
                    // Draw main number
                    ctx.font = `bold ${fontSize * 32}px Manrope, sans-serif`;
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#002A58';
                    ctx.fillText('8,402', centerX, centerY - fontSize * 5);
                    
                    // Draw label
                    ctx.font = `${fontSize * 12}px Manrope, sans-serif`;
                    ctx.fillStyle = '#737781';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Total FY24', centerX, centerY + fontSize * 24);
                   
                    
                    ctx.restore();
                }
            }]
        });
    }

    // ===========================
    // EVENT LISTENERS
    // ===========================

    // Search functionality
    const searchInput = document.querySelector('.searchField input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log('Searching for:', e.target.value);
            // Add search functionality here
        });
    }


    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.toggle('expanded');
            }
        });
    }
  
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
           
            console.log('Tab changed to:', this.textContent);
        });
    });

    // Add appointment button
    const addAppointmentBtn = document.querySelector('.btn-add-appointment');
    if (addAppointmentBtn) {
        addAppointmentBtn.addEventListener('click', function() {
            alert('Add appointment functionality will be implemented here');
        });
    }

    // Manage event button
    const manageEventBtn = document.querySelector('.btn-manage-event');
    if (manageEventBtn) {
        manageEventBtn.addEventListener('click', function() {
            alert('Manage event functionality will be implemented here');
        });
    }

    // Create announcement button
    const createAnnounceBtn = Array.from(document.querySelectorAll('.btn-secondary')).find(btn => 
        btn.textContent.includes('Create Announcement')
    );
    if (createAnnounceBtn) {
        createAnnounceBtn.addEventListener('click', function() {
            alert('Create announcement functionality will be implemented here');
        });
    }

    // Manage announcement button
    const manageAnnounceBtn = Array.from(document.querySelectorAll('.btn-secondary')).find(btn => 
        btn.textContent.includes('Manage Announcement')
    );
    if (manageAnnounceBtn) {
        manageAnnounceBtn.addEventListener('click', function() {
            alert('Manage announcement functionality will be implemented here');
        });
    }

    // ===========================
    // ANIMATIONS
    // ===========================

    // Fade in cards on load
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
    });

    // KPI cards animation
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `slideUp 0.5s ease-in-out ${index * 0.1}s forwards`;
    });

    console.log('Dashboard initialized successfully');
});

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Update KPI values with animation
 */
function updateKPIValue(element, newValue, duration = 1000) {
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const increment = (newValue - currentValue) / (duration / 16);
    let current = currentValue;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= newValue) || (increment < 0 && current <= newValue)) {
            element.textContent = formatNumber(newValue);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.round(current));
        }
    }, 16);
}

/**
 * Show notification/toast
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#1B6D24' : type === 'error' ? '#93000A' : '#002A58'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===========================
// CSS ANIMATIONS
// ===========================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
