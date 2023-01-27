const { useState } = window.React;
const { useTranslation, SetupTable, Graph, RiverTable } = window.exports;

function App() {
  const [chosenSpecies, setChosenSpecies] = useState([]);
  const [size, setSize] = useState(6);
  const [confirmedSpecies, setConfirmedSpecies] = useState([]);
  const { isLoaded } = useTranslation();

  const handleChange = (species) => {
    const newSpecies = [...species];
    setChosenSpecies(newSpecies);
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleCopy = () => {
    setConfirmedSpecies([...chosenSpecies]);
  };

  const content = isLoaded ? (
    <>
      <SetupTable
        chosenValues={chosenSpecies}
        size={size}
        onChange={handleChange}
        onSizeChange={handleSizeChange}
        onCopy={handleCopy}
      />
      <Graph size={size} chosenValues={chosenSpecies} />
      <RiverTable chosenValues={confirmedSpecies} />
    </>
  ) : (
    "Loading Application..."
  );

  return <div>{content}</div>;
}

export { App };
