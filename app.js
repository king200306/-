// Slide navigation logic
let currentSlide = 1;
const totalSlides = 14;

// Initialize Lucide Icons
lucide.createIcons();

function updateSlideView() {
  // Hide all slides
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => slide.classList.remove('active'));

  // Show current slide
  const activeSlide = document.querySelector(`#slide-${currentSlide}`);
  if (activeSlide) {
    activeSlide.classList.add('active');
  }

  // Update nav indicator text
  document.querySelector('#current-slide-num').textContent = currentSlide;
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    currentSlide++;
    updateSlideView();
  }
}

function prevSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    updateSlideView();
  }
}

function goToSlide(slideNum) {
  if (slideNum >= 1 && slideNum <= totalSlides) {
    currentSlide = slideNum;
    updateSlideView();
  }
}

// Event Listeners for Nav buttons
document.querySelector('#prev-btn').addEventListener('click', prevSlide);
document.querySelector('#next-btn').addEventListener('click', nextSlide);
document.querySelector('#print-pdf-btn').addEventListener('click', () => {
  window.print();
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    nextSlide();
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevSlide();
    e.preventDefault();
  }
});

// --------------------------------------------------------------------
// DFD Context Diagram Interactive Tooltips & Highlights
// --------------------------------------------------------------------
const tooltipData = {
  'f-owner-to-sys': '보호자 ➔ 시스템: 회원 가입 신청서 및 반려견 프로필, 맞춤 케어 사료/영양제 주문 및 결제 정보',
  'f-sys-to-owner': '시스템 ➔ 보호자: 실시간 및 분석 건강 지수 요약 리포트, 건강 지표 점수, 이상 생체 신호 경고 알림',
  'f-collar-to-sys': 'IoT 목줄 ➔ 시스템: 센서에서 1초 주기로 자동 수집되는 반려견의 체온, 심박수, 움직임(가속도) 로그',
  'f-sys-to-vet': '시스템 ➔ 수의사: 전용 병원 웹 포털을 통한 해당 환견의 실시간 생체 데이터 현황 및 장기 추이 레코드',
  'vet-to-sys': '수의사 ➔ 시스템: 의료진의 정밀 소견에 기반한 영양 처방 소견서 및 전문 복약 지도 관리 정보',
  'f-sys-to-ai': '시스템 ➔ AI 분석 엔진: 수집된 반려견의 바이탈 센서 정보 시계열 데이터를 실시간 AI 서버로 전송',
  'f-ai-to-sys': 'AI 분석 엔진 ➔ 시스템: 딥러닝 이상 탐지 알고리즘이 연산한 비정상 맥박/체온 감지 및 종합 지수 피드백',
  'f-sys-to-pg': '시스템 ➔ 결제 대행사: 보호자가 주문한 사료 및 처방 보조제 대금 결제 승인 요청',
  'f-pg-to-sys': '결제 대행사 ➔ 시스템: 신용카드/계좌이체 대금 결제 완료 승인 번호 및 내역 송부',
  'f-sys-to-supplier': '시스템 ➔ 유통사: 처방 매칭된 유기농 사료 및 관절/피부 영양제 출고 지시 및 배송 요청서',
  'f-supplier-to-sys': '유통사 ➔ 시스템: 배송 물류 상태 트래킹 정보 및 택배 운송장 상태 피드백'
};

const tooltip = document.querySelector('#dfd-tooltip');

document.querySelectorAll('#dfd-context-svg .dfd-arrow, #dfd-context-svg .dfd-arrow-label').forEach(el => {
  el.addEventListener('mouseenter', (e) => {
    let targetId = '';
    if (el.id && tooltipData[el.id]) {
      targetId = el.id;
    } else {
      const prevEl = el.previousElementSibling;
      if (prevEl && prevEl.id && tooltipData[prevEl.id]) {
        targetId = prevEl.id;
      }
    }

    if (targetId) {
      const arrowPath = document.getElementById(targetId);
      arrowPath.parentElement.classList.add('dfd-flow-hovered');
      tooltip.textContent = tooltipData[targetId];
      tooltip.style.opacity = 1;
    }
  });

  el.addEventListener('mouseleave', (e) => {
    document.querySelectorAll('.dfd-flow-hovered').forEach(node => {
      node.classList.remove('dfd-flow-hovered');
    });
    tooltip.textContent = '마우스 오버 시 흐름도가 하이라이트됩니다.';
  });
});

// --------------------------------------------------------------------
// Realtime Vital Dashboard Simulation
// --------------------------------------------------------------------
let chartInstance = null;
let liveTimer = null;
let chartLabels = [];
let chartHrData = [];
let chartTempData = [];
let stepsCount = 450;

function initLiveChart() {
  if (chartInstance) return;

  const ctx = document.getElementById('liveVitalChart').getContext('2d');
  
  chartLabels = [];
  chartHrData = [];
  chartTempData = [];
  
  const now = new Date();
  for (let i = 9; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3000);
    chartLabels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    chartHrData.push(Math.floor(Math.random() * (105 - 90) + 90));
    chartTempData.push(parseFloat((Math.random() * (38.9 - 38.4) + 38.4).toFixed(1)));
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: '심박수 (bpm)',
          data: chartHrData,
          borderColor: '#ff5252',
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          borderWidth: 2,
          yAxisID: 'y-hr',
          tension: 0.3
        },
        {
          label: '체온 (℃)',
          data: chartTempData,
          borderColor: '#ffeb3b',
          backgroundColor: 'rgba(255, 235, 59, 0.1)',
          borderWidth: 2,
          yAxisID: 'y-temp',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Turn off animation for static rendering compatibility in PDF
      plugins: {
        legend: {
          labels: {
            color: '#bdc1c6',
            font: { size: 9 }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#80868b', font: { size: 8 } },
          grid: { color: '#2d2e30' }
        },
        'y-hr': {
          type: 'linear',
          position: 'left',
          min: 60,
          max: 130,
          ticks: { color: '#ff5252', font: { size: 8 } },
          grid: { color: '#2d2e30' }
        },
        'y-temp': {
          type: 'linear',
          position: 'right',
          min: 37,
          max: 41,
          ticks: { color: '#ffeb3b', font: { size: 8 } },
          grid: { display: false }
        }
      }
    }
  });

  startLiveSimulation();
}

function startLiveSimulation() {
  if (liveTimer) clearInterval(liveTimer);
  
  liveTimer = setInterval(() => {
    if (!chartInstance) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const nextHr = Math.floor(Math.random() * (108 - 88) + 88);
    const nextTemp = parseFloat((Math.random() * (39.0 - 38.3) + 38.3).toFixed(1));
    stepsCount += Math.floor(Math.random() * 4);

    document.getElementById('live-heart-rate').innerHTML = `${nextHr} <small>bpm</small>`;
    document.getElementById('live-temp').innerHTML = `${nextTemp} <small>℃</small>`;
    document.getElementById('live-steps').innerHTML = `${stepsCount} <small>걸음</small>`;

    chartLabels.push(timeStr);
    chartHrData.push(nextHr);
    chartTempData.push(nextTemp);

    chartLabels.shift();
    chartHrData.shift();
    chartTempData.shift();

    chartInstance.update();
  }, 2000);
}

// AI Analysis Simulator Button Click Handler
document.getElementById('run-ai-btn').addEventListener('click', function() {
  const btn = this;
  const results = document.getElementById('rec-results');
  
  btn.disabled = true;
  btn.innerHTML = `<span class="pulse-dot"></span> 분석 연산중...`;
  
  setTimeout(() => {
    btn.classList.add('hidden');
    results.classList.remove('hidden');
    
    const scoreVal = document.getElementById('rec-score');
    let score = 0;
    const interval = setInterval(() => {
      score += 2;
      scoreVal.textContent = `${score}점`;
      if (score >= 94) {
        clearInterval(interval);
        scoreVal.textContent = '94점';
      }
    }, 20);
  }, 1500);
});

// Initialize on page load
updateSlideView();
initLiveChart(); // Initialize chart immediately so it is pre-rendered for print/PDF
