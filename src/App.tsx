import './css/App.css'
import NavBar from './components/navbar.tsx';
import Hero from './components/hero.tsx';
import About from './components/about_page.tsx';
import Cert from './components/Certifications.tsx'

function App() {
 return <section className='min-h-screen w-full overflow-x-hidden'>
    <NavBar />
    <Hero />
    <About />
    <Cert />
 
 </section>
}

export default App
