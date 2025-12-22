import React, { useEffect, useState, useRef } from 'react'
import styles from './Encouter.module.css'

export function EncounterDialog({ title, text, choices = [], onClose, titleFontSize, encounterMeta }){
    const [selected, setSelected] = useState(0)
    const [result, setResult] = useState(null)
    const containerRef = useRef(null)

    // Helper to safely get level name for logging
    const levelName = encounterMeta?.level || 'unknown';

    useEffect(() => {
        function handleKey(e){
            const k = e.key;
            const code = e.code;
            const isSpace = code === 'Space' || k === ' ' || k === 'Spacebar' || k === 'Space';
            const isEnter = code === 'Enter' || k === 'Enter';

            if(result){
                if(isSpace || isEnter){
                    e.preventDefault();
                    if(window && typeof window.onEncounterResult === 'function'){
                        try{ window.onEncounterResult(encounterMeta, result.correct); }catch(err){}
                    }
                    onClose && onClose();
                }
                return;
            }

            if(e.key === 'ArrowUp'){
                e.preventDefault()
                setSelected(s => (s - 1 + choices.length) % choices.length)
            }
            if(e.key === 'ArrowDown'){
                e.preventDefault()
                setSelected(s => (s + 1) % choices.length)
            }
            if(isSpace || isEnter){
                e.preventDefault()
                const correct = Boolean(choices[selected] && choices[selected].isCorrect)
                // FIXED: Using encounterMeta instead of undefined 'level'
                console.log('[Encounter] keyboard select', levelName, selected, correct);
                setResult({ index: selected, correct })
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [choices, selected, result, onClose, encounterMeta, levelName])

    useEffect(() => {
        containerRef.current && containerRef.current.focus()
    }, [])

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50' style={{fontFamily: '"gameboy", "Courier New", Courier, monospace', pointerEvents: 'none'}}>
            <div ref={containerRef} tabIndex={-1} className={`flex flex-col items-center justify-center`} style={{outline: 'none', pointerEvents: 'auto'}}>
                <h4 className={styles.encounterTitle} style={titleFontSize ? {fontSize: titleFontSize, marginBottom: 8} : {marginBottom: 8}}>{title}</h4>
                <div className={`${styles.code} ${styles.broken}`} style={{width: '720px', padding: 16, position: 'relative'}}>
                    <div className={styles.encounterTextBox} dangerouslySetInnerHTML={{__html: text}} />

                    <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8}}>
                        {choices.map((c, i) => {
                            const isSelected = selected === i
                            let cls = styles.choice
                            if(result && result.index === i){
                                cls += result.correct ? ` ${styles.highlightGreen}` : ` ${styles.highlightRed}`
                            } else if(isSelected){
                                cls += ` ${styles.highlightYellow}`
                            }
                            return (
                                <div
                                    key={i}
                                    className={cls}
                                    onMouseEnter={() => !result && setSelected(i)}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stop event from bubbling to window listeners
                                        if(result) return
                                        const correct = Boolean(c.isCorrect)
                                        // FIXED: Changed 'level' to 'levelName'
                                        console.log('[Encounter] click select', levelName, i, correct);
                                        setResult({ index: i, correct })
                                    }}
                                    style={{cursor: 'pointer', touchAction: 'manipulation'}}
                                >
                                    <div className={styles.choiceText} style={{padding: '8px 12px'}}>{c.label}</div>
                                </div>
                            )
                        })}
                    </div>

                    {result && (
                        <div className={styles.resultOverlay} role="status">
                            <div className={styles.resultBox} onClick={(e) => {
                                e.stopPropagation();
                                // FIXED: Changed 'level' to 'levelName'
                                console.log('[Encounter] confirm result click', levelName, result.correct);
                                if(window && typeof window.onEncounterResult === 'function'){
                                    try{ window.onEncounterResult(encounterMeta, result.correct); }catch(err){}
                                }
                                onClose && onClose();
                            }}>
                                <div style={{fontSize: 'var(--result-font-size, 96px)', textAlign: 'center'}}>
                                    {result.correct ? 'You win!' : 'You lose!'}
                                </div>
                                <div style={{fontSize: '24px', textAlign: 'center', marginTop: '10px'}}>
                                    (Tap to Continue)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Fixed the Level specific components to pass the correct encounterMeta
export function LevelOneEncounter(props){
    const choices = [
        { label: 'Approach the glowing altar', isCorrect: false },
        { label: 'Inspect the carved runes', isCorrect: true },
        { label: 'Run back to town', isCorrect: false },
        { label: 'Shout for help', isCorrect: false },
    ]
    return <EncounterDialog encounterMeta={{level: 'level_one'}} title={'Level One Encounter'} text={'<p>A mysterious sage blocks your path. Choose your action:</p>'} choices={choices} {...props} />
}

export function LevelTwoEncounter(props){
    const choices = [
        { label: 'Steal the key from the guard', isCorrect: false },
        { label: 'Distract the guard with a joke', isCorrect: true },
        { label: 'Charge the gate', isCorrect: false },
        { label: 'Hide in the shadows', isCorrect: false },
    ]
    // Crucial for Level 2: Passing the step info through props/encounterMeta
    return <EncounterDialog encounterMeta={{level: 'level_two', step: props.step || 0}} title={'Level Two Encounter'} text={'<p>A sleepy guard stands watch. What do you do?</p>'} choices={choices} {...props} />
}

export function LevelThreeEncounter(props){
    const choices = [
        { label: 'Challenge the CSS wizard', isCorrect: true },
        { label: 'Offer a truce', isCorrect: false },
        { label: 'Run away', isCorrect: false },
        { label: 'Hide behind a column', isCorrect: false },
    ]
    return <EncounterDialog encounterMeta={{level: 'level_three'}} title={'Level Three Encounter'} text={'<p>The final boss awaits. Choose wisely:</p>'} choices={choices} {...props} />
}