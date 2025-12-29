/**
 * ===================================================================================
 * ⏱️ My Ultimate Dashboard - Stopwatch 모듈
 * ===================================================================================
 *
 * 역할:
 *  - 스톱워치 기능 제공 (시작 / 일시정지 / 종료)
 *  - 페이지 재방문 시 상태 복원
 *  - 1시간 단위 알림
 *  - HH:MM:SS 또는 MM:SS 포맷 표시
 *
 * 핵심 구조:
 *  - formatTime(seconds): 초 → HH:MM:SS/MM:SS 변환
 *  - updateUI(): 현재 상태 기반 DOM 렌더링
 *  - tick(): 1초마다 시간 갱신 및 알림
 *  - startStopwatch(), pauseStopwatch(), stopStopwatch(): 상태 제어
 *  - handleButtonClick(action): 버튼 클릭 이벤트 처리
 *  - initStopwatch(): 초기화 및 상태 복원
 *
 * SPA/실시간 업데이트 포인트:
 *  - 상태 저장/복원(LocalStorage)
 *  - 실행 중 페이지 재방문 시 자동 재개
 * ===================================================================================
 */

import { saveToStorage, loadFromStorage } from '../utils/storage.js';

// -------------------- 1️⃣ DOM 요소 및 상태 --------------------
const stopwatchWidget = document.getElementById('stopwatch-widget');
let timerId = null;

let stopwatchState = {
   elapsedTime: 0, // 경과 시간(초)
   state: 'idle', // idle / running / paused
   startTime: null, // 시작/재개 시점 timestamp
};

// -------------------- 2️⃣ 시간 포맷 --------------------
function formatTime(seconds) {
   const h = Math.floor(seconds / 3600);
   const m = Math.floor((seconds % 3600) / 60);
   const s = seconds % 60;
   return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// -------------------- 3️⃣ UI 업데이트 --------------------
function updateUI() {
   if (!stopwatchWidget) return;

   let html = '';
   if (stopwatchState.state === 'idle') {
      html = `
         <button class="stopwatch-button" data-action="start">
            <img src="./assets/icons/black-icons/play-circle.svg" alt="측정 시작" />
            <span>측정 시작</span>
         </button>
      `;
   } else {
      const icon =
         stopwatchState.state === 'running'
            ? 'pause-circle.svg'
            : 'play-circle.svg';
      html = `
         <div class="stopwatch-timer-display">
            <span class="stopwatch-time">${formatTime(stopwatchState.elapsedTime)}</span>
            <div class="stopwatch-controls">
               <button class="stopwatch-control-btn" data-action="play-pause">
                  <img src="./assets/icons/black-icons/${icon}" alt="일시정지/재생" />
               </button>
               <button class="stopwatch-control-btn" data-action="stop">
                  <img src="./assets/icons/black-icons/stop-circle.svg" alt="종료" />
               </button>
            </div>
         </div>
      `;
   }
   stopwatchWidget.innerHTML = html;
}

// -------------------- 4️⃣ 1초마다 실행 --------------------
function tick() {
   if (!stopwatchState.startTime) return;

   const now = Date.now();
   stopwatchState.elapsedTime = Math.round(
      (now - stopwatchState.startTime) / 1000,
   );
   updateUI();

   // 1시간 단위 알림
   if (
      stopwatchState.elapsedTime > 0 &&
      stopwatchState.elapsedTime % 3600 === 0
   ) {
      const hours = stopwatchState.elapsedTime / 3600;
      alert(`⏱️ ${hours}시간 경과. 10분간 휴식을 취하세요!`);
   }
}

// -------------------- 5️⃣ 상태 제어 --------------------
function startStopwatch() {
   stopwatchState.state = 'running';
   stopwatchState.startTime = Date.now() - stopwatchState.elapsedTime * 1000;

   clearInterval(timerId);
   timerId = setInterval(tick, 1000);
   updateUI();
   saveToStorage('stopwatchState', stopwatchState);
}

function pauseStopwatch() {
   stopwatchState.state = 'paused';
   clearInterval(timerId);
   updateUI();
   saveToStorage('stopwatchState', stopwatchState);
}

function stopStopwatch() {
   stopwatchState.state = 'idle';
   clearInterval(timerId);
   stopwatchState.elapsedTime = 0;
   stopwatchState.startTime = null;
   updateUI();
   saveToStorage('stopwatchState', stopwatchState);
}

// -------------------- 6️⃣ 버튼 클릭 처리 --------------------
function handleButtonClick(action) {
   if (action === 'start') startStopwatch();
   else if (action === 'play-pause')
      stopwatchState.state === 'running' ? pauseStopwatch() : startStopwatch();
   else if (action === 'stop') stopStopwatch();
}

// -------------------- 7️⃣ 초기화 --------------------
export function initStopwatch() {
   if (!stopwatchWidget) return;

   // 저장된 상태 복원
   const savedState = loadFromStorage('stopwatchState');
   if (savedState) stopwatchState = savedState;

   // 실행 중이면 자동 재개
   if (stopwatchState.state === 'running') {
      tick();
      startStopwatch();
   } else {
      updateUI();
   }

   // 클릭 이벤트 연결
   stopwatchWidget.addEventListener('click', (e) => {
      const actionTarget = e.target.closest('[data-action]');
      if (actionTarget) handleButtonClick(actionTarget.dataset.action);
   });
}
