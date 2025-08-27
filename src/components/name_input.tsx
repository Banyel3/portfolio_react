import { useState, createContext, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

export const nameInputContext = createContext<any>(null);

export default function NameInput() {
  const navigate = useNavigate();

  const { setNameInput } = useContext(nameInputContext);

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");

  function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setfirstName(e.target.value);
  }
  function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setlastName(e.target.value);
    setNameInput(true);
  }

  function navigateToHome() {
    setfirstName(firstName);
    setlastName(lastName);
    setNameInput(true);
    localStorage.setItem("username", `${firstName} ${lastName}`);
    firstName == "" || lastName == "" ? (
      <Navigate to="/" replace />
    ) : (
      navigate("/home")
    );
  }

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center h-max w-max">
          <div className="max-w-md">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">What is your name?</legend>
              <>
                <input
                  className="input text-white"
                  value={firstName}
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleFirstNameChange}
                  required
                />
                <input
                  className="input text-white"
                  value={lastName}
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleLastNameChange}
                  required
                />
                <p className="label text-white">Optional</p>
                <button className="btn btn-success" onClick={navigateToHome}>
                  Set Name
                </button>
              </>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}
