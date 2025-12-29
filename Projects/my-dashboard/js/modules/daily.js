/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Daily Progress 모듈 (SPA 최적화) ✨
 * ===================================================================================
 *
 * 역할:
 *  - Todo / Habit 데이터를 기반으로 하루 진행률을 계산 및 시각화
 *  - 페이지 전환(SPA) 후에도 DOM에 맞게 차트 생성
 *  - 이전 차트가 존재하면 제거 후 재생성하여 메모리 최적화
 *  - Todo/Habit 변경 시 실시간 UI 갱신
 *
 * 핵심 구조:
 *  - calculateProgress: 오늘 완료된 항목과 전체 항목 수를 계산
 *  - updateUI: 위젯 상태, 텍스트, 진행률 바, 도넛 차트 업데이트
 *  - dailyChart: Chart.js 도넛 차트 인스턴스(SPA 최적화)
 *
 * ===================================================================================
 */

import { loadFromStorage } from '../utils/storage.js';
let dailyChart = null;

/**
 * [메인 함수] Daily Progress 위젯 초기화
 */
export function initDailyProgress() {
   // -------------------- 1️⃣ DOM 요소 가져오기 --------------------
   const widget = document.querySelector('.daily-progress-widget');
   if (!widget) return;

   const chartCanvas = widget.querySelector('#daily-progress-chart');
   const progressTextEl = widget.querySelector('.daily-progress-text');
   const doneCountEl = widget.querySelector('.done-count');
   const totalCountEl = widget.querySelector('.total-count');
   const progressBarFillEl = widget.querySelector('#progress-bar-fill');
   if (!chartCanvas) return;

   // ⚡ 이전 차트가 있으면 제거(SPA 최적화)
   if (dailyChart) {
      dailyChart.destroy();
      dailyChart = null;
   }

   // -------------------- 2️⃣ 데이터 계산 --------------------
   const calculateProgress = () => {
      const todos = loadFromStorage('todos') || [];
      const habitsData = loadFromStorage('habitTracker')?.data || [];

      const doneTodos = todos.filter((t) => t.done).length;
      const totalTodos = todos.length;

      const doneHabits = habitsData
         .flatMap((g) => g.items)
         .filter((h) => h.completed).length;
      const totalHabits = habitsData.flatMap((g) => g.items).length;

      const totalItems = totalTodos + totalHabits;
      const doneItems = doneTodos + doneHabits;
      const percent =
         totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

      return { doneItems, totalItems, percent };
   };

   // -------------------- 3️⃣ UI 업데이트 --------------------
   const updateUI = () => {
      const { doneItems, totalItems, percent } = calculateProgress();

      // 3-1. 위젯 상태 데이터 속성 반영
      if (percent === 100) widget.dataset.status = 'perfect';
      else if (percent >= 50) widget.dataset.status = 'good';
      else widget.dataset.status = 'normal';

      // 3-2. 텍스트 업데이트
      progressTextEl.textContent = `${percent}%`;
      doneCountEl.textContent = `완료: ${doneItems}`;
      totalCountEl.textContent = `전체: ${totalItems}`;

      // 3-3. 진행률 바 업데이트
      if (progressBarFillEl) progressBarFillEl.style.width = `${percent}%`;

      // 3-4. 차트 생성/업데이트
      if (dailyChart) {
         dailyChart.data.datasets[0].data = [doneItems, totalItems - doneItems];
         dailyChart.update('none'); // 애니메이션 없이 갱신
      } else {
         dailyChart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
               datasets: [
                  {
                     data: [doneItems, totalItems - doneItems],
                     backgroundColor: ['#3498db', 'rgba(0,0,0,0.08)'],
                     borderWidth: 0,
                     borderRadius: 10,
                     spacing: totalItems > 0 ? 4 : 0,
                  },
               ],
            },
            options: {
               cutout: '80%',
               plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
               },
               animation: { duration: 1000, easing: 'easeOutQuart' },
               events: [],
            },
         });
      }
   };

   updateUI();

   // -------------------- 4️⃣ 데이터 변경 시 UI 실시간 갱신 --------------------
   document.addEventListener('todoUpdated', updateUI);
   document.addEventListener('habitUpdated', updateUI);
}
