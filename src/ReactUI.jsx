import TextBox from "./ReactComponents/TextBox.jsx";
import { useAtom } from 'jotai';
import { encounterAtom, isTextBoxVisibleAtom, heartsAtom} from './store.js';
import { EncounterDialog } from './ReactComponents/Encounter.jsx';
import levelOneData from './encounters/level_one.js';
import levelTwoData from './encounters/level_two.js';
import levelThreeData from './encounters/level_three.js';
import GameOver from "./ReactComponents/GameOver.jsx";
import { useCallback } from 'react';
import Hearts from "./ReactComponents/Hearts.jsx";
import Joystick from "./ReactComponents/Joystick.jsx";
import ActionButton from "./ReactComponents/ActionButton.jsx";
import RotateDevice from "./ReactComponents/RotateDevice.jsx";


export default function ReactUI() {
    const [encounter, setEncounter] = useAtom(encounterAtom);
    const [, setTextVisible] = useAtom(isTextBoxVisibleAtom);
    const [hearts, setHearts] = useAtom(heartsAtom);

    const closeEncounter = useCallback(() => {
        setEncounter(null);
        setTextVisible(false);
    }, [setEncounter]);

    // ensure keyboard focus returns to the game canvas so kaplay receives key events
    const closeEncounterAndRefocus = useCallback(() => {
        closeEncounter();
        try{
            const game = document.getElementById('game');
            if(game){
                // make focusable briefly then focus
                game.tabIndex = -1;
                game.focus();
            }
        }catch(e){}
    }, [closeEncounter]);

    const restartGame = useCallback(() => {
        setHearts(3);
        setEncounter(null);
        setTextVisible(false);

        // reload the game scene cleanly
        try {
            window.location.reload();
        } catch (e) {}
    }, []);


    return(
        <div>
            <RotateDevice />
            <Hearts/>
            <TextBox />
            <Joystick />
            <ActionButton />
            {/* New: encounter can be a string (legacy) or an object { level, step } */}
            {encounter && typeof encounter === 'string' && encounter === 'level_one' && (
                <EncounterDialog encounterMeta={{ level: 'level_one', step: 0 }} title={levelOneData[0].title} text={levelOneData[0].text} choices={levelOneData[0].choices} onClose={closeEncounterAndRefocus} />
            )}
            {encounter && typeof encounter === 'object' && encounter.level === 'level_one' && (
                (() => {
                    // support multi-encounter payloads ({ encounters: [{steps:[..]}], encounterIdx, questionIdx })
                    if(Array.isArray(encounter.encounters)){
                        const encIdx = typeof encounter.encounterIdx === 'number' ? encounter.encounterIdx : 0;
                        const qIdx = typeof encounter.questionIdx === 'number' ? encounter.questionIdx : 0;
                        const encPayload = encounter.encounters[encIdx] || { steps: [] };
                        const stepIndex = (encPayload.steps && encPayload.steps[qIdx] != null) ? encPayload.steps[qIdx] : 0;
                        const data = levelOneData[stepIndex] || levelOneData[0];
                        return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                    }
                    const step = encounter.step || 0;
                    const data = levelOneData[step] || levelOneData[0];
                    return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                })()
            )}

            {encounter && typeof encounter === 'string' && encounter === 'level_two' && (
                <EncounterDialog encounterMeta={{ level: 'level_two', step: 0 }} title={levelTwoData[0].title} text={levelTwoData[0].text} choices={levelTwoData[0].choices} onClose={closeEncounterAndRefocus} />
            )}
            {encounter && typeof encounter === 'object' && encounter.level === 'level_two' && (
                (() => {
                    if(Array.isArray(encounter.encounters)){
                        const encIdx = typeof encounter.encounterIdx === 'number' ? encounter.encounterIdx : 0;
                        const qIdx = typeof encounter.questionIdx === 'number' ? encounter.questionIdx : 0;
                        const encPayload = encounter.encounters[encIdx] || { steps: [] };
                        const stepIndex = (encPayload.steps && encPayload.steps[qIdx] != null) ? encPayload.steps[qIdx] : 0;
                        const data = levelTwoData[stepIndex] || levelTwoData[0];
                        return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                    }
                    const step = typeof encounter.step === 'number' ? encounter.step : 0;
                    const data = levelTwoData[step] || levelTwoData[0];
                    return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                })()
            )}

            {encounter && typeof encounter === 'string' && encounter === 'level_three' && (
                <EncounterDialog encounterMeta={{ level: 'level_three', step: 0 }} title={levelThreeData[0].title} text={levelThreeData[0].text} choices={levelThreeData[0].choices} onClose={closeEncounterAndRefocus} />
            )}
            {encounter && typeof encounter === 'object' && encounter.level === 'level_three' && (
                (() => {
                    if(Array.isArray(encounter.encounters)){
                        const encIdx = typeof encounter.encounterIdx === 'number' ? encounter.encounterIdx : 0;
                        const qIdx = typeof encounter.questionIdx === 'number' ? encounter.questionIdx : 0;
                        const encPayload = encounter.encounters[encIdx] || { steps: [] };
                        const stepIndex = (encPayload.steps && encPayload.steps[qIdx] != null) ? encPayload.steps[qIdx] : 0;
                        const data = levelThreeData[stepIndex] || levelThreeData[0];
                        return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                    }
                    const step = typeof encounter.step === 'number' ? encounter.step : 0;
                    const data = levelThreeData[step] || levelThreeData[0];
                    return <EncounterDialog encounterMeta={encounter} title={data.title} text={data.text} choices={data.choices} onClose={closeEncounterAndRefocus} />
                })()
            )}
            {hearts <= 0 && <GameOver onRestart={restartGame} />}
        </div>
    );
    
}