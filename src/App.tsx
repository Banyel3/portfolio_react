import "./css/App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar.tsx";
import Hero from "./components/hero.tsx";
import About from "./components/about_page.tsx";
import Cert from "./components/Certifications.tsx";
import Stats from "./components/Stats.tsx";
import Events from "./components/events.tsx";
import Contacts from "./components/Contacts.tsx";
import NameInput, { nameInputContext } from "./components/name_input.tsx";
import { useState } from "react";

function App() {
  const [nameInput, setNameInput] = useState(false);
  return (
    <nameInputContext.Provider value={{ nameInput, setNameInput }}>
      <Routes>
        <Route path="/" element={<NameInput />}></Route>
        <Route
          path="/home"
          element={
            <>
              {nameInput ? (
                <section className="min-h-screen w-full overflow-x-hidden">
                  <NavBar />
                  <Hero />
                  <About />
                  <Cert />
                  <Stats />
                  <Events />
                  <Contacts />
                </section>
              ) : (
                <Navigate to="/" replace />
              )}
            </>
          }
        ></Route>
      </Routes>
    </nameInputContext.Provider>
  );
}

export default App;
