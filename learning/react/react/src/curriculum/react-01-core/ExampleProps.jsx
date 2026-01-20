function Card({ title, children }) {
   return (
      <div style={{ border: '1px solid #ccc', padding: 12, marginTop: 8 }}>
         <strong>{title}</strong>
         <div>{children}</div>
      </div>
   );
}

export default function ExampleProps() {
   return (
      <div>
         <h3>Props = One-way Data Flow</h3>

         <Card title="첫 번째 카드">
            <p>이 내용은 부모에서 내려온다.</p>
         </Card>

         <Card title="두 번째 카드">
            <button>버튼도 children이다</button>
         </Card>
      </div>
   );
}
