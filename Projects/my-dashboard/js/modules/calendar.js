/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Calendar 모듈 ✨
 * ===================================================================================
 *
 * 역할:
 *  - FullCalendar를 활용하여 대시보드 / 전체 캘린더 관리
 *  - 미니 캘린더와 전체 캘린더 구분
 *  - 이벤트 추가, 삭제, 드래그, 리사이즈 지원
 *  - 이벤트는 LocalStorage에 저장
 *  - 월 제목은 "9월 / Sep" 형식으로 커스터마이징
 *
 * 핵심 구조:
 *  - calendarId: 렌더링할 캘린더 DOM id
 *  - storageKey: 이벤트 저장용 LocalStorage 키
 *  - customizeTitle: 월 제목 커스터마이징 함수
 *  - saveAllEvents: 변경된 이벤트 저장 함수
 *  - calendarOptions: FullCalendar 옵션 객체
 * ===================================================================================
 */

import { saveToStorage, loadFromStorage } from '../utils/storage.js';

/**
 * [메인 함수] 캘린더 초기화
 * @param {string} calendarId - 렌더링할 캘린더 DOM id
 */
export function initCalendar(calendarId) {
   // -------------------- 1️⃣ DOM 요소 가져오기 --------------------
   const calendarEl = document.getElementById(calendarId);
   if (!calendarEl) return; // DOM 요소 없으면 종료

   // -------------------- 2️⃣ 로컬 스토리지에서 이벤트 불러오기 --------------------
   const storageKey = 'calendarEvents';
   const savedEvents = loadFromStorage(storageKey) || [];

   // -------------------- 3️⃣ 월 제목 커스터마이징 --------------------
   const monthNamesKo = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
   ];
   const monthNamesEn = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ];

   /**
    * 월 제목 커스터마이징 함수
    * @param {object} info - FullCalendar datesSet info 객체
    * @param {HTMLElement} targetEl - 캘린더 DOM
    */
   const customizeTitle = (info, targetEl) => {
      const currentMonth = info.view.currentStart.getMonth();
      const titleEl = targetEl.querySelector('.fc-toolbar-title');
      if (titleEl) {
         titleEl.textContent = `${monthNamesKo[currentMonth]} / ${monthNamesEn[currentMonth]}`;
      }
   };

   // -------------------- 4️⃣ 캘린더 인스턴스 & 이벤트 저장 --------------------
   let calendar; // 캘린더 인스턴스 참조

   /**
    * 모든 이벤트를 LocalStorage에 저장
    */
   const saveAllEvents = () => {
      if (!calendar) return;
      const allEvents = calendar.getEvents().map((e) => ({
         title: e.title,
         start: e.startStr,
         end: e.endStr || null,
      }));
      saveToStorage(storageKey, allEvents);
   };

   // -------------------- 5️⃣ FullCalendar 옵션 구성 --------------------
   let calendarOptions = {
      initialView: 'dayGridMonth',
      locale: 'ko',
      events: savedEvents,
   };

   if (calendarId === 'mini-calendar') {
      // --- 미니 캘린더 옵션 ---
      calendarOptions = {
         ...calendarOptions,
         headerToolbar: { left: 'prev', center: 'title', right: 'next' },
         height: '100%',
         editable: true,
         selectable: true,
         dayCellContent: (arg) => ({ html: arg.date.getDate() }),
         datesSet: (info) => customizeTitle(info, calendarEl),
         dateClick(info) {
            const title = prompt('일정을 등록하세요:');
            if (title && calendar) {
               calendar.addEvent({ title, start: info.dateStr });
               saveAllEvents();
            }
         },
         eventClick(info) {
            if (confirm(`'${info.event.title}' 일정을 삭제할까요?`)) {
               info.event.remove();
               saveAllEvents();
            }
         },
         eventDrop: saveAllEvents,
      };
   } else {
      // --- 전체 캘린더 옵션 ---
      calendarOptions = {
         ...calendarOptions,
         headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek',
         },
         height: '850px',
         expandRows: true,
         navLinks: true,
         nowIndicator: true,
         dayMaxEvents: true,
         editable: true,
         selectable: true,
         dayCellContent: (arg) => ({ html: arg.date.getDate() }),
         datesSet: (info) => customizeTitle(info, calendarEl),
         dateClick(info) {
            const title = prompt('일정을 등록하세요:');
            if (title && calendar) {
               calendar.addEvent({ title, start: info.dateStr });
               saveAllEvents();
            }
         },
         eventClick(info) {
            if (confirm(`'${info.event.title}' 일정을 삭제할까요?`)) {
               info.event.remove();
               saveAllEvents();
            }
         },
         eventDrop: saveAllEvents,
         eventResize: saveAllEvents,
      };
   }

   // -------------------- 6️⃣ FullCalendar 인스턴스 생성 및 렌더링 --------------------
   calendar = new FullCalendar.Calendar(calendarEl, calendarOptions);
   calendar.render();
}
