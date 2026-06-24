
import {Navbar, Hero, Copy} from "@/components/landing-page";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-18 items-center justify-between text-primary px-4">
            <Navbar />   
        </div>
      </header>

      {/* Content area */}
      <main>
        <Hero />
        {/* <div className="container body mx-auto p-4"> */}
          <Copy />
        {/* </div> */}
      </main>

      <footer>

      </footer>
    </div>
  );
}
