/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Memo 모듈 ✨
 * ===================================================================================
 *
 * 역할:
 *  - 대시보드 메모 관리
 *  - textarea 입력 내용 실시간 LocalStorage 저장
 *  - 페이지 로드 시 저장된 메모 복원
 *
 * 핵심 구조:
 *  - memoTextarea: textarea DOM 요소
 *  - 저장/로드 키: 'memoContent'
 *  - 입력 이벤트는 중복 등록 방지
 *
 * SPA/실시간 업데이트 포인트:
 *  - 입력 시 바로 저장 → 다른 모듈에서 데이터 참조 가능
 * ===================================================================================
 */

import { saveToStorage, loadFromStorage } from '../utils/storage.js';

export function initMemo() {
   // -------------------- 1️⃣ DOM 요소 가져오기 --------------------
   const memoTextarea = document.getElementById('memo-textarea');
   if (!memoTextarea) return; // 요소 없으면 종료

   // -------------------- 2️⃣ 저장된 메모 불러오기 --------------------
   memoTextarea.value = loadFromStorage('memoContent') || '';

   // -------------------- 3️⃣ 입력 이벤트 바인딩 --------------------
   const onInput = () => saveToStorage('memoContent', memoTextarea.value);
   memoTextarea.removeEventListener('input', onInput); // 중복 방지
   memoTextarea.addEventListener('input', onInput);
}
