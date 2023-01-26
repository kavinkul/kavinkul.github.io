import Option from '../Option/Option';
import Button from '../Button/Button';
import arraysEqual from '../../utility/ArraysEqual';
import HelpMessages from '../HelpMessages/HelpMessages';
import useTranslation from '../../hooks/use-translation';
import useRawIcon from '../../hooks/use-raw-icon';
import ArrowButton from '../Button/ArrowButton';

const { useEffect, useRef, useState } = window.React;

function RiverTable({ chosenValues }) {
    const debug = false;

    const { translation } = useTranslation();
    const { rawGoArrowBoth } = useRawIcon();

    const [startList, setStartList] = useState([]);
    const [finishList, setFinishList] = useState([]);

    const [selectedStartIndex, setSelectedStartIndex] = useState(-1);
    const [selectedFinishIndex, setSelectedFinishIndex] = useState(-1);

    const [isHelpShown, setIsHelpShown] = useState(false);

    const [riverHistory, setRiverHistory] = useState([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
    const [stepToSave, setStepToSave] = useState(1);

    const divStartListEl = useRef();
    const divFinishListEl = useRef();
    const divTransferButton = useRef();

    useEffect(() => {
        const handler = (event) => {
            if (divTransferButton.current.contains(event.target)) {
                return;
            }

            if (!divStartListEl.current.contains(event.target)) {
                setSelectedStartIndex(-1);
            }

            if (!divFinishListEl.current.contains(event.target)) {
                setSelectedFinishIndex(-1);
            }
        };

        document.addEventListener('click', handler, true);

        const cleanUp = () => {
            document.removeEventListener('click', handler);
        };

        return cleanUp;
    }, []);

    useEffect(() => {
        setStartList(chosenValues);
        setFinishList(Array(chosenValues.length).fill(''));
        setCurrentHistoryIndex(0);
        setStepToSave(1);
        setRiverHistory([[chosenValues, Array(chosenValues.length).fill('')]]);
    }, [chosenValues]);

    const handleStartListClick = (item) => {
        const index = chosenValues.indexOf(item);
        if (startList[index] !== '') {
            setSelectedStartIndex(index);
        }
    };

    const handleFinishListClick = (item) => {
        const index = chosenValues.indexOf(item);
        if (finishList[index] !== '') {
            setSelectedFinishIndex(index);
        }
    };

    const handleTransferButtonClick = () => {
        if (selectedStartIndex !== -1) {
            const updatedStartList = [
                ...startList.slice(0, selectedStartIndex),
                '',
                ...startList.slice(selectedStartIndex + 1)
            ];

            const updatedFinishList = [
                ...finishList.slice(0, selectedStartIndex),
                chosenValues[selectedStartIndex],
                ...finishList.slice(selectedStartIndex + 1)
            ];

            setStartList(updatedStartList);
            setFinishList(updatedFinishList);
        } else if (selectedFinishIndex !== -1) {
            const updatedStartList = [
                ...startList.slice(0, selectedFinishIndex),
                chosenValues[selectedFinishIndex],
                ...startList.slice(selectedFinishIndex + 1)
            ];

            const updatedFinishList = [
                ...finishList.slice(0, selectedFinishIndex),
                '',
                ...finishList.slice(selectedFinishIndex + 1)
            ];

            setStartList(updatedStartList);
            setFinishList(updatedFinishList);
        }
    };

    const handleResetClick = () => {
        const updatedStartList = [...chosenValues];
        const updatedFinishList = Array(chosenValues.length).fill('');

        setCurrentHistoryIndex(0);
        setStepToSave(1);
        setStartList(updatedStartList);
        setFinishList(updatedFinishList);
        setRiverHistory([[[...updatedStartList], [...updatedFinishList]]]);
    };

    const MovementEnum = {
        LEFT: -1,
        RIGHT: 1,
        NONE: 0,
        BOTH: 2
    };

    const findMovementDirection = (arr, step) => {
        if (step < 1 || step >= arr.length) {
            return MovementEnum.NONE;
        }

        const previousStep = arr[step - 1][0];
        const atStep = arr[step][0];
        if (arraysEqual(previousStep, atStep)) {
            return MovementEnum.NONE;
        }

        const unmatchedToAt = atStep.filter((ele, index) => {
            return ele !== previousStep[index];
        });

        const emptyStringCount = unmatchedToAt.reduce(
            (acc, ele) => (ele === '' ? acc + 1 : acc),
            0
        );

        if (emptyStringCount === 0) {
            return MovementEnum.LEFT;
        } else if (emptyStringCount === unmatchedToAt.length) {
            return MovementEnum.RIGHT;
        } else {
            return MovementEnum.BOTH;
        }
    };

    const handleSaveStateClick = () => {
        // Before we do literally anything, there should be some values that we can work with.
        if (chosenValues) {
            // Desired behaviors
            // Consider "currentHistory" and "save" indices
            // 1. When save index is equal to the length of the history array, implying that we want to add a new state.
            //    1.1 If new state is the same as the previous, do nothing.
            //    1.2 Otherwise, if the changes are only on the same side as the previous state, rewrite the last history.
            //    1.3 Otherwise, append to the history.
            // 2. When save index is equal to the currentHistory index, implying that we want to modify current history.
            //    2.1 If new state is the same as the step at save index, do nothing.
            //    2.2 Otherwise, if new state is the same as the previous, trim the history to the previous state.
            //    2.3 Otherwise, if new state is in the same manner as (1.2) to the previous state, trim the history to
            //        the previous state and rewrite that.
            //    2.4 Otherwise, replace the current history with new one and remove future states.
            // 3. When currentHistory is 0:
            //    3.1 If state is identical to starting state, nothing happens.
            //    3.2 Otherwise, throw away the rest of the history, then save new state. This is not covered
            //        in 1 when we want to overwrite history at step 1.

            // Due to a somewhat complicated logic, it will be implemented as is.

            // Implements 1
            if (stepToSave === riverHistory.length) {
                if (debug) {
                    console.log('Run:', 1);
                }

                const lastStart = riverHistory[riverHistory.length - 1][0];
                const lastFinish = riverHistory[riverHistory.length - 1][1];

                // Implements 1.1
                if (
                    arraysEqual(lastStart, startList) &&
                    arraysEqual(lastFinish, finishList)
                ) {
                    if (debug) {
                        console.log('Run:', 1.1);
                    }

                    return;
                }

                // Implements 1.2
                // Get movement direction from a reference point of the last step.
                const previousDirection = findMovementDirection(
                    riverHistory,
                    riverHistory.length - 1
                );

                const currentDirection = findMovementDirection(
                    [...riverHistory, [startList, finishList]],
                    riverHistory.length
                );

                if (previousDirection === currentDirection) {
                    if (debug) {
                        console.log('Run:', 1.2);
                    }

                    // This is a ReactJS application. We are not mutating the array here.
                    const updatedRiverHistory = [
                        ...riverHistory.slice(0, riverHistory.length - 1),
                        [[...startList], [...finishList]]
                    ];
                    setRiverHistory(updatedRiverHistory);
                } else {
                    // Implements 1.3
                    if (debug) {
                        console.log('Run:', 1.3);
                    }

                    const updatedRiverHistory = [
                        ...riverHistory,
                        [[...startList], [...finishList]]
                    ];
                    setCurrentHistoryIndex(currentHistoryIndex + 1);
                    setStepToSave(stepToSave + 1);
                    setRiverHistory(updatedRiverHistory);
                }
            } else if (currentHistoryIndex === stepToSave) {
                // Implements 2
                if (debug) {
                    console.log('Run:', 2);
                }

                const currentStart = riverHistory[stepToSave][0];
                const currentFinish = riverHistory[stepToSave][1];

                // Implements 2.1
                if (
                    arraysEqual(currentStart, startList) &&
                    arraysEqual(currentFinish, finishList)
                ) {
                    if (debug) {
                        console.log('Run:', 2.1);
                    }

                    return;
                }

                const previousStart = riverHistory[stepToSave - 1][0];
                const previousFinish = riverHistory[stepToSave - 1][1];

                // Implements 2.2
                if (
                    arraysEqual(previousStart, startList) &&
                    arraysEqual(previousFinish, finishList)
                ) {
                    if (debug) {
                        console.log('Run:', 2.2);
                    }

                    const updatedRiverHistory = [
                        ...riverHistory.slice(0, stepToSave)
                    ];
                    setCurrentHistoryIndex(currentHistoryIndex - 1);
                    setRiverHistory(updatedRiverHistory);
                    return;
                }

                // Implements 2.3

                const previousDirection = findMovementDirection(
                    riverHistory,
                    stepToSave - 1
                );
                if (debug) {
                    console.log('riverHistory:', riverHistory);
                    console.log('Spliced riverHistory:', [
                        ...riverHistory.slice(0, stepToSave),
                        [startList, finishList]
                    ]);
                }
                const currentDirection = findMovementDirection(
                    [
                        ...riverHistory.slice(0, stepToSave),
                        [startList, finishList]
                    ],
                    stepToSave
                );

                if (debug) {
                    console.log('previousDirection:', previousDirection);
                    console.log('currentDirection:', currentDirection);
                }

                if (
                    previousDirection === currentDirection &&
                    previousDirection !== MovementEnum.BOTH &&
                    currentDirection !== MovementEnum.BOTH
                ) {
                    if (debug) {
                        console.log('Run:', 2.3);
                    }
                    // This is a ReactJS application. We are not mutating the array here.

                    // When stepToSave is 1, we should expect that previousDirection is MovementEnum.NONE.
                    // We should not be seeing currentDirection to be MovementEnum.NONE because that would
                    // happen when new state is equal to state 0, but it should have been handled by case
                    // 2.2 meaning stepToSave is at least 2.

                    const updatedRiverHistory = [
                        ...riverHistory.slice(0, stepToSave - 1),
                        [[...startList], [...finishList]]
                    ];

                    setCurrentHistoryIndex(currentHistoryIndex - 1);
                    setRiverHistory(updatedRiverHistory);
                } else {
                    // Implements 2.4

                    const updatedRiverHistory = [
                        ...riverHistory.slice(0, stepToSave),
                        [[...startList], [...finishList]]
                    ];

                    if (debug) {
                        console.log('Run:', 2.4);
                        console.log('updatedRiverHistory', updatedRiverHistory);
                    }

                    setStepToSave(stepToSave + 1);
                    setRiverHistory(updatedRiverHistory);
                }
            } else if (currentHistoryIndex === 0) {
                // Implements 3

                if (debug) {
                    console.log('Run:', 3);
                }

                // Implements 3.1
                if (
                    arraysEqual(riverHistory[0][0], startList) &&
                    arraysEqual(riverHistory[0][1], finishList)
                ) {
                    if (debug) {
                        console.log('Run:', 3.1);
                    }
                    return;
                }

                // Implements 3.2
                if (debug) {
                    console.log('Run:', 3.2);
                }
                const updatedRiverHistory = [
                    ...riverHistory.slice(0, 1),
                    [[...startList], [...finishList]]
                ];

                setCurrentHistoryIndex(currentHistoryIndex + 1);
                setStepToSave(stepToSave + 1);
                setRiverHistory(updatedRiverHistory);
            }
        }
    };

    // Desired behaviors
    // 1. We maintain to states, which step is being shown and what step new state will be saved on for clarity.
    // 2. Show will never be more than Save. If we have a history of length n, then show can be 0 .. n - 1
    //      and Save can be 1 .. n

    const handlePrevStateClick = () => {
        if (currentHistoryIndex <= 0) {
            return;
        } else {
            if (stepToSave > 1) {
                setStepToSave(stepToSave - 1);
            }
            if (stepToSave !== riverHistory.length) {
                const currentHistory = riverHistory[currentHistoryIndex - 1];
                setCurrentHistoryIndex(currentHistoryIndex - 1);
                setStartList([...currentHistory[0]]);
                setFinishList([...currentHistory[1]]);
            }
        }
    };

    const handleNextStateClick = () => {
        if (stepToSave >= riverHistory.length) {
            return;
        } else {
            if (currentHistoryIndex < riverHistory.length - 1) {
                const currentHistory = riverHistory[currentHistoryIndex + 1];
                setCurrentHistoryIndex(currentHistoryIndex + 1);
                setStartList([...currentHistory[0]]);
                setFinishList([...currentHistory[1]]);
            }
            if (currentHistoryIndex !== 0) {
                setStepToSave(stepToSave + 1);
            }
        }
    };

    const specialStyle = (item) => {
        if (stepToSave !== currentHistoryIndex) {
            return {};
        }
        const currentStart = riverHistory[stepToSave][0];
        const currentFinish = riverHistory[stepToSave][1];
        const previousStart = riverHistory[stepToSave - 1][0];
        const previousFinish = riverHistory[stepToSave - 1][1];

        const unmatchedStart = currentStart.filter((ele, index) => {
            return ele !== previousStart[index] && ele !== '';
        });

        const unmatchedFinish = currentFinish.filter((ele, index) => {
            return ele !== previousFinish[index] && ele !== '';
        });

        const changed = [...unmatchedStart, ...unmatchedFinish];

        if (changed.indexOf(item) !== -1) {
            return { background: 'yellow' };
        } else {
            return {};
        }
    };

    return (
        <div>
            <h4>{translation.RiverTable.RiverText}</h4>
            <div className="flexContainer">
                <div className="generalUI noTextHighlight">
                    <div>{translation.RiverTable.StartText}</div>
                    <div>
                        {translation.RiverTable.ShowText} {currentHistoryIndex}
                        <br />
                        {translation.RiverTable.SaveText} {stepToSave}
                    </div>
                    <div>{translation.RiverTable.FinishText}</div>
                    <div ref={divStartListEl}>
                        <Option
                            selected={
                                selectedStartIndex !== -1 &&
                                chosenValues[selectedStartIndex]
                            }
                            onClick={handleStartListClick}
                            items={startList}
                            specialStyleByItemPredicate={specialStyle}
                        />
                    </div>
                    <div>
                        <ArrowButton
                            ref={divTransferButton}
                            rawImageString={rawGoArrowBoth}
                            onClick={handleTransferButtonClick}
                        />
                    </div>
                    <div ref={divFinishListEl}>
                        <Option
                            selected={
                                selectedFinishIndex !== -1 &&
                                chosenValues[selectedFinishIndex]
                            }
                            onClick={handleFinishListClick}
                            items={finishList}
                            specialStyleByItemPredicate={specialStyle}
                        />
                    </div>
                    <div style={{ gridColumn: '1 / span 3' }}>
                        <Button onClick={handleResetClick}>
                            {translation.RiverTable.ResetText}
                        </Button>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <Button onClick={handlePrevStateClick}>
                            {translation.RiverTable.PrevStateText}
                        </Button>
                    </div>
                    <div>
                        <Button onClick={handleSaveStateClick}>
                            {translation.RiverTable.SaveStateText}
                        </Button>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button onClick={handleNextStateClick}>
                            {translation.RiverTable.NextStateText}
                        </Button>
                    </div>
                </div>
            </div>
            <Button onClick={() => setIsHelpShown(!isHelpShown)}>
                {translation.HelpText}
            </Button>
            <HelpMessages
                textContent={translation.RiverTable.HelpMessages}
                isShown={isHelpShown}
            />
        </div>
    );
}

export default RiverTable;
