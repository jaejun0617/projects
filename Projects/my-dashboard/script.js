/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - 메인 스크립트 (SPA 최적화 / 통합 버전) ✨
 * ===================================================================================
 *
 * 모든 모듈 통합 관리
 * SPA 페이지 전환 및 모바일 사이드바 대응
 * Daily Progress 등 차트와 위젯이 페이지 전환 후에도 정상 표시
 *
 * 모듈별 역할:
 *  - ⏰ initTimeManager : 시계, 날짜, 인사말 표시
 *  - ⏱️ initStopwatch : 스톱워치 기능
 *  - 📅 initCalendar : 미니/전체 캘린더
 *  - 📝 initMemo : 메모 작성/저장
 *  - 📊 initHabitTracker : 습관 트래커 추가/삭제/체크
 *  - 📝 initTodo : 투두리스트 추가/체크/필터링
 *  - 📈 initDailyProgress : 오늘 달성률 차트
 *  - 📊 initAnalytics : 분석 페이지 차트 및 통계
 *  - 🎶 initMusicPlayer : 유튜브 플레이어/재생 컨트롤
 * ===================================================================================
 */

// --- 1. 모듈 불러오기 ---
import { initTimeManager } from './js/modules/timeManager.js';
import { initStopwatch } from './js/modules/stopwatch.js';
import { initCalendar } from './js/modules/calendar.js';
import { initMemo } from './js/modules/memo.js';
import { initHabitTracker } from './js/modules/habit.js';
import { initTodo } from './js/modules/todo.js';
import { initDailyProgress } from './js/modules/daily.js';
import { initAnalytics } from './js/modules/analytics.js';
import { initMusicPlayer } from './js/modules/music.js';

// --- 2. DOMContentLoaded 이벤트에서 초기화 실행 ---
document.addEventListener('DOMContentLoaded', () => {
   console.log('✅ DOMContentLoaded - 대시보드 초기화 시작');

   // --- 2-1. 핵심 기능 초기화 ---
   safeInit(initTimeManager, '⏰ 시간 관리 모듈');
   safeInit(initStopwatch, '⏱️ 스톱워치 모듈');

   // --- 2-2. DOM 캐싱 ---
   const body = document.body;
   const mainContent = document.querySelector('.main-content');
   const navLinks = document.querySelectorAll('.nav-item');
   const hamburgerButton = document.querySelector('.hamburger-button');
   const overlay = document.querySelector('.overlay');
   const initialDashboardHTML = mainContent.innerHTML;

   // --- 2-3. SPA 페이지 전환 함수 ---
   const loadPage = async (page) => {
      if (!page) return;

      // 화면 전환 애니메이션
      mainContent.classList.add('is-changing');
      await new Promise((resolve) => {
         mainContent.addEventListener('transitionend', resolve, { once: true });
      });

      try {
         let newContent = '';
         if (page === 'dashboard') {
            // 기본 대시보드
            newContent = initialDashboardHTML;
         } else {
            // 다른 페이지 불러오기
            const response = await fetch(`./pages/${page}.html`);
            if (!response.ok)
               throw new Error(`'${page}.html' 파일을 찾을 수 없습니다.`);
            newContent = await response.text();
         }
         mainContent.innerHTML = newContent;

         // --- 2-3-1. 페이지별 모듈 초기화 ---
         if (page === 'dashboard') {
            safeInit(() => initCalendar('mini-calendar'), '📅 대시보드 캘린더');
            safeInit(initMemo, '📝 메모');
            safeInit(initHabitTracker, '📊 습관 트래커');
            safeInit(initTodo, '📝 투두리스트');
            safeInit(initMusicPlayer, '🎶 유튜브 플레이어/재생 컨트롤');
            // SPA 대응: 새 DOM에서 Daily Progress 초기화
            const dailyWidget = document.querySelector(
               '.daily-progress-widget',
            );
            if (dailyWidget) safeInit(initDailyProgress, '📈 오늘 달성률 차트');
         } else if (page === 'calendar') {
            safeInit(() => initCalendar('calendar'), '📅 전체 캘린더');
         } else if (page === 'analytics') {
            safeInit(initAnalytics, '📊 분석 페이지');
         } else if (page === 'music') {
            // 음악 페이지 전용 초기화 (재생 컨트롤)
            safeInit(initMusicPlayer, '🎶 음악 페이지 컨트롤');
         }
      } catch (error) {
         console.error('페이지 로드 에러:', error);
         mainContent.innerHTML = '<h1>❌ 페이지를 불러올 수 없습니다.</h1>';
      }

      mainContent.classList.remove('is-changing');
   };

   // --- 2-4. 내비게이션 클릭 처리 ---
   navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
         e.preventDefault();
         const pageToLoad = e.currentTarget.dataset.page;
         if (e.currentTarget.classList.contains('active')) return;

         // 활성화 상태 전환
         navLinks.forEach((item) => item.classList.remove('active'));
         e.currentTarget.classList.add('active');

         loadPage(pageToLoad);
      });
   });

   // --- 2-5. 모바일 사이드바 토글 ---
   const toggleSidebar = () => {
      body.classList.toggle('sidebar-open');
      const isSidebarOpen = body.classList.contains('sidebar-open');
      hamburgerButton.setAttribute(
         'aria-label',
         isSidebarOpen ? '메뉴 닫기' : '메뉴 열기',
      );
   };
   hamburgerButton.addEventListener('click', toggleSidebar);
   overlay.addEventListener('click', toggleSidebar);
   navLinks.forEach((link) => {
      link.addEventListener('click', () => {
         if (body.classList.contains('sidebar-open')) toggleSidebar();
      });
   });

   // --- 2-6. 초기 로드 시 기본 대시보드 초기화 ---
   safeInit(() => initCalendar('mini-calendar'), '📅 대시보드 캘린더');
   safeInit(initMemo, '📝 메모');
   safeInit(initHabitTracker, '📊 습관 트래커');
   safeInit(initTodo, '📝 투두리스트');

   const dailyWidget = document.querySelector('.daily-progress-widget');
   if (dailyWidget) safeInit(initDailyProgress, '📈 오늘 달성률 차트');

   const music = document.querySelector('.playlist-grid');
   if (music) safeInit(initMusicPlayer, '🎶 음악 페이지 컨트롤');

   console.log('✨ 대시보드 초기화 완료');
});

// --- 3. 안전 실행 유틸 함수 ---
// 모듈 초기화 중 오류 발생해도 앱 중단 방지
function safeInit(fn, name = '모듈') {
   try {
      fn();
      console.log(`${name} 초기화 완료`);
   } catch (err) {
      console.error(`${name} 초기화 오류:`, err);
   }
}
