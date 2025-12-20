import TextBox from "./ReactComponents/TextBox.jsx";
import { useAtom } from 'jotai';
import { encounterAtom, isTextBoxVisibleAtom } from './store.js';
import { LevelOneEncounter, LevelTwoEncounter, LevelThreeEncounter } from './ReactComponents/Encounter.jsx';
import { useCallback } from 'react';

export default function ReactUI() {
    const [encounter, setEncounter] = useAtom(encounterAtom);
    const [, setTextVisible] = useAtom(isTextBoxVisibleAtom);

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

    return(
        <div>
            <TextBox />
            {encounter === 'level_one' && <LevelOneEncounter onClose={closeEncounterAndRefocus} />}
            {encounter === 'level_two' && <LevelTwoEncounter onClose={closeEncounterAndRefocus} />}
            {encounter === 'level_three' && <LevelThreeEncounter onClose={closeEncounterAndRefocus} />}
        </div>
    );
    
}