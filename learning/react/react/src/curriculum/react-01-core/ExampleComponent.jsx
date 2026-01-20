function Header() {
   return <header>Header 영역</header>;
}

function Content() {
   return <main>Content 영역</main>;
}

export default function ExampleComponent() {
   return (
      <div>
         <h3>Component = Structure Unit</h3>

         <Header />
         <Content />
      </div>
   );
}
