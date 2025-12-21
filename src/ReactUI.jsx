import TextBox from "./ReactComponents/TextBox.jsx";
import { useAtom } from 'jotai';
import { encounterAtom, isTextBoxVisibleAtom, heartsAtom} from './store.js';
import { LevelOneEncounter, LevelTwoEncounter, LevelThreeEncounter } from './ReactComponents/Encounter.jsx';
import GameOver from "./ReactComponents/GameOver.jsx";
import { useCallback } from 'react';
import Hearts from "./ReactComponents/Hearts.jsx";
import Joystick from "./ReactComponents/Joystick.jsx";
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
            {encounter === 'level_one' && <LevelOneEncounter onClose={closeEncounterAndRefocus} />}
            {encounter === 'level_two' && <LevelTwoEncounter onClose={closeEncounterAndRefocus} />}
            {encounter === 'level_three' && <LevelThreeEncounter onClose={closeEncounterAndRefocus} />}
            {hearts <= 0 && <GameOver onRestart={restartGame} />}
        </div>
    );
    
}