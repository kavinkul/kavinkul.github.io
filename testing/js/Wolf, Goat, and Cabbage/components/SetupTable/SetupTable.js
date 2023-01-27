const { useEffect, useState, useRef } = window.React;
const {
  useRawIcon,
  useTranslation,
  Option,
  Button,
  HelpMessages,
  ArrowButton,
} = window.exports;

function SetupTable({ chosenValues, size, onChange, onSizeChange, onCopy }) {
  const { translation } = useTranslation();
  const { rawGoArrowBoth, rawGoArrowUp, rawGoArrowDown } = useRawIcon();

  const [selectedLeftOption, setSelectedLeftOption] = useState(null);
  const [selectedRightOption, setSelectedRightOption] = useState(null);

  const [isHelpShown, setIsHelpShown] = useState(false);
  const [defaultList, setDefaultList] = useState([]);

  const divLeftOptionEl = useRef();
  const divRightOptionEl = useRef();
  const divArrowEl = useRef();
  const upArrowEl = useRef();
  const downArrowEl = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (
        divArrowEl.current.contains(event.target) ||
        upArrowEl.current.contains(event.target) ||
        downArrowEl.current.contains(event.target)
      ) {
        return;
      }

      if (!divLeftOptionEl.current.contains(event.target)) {
        setSelectedLeftOption(null);
      }

      if (!divRightOptionEl.current.contains(event.target)) {
        setSelectedRightOption(null);
      }
    };

    document.addEventListener("click", handler, true);

    const cleanUp = () => {
      document.removeEventListener("click", handler);
    };

    return cleanUp;
  }, []);

  useEffect(() => {
    const animalList = translation.SetupTable.AnimalList;
    const requiedKeys = [
      "Bear",
      "Berry",
      "Cabbage",
      "Carrot",
      "Cat",
      "Chicken",
      "Corn",
      "Dog",
      "Duck",
      "Earthworm",
      "Fish",
      "Fox",
      "Goat",
      "Goose",
      "Grass",
      "Horse",
      "Kiwi",
      "Mouse",
      "Rabbit",
      "Rice",
      "Seeds",
      "Wolf",
    ];

    let newDefaultList = null;

    // Here, we will throw an error if translators do not translate all species.

    newDefaultList = requiedKeys.map((animal) => {
      if (animalList.hasOwnProperty(animal)) {
        return animalList[animal];
      } else {
        throw `${animal} is not in the translation config.`;
      }
    });

    newDefaultList.sort();
    setDefaultList(newDefaultList);
    setLeftOptions(newDefaultList);
  }, [translation.SetupTable.AnimalList]);

  const [leftOptions, setLeftOptions] = useState(defaultList);

  const handleRightOptionChange = (valuesArr) => {
    onChange(valuesArr);
  };

  const handleLeftOptionClick = (item) => {
    setSelectedLeftOption(item);
  };

  const handleRightOptionClick = (item) => {
    setSelectedRightOption(item);
  };

  const handleSwapButtonClick = () => {
    if (selectedLeftOption && chosenValues.length < size) {
      const updatedLeftOption = leftOptions.filter((option) => {
        return option !== selectedLeftOption;
      });

      const updatedChosenValues = [...chosenValues, selectedLeftOption];

      setLeftOptions(updatedLeftOption);
      handleRightOptionChange(updatedChosenValues);
      setSelectedLeftOption(null);
    } else if (selectedRightOption) {
      const updatedChosenValues = chosenValues.filter((value) => {
        return value !== selectedRightOption;
      });

      const updatedLeftOption = [...leftOptions, selectedRightOption];

      updatedLeftOption.sort();

      setLeftOptions(updatedLeftOption);
      handleRightOptionChange(updatedChosenValues);
      setSelectedRightOption(null);
    }
  };

  const handleUpDownButtonClick = (isDown) => {
    if (!selectedRightOption) {
      return;
    }
    const index = chosenValues.indexOf(selectedRightOption);
    const newIndex = isDown
      ? index !== chosenValues.length - 1 // index is not last?
        ? index + 1 // move index down
        : index // do not change
      : index !== 0 // index is not first?
      ? index - 1 // move index up
      : index; // do not change

    const removedArray = chosenValues.filter((item, currentIndex) => {
      return currentIndex !== index;
    });

    const updatedOptions = [
      ...removedArray.slice(0, newIndex),
      selectedRightOption,
      ...removedArray.slice(newIndex),
    ];

    handleRightOptionChange(updatedOptions);
  };

  const handleClearButtonClick = () => {
    setSelectedLeftOption(null);
    setSelectedRightOption(null);
    setLeftOptions(defaultList);
    handleRightOptionChange([]);
  };

  const handleSizeButtonsClick = (newSize) => {
    if (chosenValues.length > newSize) {
      const updatedChosenValues = chosenValues.slice(0, newSize);
      const slicedValues = chosenValues.slice(newSize);
      const updatedLeftOption = [...leftOptions, ...slicedValues];
      updatedLeftOption.sort();
      setLeftOptions(updatedLeftOption);
      handleRightOptionChange(updatedChosenValues);
    }
    setSelectedLeftOption(null);
    setSelectedRightOption(null);
    onSizeChange(newSize);
  };

  return (
    <div>
      <h4>{translation.SetupTable.SetupText}</h4>
      <div className="flexContainer">
        <div className="generalUI noTextHighlight">
          <div className="leftCol">
            {translation.SetupTable.AllCreaturesText}
          </div>
          <div className="rightCol">
            {translation.SetupTable.CreaturesPresentText}
          </div>
          <div ref={divLeftOptionEl}>
            <Option
              onClick={handleLeftOptionClick}
              selected={selectedLeftOption}
              items={leftOptions}
            />
          </div>
          <div>
            <ArrowButton
              ref={divArrowEl}
              rawImageString={rawGoArrowBoth}
              onClick={handleSwapButtonClick}
            />
          </div>
          <div ref={divRightOptionEl}>
            <Option
              onClick={handleRightOptionClick}
              selected={selectedRightOption}
              items={chosenValues}
            />
          </div>
          <div>
            <label style={{ color: "white" }}>
              {translation.SetupTable.SizeText}
            </label>
            <div>
              <Button
                onClick={() => handleSizeButtonsClick(6)}
                style={size === 6 && { background: "#00ccff" }}
              >
                6
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleSizeButtonsClick(7)}
                style={size === 7 && { background: "#00ccff" }}
              >
                7
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleSizeButtonsClick(8)}
                style={size === 8 && { background: "#00ccff" }}
              >
                8
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleSizeButtonsClick(9)}
                style={size === 9 && { background: "#00ccff" }}
              >
                9
              </Button>
            </div>
          </div>
          <div>
            <Button onClick={handleClearButtonClick}>
              {translation.SetupTable.ClearButtonText}
            </Button>
          </div>
          <div>
            <div style={{ marginBottom: "30%" }}>
              <ArrowButton
                ref={upArrowEl}
                rawImageString={rawGoArrowUp}
                style={{ marginRight: "10%" }}
                onClick={() => handleUpDownButtonClick(false)}
              />
              <ArrowButton
                ref={downArrowEl}
                rawImageString={rawGoArrowDown}
                onClick={() => handleUpDownButtonClick(true)}
              />
            </div>
            <div>
              <Button onClick={onCopy}>
                {translation.SetupTable.CopyButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={() => setIsHelpShown(!isHelpShown)}>
        {translation.HelpText}
      </Button>
      <HelpMessages
        textContent={translation.SetupTable.HelpMessages}
        isShown={isHelpShown}
      />
    </div>
  );
}

export { SetupTable };
