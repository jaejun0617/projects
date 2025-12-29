/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Analytics 모듈 ✨
 * ===================================================================================
 *
 * 역할:
 *  - 사용자의 활동 데이터를 분석하고 시각화
 *  - SPA 환경에서도 페이지 전환 시 기존 차트 파괴 후 재생성
 *
 * 주요 기능:
 *  - 로컬 스토리지에서 'todos'와 'habitTracker' 데이터 로드
 *  - 선택한 기간(7/14/30일) 기준으로 데이터 동적 가공
 *  - 총 완료 수, 평균 달성률 등 주요 통계 카드 표시
 *  - Chart.js를 사용하여 기간별 완료 현황(막대 차트) 및 완료 항목 비율(도넛 차트) 시각화
 *  - 기간 필터 변경 시 통계 및 차트를 실시간 업데이트
 *  - SPA 대응: 기존 차트 파괴 및 재생성
 *
 * 핵심 함수:
 *  - initAnalytics: 분석 페이지 초기화 및 이벤트 연결
 *  - processDataForPeriod: 선택 기간 기준으로 통계 및 차트 데이터 가공
 *  - updateDashboard: 가공 데이터를 바탕으로 통계 카드와 차트 업데이트
 * ===================================================================================
 */

import { loadFromStorage } from '../utils/storage.js';

// SPA 대응: 차트 인스턴스 전역 변수
let completionOverTimeChart = null;
let completionRatioChart = null;

/**
 * [메인 함수] 분석 페이지 초기화
 * - DOM 요소 조회
 * - 데이터 가공 함수 정의
 * - 차트 및 UI 업데이트
 * - 이벤트 리스너 연결
 */
export function initAnalytics() {
   // -------------------- 1. 필수 요소 조회 --------------------
   const container = document.querySelector('.analytics-container');
   if (!container) return;

   const periodFilter = container.querySelector('#period-filter');
   const totalCompletedEl = container.querySelector('#total-completed-count');
   const avgRateEl = container.querySelector('#average-completion-rate');
   const bestDayEl = container.querySelector('#best-performance-day');
   const timeChartCanvas = container.querySelector(
      '#completion-over-time-chart',
   );
   const ratioChartCanvas = container.querySelector('#completion-ratio-chart');

   // 성과 요약 카드 요소
   const avgCompletionsEl = container.querySelector('#avg-completions');
   const bestDayOfWeekEl = container.querySelector('#best-day-of-week');
   const periodComparisonEl = container.querySelector('#period-comparison');

   // -------------------- 2. 데이터 가공 함수 --------------------

   // 최근 N일 날짜 배열 생성 (offset으로 이전 기간 계산 가능)
   const getLastNDates = (days, offset = 0) => {
      const dates = [];
      for (let i = offset; i < days + offset; i++) {
         const d = new Date();
         d.setDate(d.getDate() - i);
         dates.push(d.toISOString().split('T')[0]);
      }
      return dates.reverse();
   };

   // 기간별 완료 수 계산 (지난 기간 대비)
   const calculateCompletedForDates = (dates) => {
      const todos = loadFromStorage('todos') || [];
      const habitTracker = loadFromStorage('habitTracker');
      let totalCompletedHabits = 0;

      dates.forEach((date) => {
         if (habitTracker?.date === date && Array.isArray(habitTracker.data)) {
            totalCompletedHabits += habitTracker.data
               .flatMap((g) => g.items)
               .filter((h) => h.completed).length;
         }
      });
      // 투두 완료 수 합산
      return totalCompletedHabits + todos.filter((t) => t.done).length;
   };

   /**
    * 선택 기간 기준 데이터 가공
    * @param {number} periodDays - 선택한 기간(일)
    * @returns {object} 통계 및 차트용 데이터
    */
   const processDataForPeriod = (periodDays) => {
      const dates = getLastNDates(periodDays);
      const todos = loadFromStorage('todos') || [];
      const habitTracker = loadFromStorage('habitTracker');

      let totalCompletedHabits = 0;
      let totalCompletedTodos = 0;
      let totalPossibleItems = 0;
      let bestDay = { date: null, count: -1 };

      const dailyCompletionCounts = dates.map((date) => {
         const habitsForDay =
            habitTracker?.date === date
               ? habitTracker.data.flatMap((g) => g.items)
               : [];
         const completedHabits = habitsForDay.filter((h) => h.completed).length;
         totalCompletedHabits += completedHabits;

         const completedTodos = todos.filter((t) => t.done).length;
         const dailyTotal = habitsForDay.length + todos.length;
         const dailyCompleted = completedHabits + completedTodos;
         totalPossibleItems += dailyTotal;

         if (dailyCompleted >= bestDay.count) {
            bestDay = { date: new Date(date), count: dailyCompleted };
         }

         return dailyCompleted;
      });

      totalCompletedTodos = todos.filter((t) => t.done).length;
      const totalCompleted = totalCompletedHabits + totalCompletedTodos;
      const avgRate =
         totalPossibleItems > 0
            ? Math.round((totalCompleted / totalPossibleItems) * 100)
            : 0;

      // 성과 요약
      const avgCompletions = (totalCompleted / periodDays).toFixed(1);
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const bestDayOfWeek = bestDay.date
         ? `${daysOfWeek[bestDay.date.getDay()]}요일`
         : '-';

      // 이전 기간 대비 계산
      const previousDates = getLastNDates(periodDays, periodDays);
      const prevTotalCompleted = calculateCompletedForDates(previousDates);
      let comparison = 0;
      if (prevTotalCompleted > 0) {
         comparison = Math.round(
            ((totalCompleted - prevTotalCompleted) / prevTotalCompleted) * 100,
         );
      } else if (totalCompleted > 0) {
         comparison = 100;
      }

      return {
         totalCompleted,
         avgRate,
         bestDay: bestDay.date
            ? bestDay.date.toLocaleDateString('ko-KR', {
                 month: 'long',
                 day: 'numeric',
              })
            : '-',
         chartLabels: dates.map(
            (d) =>
               new Date(d).toLocaleDateString('ko-KR', { day: 'numeric' }) +
               '일',
         ),
         chartData: dailyCompletionCounts,
         ratioData: [totalCompletedHabits, totalCompletedTodos],
         avgCompletions,
         bestDayOfWeek,
         comparison,
      };
   };

   // -------------------- 3. 차트 및 UI 업데이트 --------------------
   const updateDashboard = () => {
      const period = Number(periodFilter.value);
      const data = processDataForPeriod(period);

      // 통계 카드 업데이트
      totalCompletedEl.textContent = data.totalCompleted;
      avgRateEl.textContent = `${data.avgRate}%`;
      bestDayEl.textContent = data.bestDay;

      // 성과 요약 카드 업데이트
      if (avgCompletionsEl && bestDayOfWeekEl && periodComparisonEl) {
         avgCompletionsEl.textContent = `${data.avgCompletions}개`;
         bestDayOfWeekEl.textContent = data.bestDayOfWeek;
         periodComparisonEl.textContent = `${data.comparison >= 0 ? '+' : ''}${data.comparison}%`;

         periodComparisonEl.className = 'summary-value';
         if (data.comparison > 0) periodComparisonEl.classList.add('positive');
         if (data.comparison < 0) periodComparisonEl.classList.add('negative');
      }

      // SPA 대응: 기존 차트 제거
      if (completionOverTimeChart) completionOverTimeChart.destroy();
      if (completionRatioChart) completionRatioChart.destroy();

      // 막대 차트: 기간별 완료 현황
      completionOverTimeChart = new Chart(timeChartCanvas, {
         type: 'bar',
         data: {
            labels: data.chartLabels,
            datasets: [
               {
                  label: '완료 개수',
                  data: data.chartData,
                  backgroundColor: 'rgba(52, 152, 219, 0.7)',
                  borderColor: 'rgba(52, 152, 219, 1)',
                  borderWidth: 1,
                  borderRadius: 4,
               },
            ],
         },
         options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
         },
      });

      // 도넛 차트: 완료 항목 비율
      completionRatioChart = new Chart(ratioChartCanvas, {
         type: 'doughnut',
         data: {
            labels: ['습관', '할 일'],
            datasets: [
               {
                  data: data.ratioData,
                  backgroundColor: ['#2ECC71', '#3498DB'],
                  borderWidth: 0,
               },
            ],
         },
         options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
         },
      });
   };

   // -------------------- 4. 이벤트 연결 --------------------
   periodFilter.addEventListener('change', updateDashboard);

   // -------------------- 5. 초기 실행 --------------------
   updateDashboard();
}
