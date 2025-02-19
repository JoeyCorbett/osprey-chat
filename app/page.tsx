import NavMenu from '../components/nav-menu'
import LandingPage from '../components/landing-page'

export default function Home() {
  return (
    <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="gap-8 row-start-2">
        <LandingPage />
      </main>
    </div>
  );
}
