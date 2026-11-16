import React, { useEffect, useRef, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);
  const hasChangedToys = useRef(false);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((loadedToys) => {
        if (!hasChangedToys.current) setToys(loadedToys);
      })
      .catch((error) => console.error("Unable to load toys:", error));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleAddToy(toy) {
    const response = await fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toy),
    });
    const newToy = await response.json();
    hasChangedToys.current = true;
    setToys((currentToys) => [...currentToys, newToy]);
  }

  async function handleDeleteToy(toyId) {
    await fetch(`http://localhost:3001/toys/${toyId}`, { method: "DELETE" });
    hasChangedToys.current = true;
    setToys((currentToys) => currentToys.filter((toy) => toy.id !== toyId));
  }

  async function handleLikeToy(toyId, likes) {
    await fetch(`http://localhost:3001/toys/${toyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes }),
    });
    hasChangedToys.current = true;
    setToys((currentToys) =>
      currentToys.map((toy) => (toy.id === toyId ? { ...toy, likes } : toy)),
    );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
