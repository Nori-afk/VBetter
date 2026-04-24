document.addEventListener('DOMContentLoaded', () => {
	const labels = [
		'Poblacion',
		'San Jose',
		'Tangos',
		'Matang Tubig',
		'Makirang',
		'Virgen Delos Flores',
		'Tipayong',
		'Tibag',
		'Tiong',
		'Santo Nino',
		'Santo Cristo',
		'Santa Barbara'
	];

	const consultationSeries = [5, 3, 10, 2, 3, 4, 4, 7, 2, 1, 0, 2];
	const inquirySeries = [4, 2, 8, 3, 4, 5, 4, 6, 2, 1, 0, 1];

	const inquiryByType = {
		General: [40, 48, 60, 72, 44, 50, 70, 68, 80, 36, 40, 54],
		Vaccination: [32, 28, 46, 54, 42, 44, 48, 50, 56, 30, 26, 42],
		Surgery: [22, 24, 34, 36, 30, 34, 44, 40, 48, 24, 18, 32]
	};

	const symptomsByPetType = {
		all: {
			labels: ['Fever', 'Itching', 'Arthritis', 'Obesity', 'Vomiting', 'Diarrhea', 'Coughing', 'Loss of Appetite', 'Wounds'],
			values: [31, 85, 37, 54, 16, 16, 56, 54, 83]
		},
		dog: {
			labels: ['Fever', 'Itching', 'Arthritis', 'Obesity', 'Vomiting', 'Diarrhea', 'Coughing', 'Loss of Appetite', 'Wounds'],
			values: [28, 72, 41, 48, 20, 18, 60, 57, 76]
		},
		cat: {
			labels: ['Fever', 'Itching', 'Arthritis', 'Obesity', 'Vomiting', 'Diarrhea', 'Coughing', 'Loss of Appetite', 'Wounds'],
			values: [34, 78, 29, 39, 24, 22, 46, 48, 66]
		}
	};

	const locationLegendRows = [
		{ name: 'Sabang', color: '#ff3b30' },
		{ name: 'Tiong', color: '#ff5b2e' },
		{ name: 'Tarcan', color: '#d1f400' },
		{ name: 'Poblacion', color: '#14b8a6' },
		{ name: 'San Rafael', color: '#00d34f' },
		{ name: 'Tibag', color: '#3ee489' },
		{ name: 'San Jose', color: '#2e92ff' },
		{ name: 'Matang Tubig', color: '#ff3b30' },
		{ name: 'Santo Nino', color: '#ff5b2e' },
		{ name: 'Santo Cristo', color: '#d1f400' }
	];

	const sourceFilter = document.getElementById('sourceFilter');
	const petTypeFilter = document.getElementById('petTypeFilter');
	const locationLegend = document.getElementById('locationLegend');

	if (!window.Chart) {
		return;
	}

	const gridColor = 'rgba(154, 196, 244, 0.14)';
	const tickColor = 'rgba(201, 223, 250, 0.8)';

	const consultationChartCtx = document.getElementById('consultationInquiryChart');
	const inquiryTypeChartCtx = document.getElementById('inquiryTypeChart');
	const symptomsChartCtx = document.getElementById('symptomsChart');

	if (!consultationChartCtx || !inquiryTypeChartCtx || !symptomsChartCtx) {
		return;
	}

	const consultationGradient = consultationChartCtx.getContext('2d').createLinearGradient(0, 0, 0, 230);
	consultationGradient.addColorStop(0, 'rgba(94, 191, 255, 0.45)');
	consultationGradient.addColorStop(1, 'rgba(94, 191, 255, 0.02)');

	const inquiryGradient = consultationChartCtx.getContext('2d').createLinearGradient(0, 0, 0, 230);
	inquiryGradient.addColorStop(0, 'rgba(58, 237, 113, 0.45)');
	inquiryGradient.addColorStop(1, 'rgba(58, 237, 113, 0.02)');

	const consultationInquiryChart = new Chart(consultationChartCtx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: 'Consultation',
					data: consultationSeries,
					borderColor: '#8ad3ff',
					pointBackgroundColor: '#8ad3ff',
					pointRadius: 2,
					tension: 0.35,
					fill: true,
					backgroundColor: consultationGradient
				},
				{
					label: 'Inquiry',
					data: inquirySeries,
					borderColor: '#31e17a',
					pointBackgroundColor: '#31e17a',
					pointRadius: 2,
					tension: 0.35,
					fill: true,
					backgroundColor: inquiryGradient
				}
			]
		},
		options: {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					labels: {
						color: tickColor,
						boxWidth: 14,
						boxHeight: 6
					}
				}
			},
			scales: {
				x: {
					ticks: {
						color: tickColor,
						maxRotation: 0,
						autoSkip: true,
						font: {
							size: 9
						}
					},
					grid: {
						color: gridColor
					}
				},
				y: {
					beginAtZero: true,
					ticks: {
						color: tickColor,
						precision: 0,
						stepSize: 2,
						font: {
							size: 9
						}
					},
					grid: {
						color: gridColor
					}
				}
			}
		}
	});

	const inquiryTypeChart = new Chart(inquiryTypeChartCtx, {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					label: 'General',
					data: inquiryByType.General,
					backgroundColor: '#2433a7',
					stack: 'inquiry'
				},
				{
					label: 'Vaccination',
					data: inquiryByType.Vaccination,
					backgroundColor: '#19b344',
					stack: 'inquiry'
				},
				{
					label: 'Surgery',
					data: inquiryByType.Surgery,
					backgroundColor: '#6ec8ff',
					stack: 'inquiry'
				}
			]
		},
		options: {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					labels: {
						color: tickColor,
						boxWidth: 12,
						boxHeight: 12
					}
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: {
						color: tickColor,
						font: {
							size: 9
						}
					},
					grid: {
						color: gridColor
					}
				},
				y: {
					stacked: true,
					beginAtZero: true,
					ticks: {
						color: tickColor,
						stepSize: 50,
						font: {
							size: 9
						}
					},
					grid: {
						color: gridColor
					}
				}
			}
		}
	});

	const symptomsChart = new Chart(symptomsChartCtx, {
		type: 'bar',
		data: {
			labels: symptomsByPetType.all.labels,
			datasets: [
				{
					label: 'Cases',
					data: symptomsByPetType.all.values,
					borderRadius: 6,
					backgroundColor: '#22c55e',
					borderColor: '#67e8a0',
					borderWidth: 1,
					barPercentage: 0.62
				}
			]
		},
		options: {
			indexAxis: 'y',
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				}
			},
			scales: {
				x: {
					beginAtZero: true,
					max: 100,
					ticks: {
						color: tickColor,
						font: {
							size: 9
						}
					},
					grid: {
						color: gridColor
					}
				},
				y: {
					ticks: {
						color: tickColor,
						font: {
							size: 9
						}
					},
					grid: {
						color: 'rgba(154, 196, 244, 0.06)'
					}
				}
			}
		}
	});

	function renderLocationLegend() {
		if (!locationLegend) {
			return;
		}

		locationLegend.innerHTML = locationLegendRows
			.map((row) => `
				<li>
					<span class="legend-dot" style="background:${row.color}"></span>
					<span>${row.name}</span>
				</li>
			`)
			.join('');
	}

	function updateSourceFilter(source) {
		const showConsultation = source === 'all' || source === 'consultation';
		const showInquiry = source === 'all' || source === 'inquiry';

		consultationInquiryChart.data.datasets[0].hidden = !showConsultation;
		consultationInquiryChart.data.datasets[1].hidden = !showInquiry;
		consultationInquiryChart.update();
	}

	function updateSymptomFilter(petType) {
		const dataSet = symptomsByPetType[petType] || symptomsByPetType.all;
		symptomsChart.data.labels = dataSet.labels;
		symptomsChart.data.datasets[0].data = dataSet.values;
		symptomsChart.update();
	}

	sourceFilter?.addEventListener('change', (event) => {
		updateSourceFilter(event.target.value);
	});

	petTypeFilter?.addEventListener('change', (event) => {
		updateSymptomFilter(event.target.value);
	});

	renderLocationLegend();
});
