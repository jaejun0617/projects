// js/utils/storage.js

/**
 * localStorage에 데이터를 JSON 형태로 저장하는 함수
 * @param {string} key - 저장할 데이터의 키
 * @param {any} value - 저장할 값 (객체, 배열 등 모든 타입 가능)
 */
export function saveToStorage(key, value) {
   // 객체나 배열을 JSON 문자열로 변환하여 저장
   localStorage.setItem(key, JSON.stringify(value));
}

/**
 * localStorage에서 데이터를 불러오는 함수
 * @param {string} key - 불러올 데이터의 키
 * @returns {any | null} - 저장된 값이 있으면 파싱하여 반환, 없으면 null 반환
 */
export function loadFromStorage(key) {
   const value = localStorage.getItem(key);
   // 저장된 값이 없으면 null을 반환
   if (value === null) {
      return null;
   }
   // JSON 문자열을 원래의 객체나 배열 형태로 파싱하여 반환
   return JSON.parse(value);
}
