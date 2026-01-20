export default function ExampleJSX() {
   const isLoggedIn = true;
   const count = 3;

   return (
      <div>
         <h3>JSX = Expression</h3>

         <p>{isLoggedIn ? '로그인 상태' : '비로그인 상태'}</p>
         <p>현재 개수: {count + 1}</p>

         {count > 2 && <p>count는 2보다 크다</p>}
      </div>
   );
}
