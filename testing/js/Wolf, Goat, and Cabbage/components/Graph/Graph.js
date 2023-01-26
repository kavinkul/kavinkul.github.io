import GraphVertex from './GraphVertex';
import GraphEdge from './GraphEdge';
import objectFilter from '../../utility/ObjectFilter';
import Button from '../Button/Button';
import HelpMessages from '../HelpMessages/HelpMessages';
import useTranslation from '../../hooks/use-translation';
import Checkbox from '../Checkbox/Checkbox';
import useCheckMobile from '../../hooks/use-check-mobile';

const { useEffect, useState } = window.React;

function Graph({ size, chosenValues }) {
    const { translation } = useTranslation();
    const { isMobile } = useCheckMobile();

    const [selectedVertex, setSelectedVertex] = useState(-1);
    const [edgesDrawn, setEdgeDrawn] = useState({});
    const [isHelpShown, setIsHelpShown] = useState(false);
    const [isTouchMarkRed, setIsTouchMarkRed] = useState(false);

    useEffect(() => {
        const updatedEdgesDrawn = () =>
            objectFilter(
                edgesDrawn,
                (obj) => obj.index1 < size && obj.index2 < size
            );

        setEdgeDrawn(updatedEdgesDrawn());

        if (selectedVertex >= size) {
            setSelectedVertex(-1);
        }
        //eslint-disable-next-line
    }, [size]);

    const modifiedChosenValues = [
        ...chosenValues,
        ...Array(size - chosenValues.length).fill('')
    ];

    const generateUniquePairKey = (i, j) => {
        const x = i + 1;
        const y = j + 1;
        return x * y + Math.floor(Math.pow(Math.abs(x - y) - 1, 2) / 4);
    };

    const handleVertexClick = (vertex) => {
        if (selectedVertex === -1) {
            setSelectedVertex(vertex);
        } else {
            if (selectedVertex !== vertex) {
                const newPairKey = generateUniquePairKey(
                    selectedVertex,
                    vertex
                );
                const updateEdgesDrawn = { ...edgesDrawn };
                if (updateEdgesDrawn[newPairKey]?.isDrawn) {
                    updateEdgesDrawn[newPairKey] = {
                        ...updateEdgesDrawn[newPairKey],
                        isDrawn: false
                    };
                } else {
                    updateEdgesDrawn[newPairKey] = {
                        index1: vertex,
                        index2: selectedVertex,
                        isDrawn: true
                    };
                }
                setEdgeDrawn(updateEdgesDrawn);
            }
            setSelectedVertex(-1);
        }
    };

    const vertices = modifiedChosenValues.map((name, index) => {
        return (
            <GraphVertex
                key={index}
                onClick={handleVertexClick}
                name={name}
                index={index}
                size={size}
                isSelected={selectedVertex === index}
                isTouchMarkRed={isTouchMarkRed}
            />
        );
    });

    const onClearClick = () => {
        setEdgeDrawn([]);
    };

    const onCheck = () => {
        setIsTouchMarkRed(!isTouchMarkRed);
    };

    const allEdges = Object.keys(edgesDrawn).map((key) => {
        const edge = edgesDrawn[key];
        return (
            <GraphEdge
                key={key}
                x={edge.index1}
                y={edge.index2}
                size={size}
                displayLine={edge.isDrawn}
            />
        );
    });

    return (
        <div>
            <h4>{translation.Graph.GraphText}</h4>
            <div style={{ textAlign: 'center' }}>
                <div>
                    <svg viewBox="0 0 104 104" fill="none" width="50%">
                        <g>{allEdges}</g>
                        <g transform="translate(52, 52)">{vertices}</g>
                    </svg>
                </div>
                <div>
                    <Button onClick={onClearClick}>
                        {translation.Graph.ClearLinesText}
                    </Button>
                </div>
                {isMobile && (
                    <div>
                        <Checkbox
                            onClick={onCheck}
                            isChecked={isTouchMarkRed}
                            label={translation.Graph.CheckboxText}
                        />
                    </div>
                )}
            </div>
            <Button onClick={() => setIsHelpShown(!isHelpShown)}>
                {translation.HelpText}
            </Button>
            <HelpMessages
                textContent={translation.Graph.HelpMessages}
                isShown={isHelpShown}
            />
        </div>
    );
}

export default Graph;
