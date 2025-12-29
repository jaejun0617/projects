/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Time Manager 모듈 ✨
 * ===================================================================================
 *
 * 역할:
 *  - 상단 시계, 날짜, 요일 표시
 *  - 시간대별 배경 적용 (morning / afternoon / evening / night)
 *  - 시간대별 랜덤 인사말 표시
 *  - 사용자 이름 표시
 *
 * 핵심 구조:
 *  - tick(): 1초마다 시계, 날짜, 인사말, 배경 업데이트
 *  - getTimeOfDay(hour): 현재 시간대 계산
 *  - initTimeManager(): 외부 호출용 초기화 함수
 *
 * SPA/실시간 업데이트 포인트:
 *  - 1초마다 DOM 실시간 갱신
 *  - 시간대 변경 감지 후 인사말/배경 적용
 * ===================================================================================
 */

// -------------------- 1️⃣ DOM 요소 --------------------
const currentTime = document.querySelector('#clock'); // 시계
const currentDate = document.querySelector('#date'); // 날짜/요일
const greetingWelcome = document.querySelector('#welcome-greeting'); // 인사말
const bodyImage = document.body; // 배경 적용용

// -------------------- 2️⃣ 상태 변수 --------------------
const userName = 'Shin, JaeJun!'; // 사용자 이름
let lastCheckedHour = -1; // 시간대 변경 체크

// -------------------- 3️⃣ 시간대 계산 --------------------
function getTimeOfDay(hour) {
   if (hour >= 5 && hour < 12) return 'morning';
   if (hour >= 12 && hour < 18) return 'afternoon';
   if (hour >= 18 && hour < 22) return 'evening';
   return 'night';
}

// -------------------- 4️⃣ 메인 업데이트 함수 --------------------
function tick() {
   const now = new Date();
   const hour = now.getHours();
   const minutes = now.getMinutes();
   const seconds = now.getSeconds();

   // --- 4-1. 시계 업데이트 (12시간제, AM/PM) ---
   let displayHour = hour % 12 || 12;
   const timePeriod = hour >= 12 ? 'PM' : 'AM';
   currentTime.textContent = `${timePeriod} ${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

   // --- 4-2. 날짜 및 요일 업데이트 ---
   const year = now.getFullYear();
   const month = now.getMonth() + 1;
   const date = now.getDate();
   const daysOfWeek = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
   ];
   currentDate.textContent = `${year}년 ${month}월 ${date}일 ${daysOfWeek[now.getDay()]}`;

   // --- 4-3. 시간대 변경 시 인사말 & 배경 ---
   if (hour !== lastCheckedHour) {
      lastCheckedHour = hour;
      const timeOfDay = getTimeOfDay(hour);

      // 시간대별 메시지
      let greetingText = '';
      let messages = [];

      switch (timeOfDay) {
         case 'morning':
            greetingText = 'Good Morning,';
            messages = [
               '오늘도 활기찬 하루를 시작해 보세요!',
               '좋은 아침입니다! 커피 한 잔 어때요?',
               '새로운 하루, 새로운 가능성이 당신을 기다려요.',
            ];
            break;
         case 'afternoon':
            greetingText = 'Good Afternoon,';
            messages = [
               '나른한 오후, 잠시 스트레칭으로 활력을 되찾으세요.',
               '맛있는 점심 드셨나요? 오후도 화이팅!',
               '목표를 향해 순항하고 계신가요?',
            ];
            break;
         case 'evening':
            greetingText = 'Good Evening,';
            messages = [
               '오늘 하루도 수고 많으셨습니다.',
               '편안한 저녁 시간을 보내며 하루를 마무리하세요.',
               '내일을 위한 재충전의 시간을 가져보세요.',
            ];
            break;
         case 'night':
            greetingText = 'Good Night,';
            messages = [
               '이제 모든 것을 잊고 편안한 밤 되세요.',
               '좋은 꿈 꾸세요, 내일 만나요!',
               '고요한 밤, 평온이 당신과 함께하기를.',
            ];
            break;
      }

      const randomMessage =
         messages[Math.floor(Math.random() * messages.length)];
      greetingWelcome.textContent = `${greetingText} ${userName} ${randomMessage}`;

      bodyImage.classList.remove('morning', 'afternoon', 'evening', 'night');
      bodyImage.classList.add(timeOfDay);
   }
}

// -------------------- 5️⃣ 초기화 --------------------
export function initTimeManager() {
   tick(); // 초기 실행
   setInterval(tick, 1000); // 1초마다 업데이트
}
