import React, { useEffect, useState, useRef } from 'react'
import styles from './Encouter.module.css'
import Hearts from './Hearts'

// Reusable dialog component that matches the existing textbox/font style.
export function EncounterDialog({ title, text, choices = [], onClose, titleFontSize, encounterMeta }){
    const [selected, setSelected] = useState(0)
    const [result, setResult] = useState(null) // null | {index, correct}
    const containerRef = useRef(null)

    useEffect(() => {
        function handleKey(e){
            // normalize common key names/codes for Space and Enter across browsers
            const k = e.key;
            const code = e.code;
            const isSpace = code === 'Space' || k === ' ' || k === 'Spacebar' || k === 'Space';
            const isEnter = code === 'Enter' || k === 'Enter';

            // when result is shown, Space/Enter confirms and closes
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
                console.log('[Encounter] keyboard select', encounterMeta, selected, correct);
                setResult({ index: selected, correct })
            }
                if(e.key === 'Escape'){
                e.preventDefault()
                onClose && onClose()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [choices, selected, result, onClose, encounterMeta])

    useEffect(() => {
        // focus container for accessibility
        containerRef.current && containerRef.current.focus()
    }, [])

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50' style={{fontFamily: '"gameboy", "Courier New", Courier, monospace', pointerEvents: 'none'}}>
            <div ref={containerRef} tabIndex={-1} className={`flex flex-col items-center justify-center`} style={{outline: 'none', pointerEvents: 'auto'}}>
                <h4 className={styles.encounterTitle} style={titleFontSize ? {fontSize: titleFontSize, marginBottom: 8} : {marginBottom: 8}}>{title}</h4>
                <div className={`${styles.code} ${styles.broken}`} style={{width: '720px', padding: 16, position: 'relative'}}>
                    {/* main dialog text wrapped so styling can be customized via CSS */}
                    <div className={styles.encounterTextBox} dangerouslySetInnerHTML={{__html: text}} />

                    {/* choice list */}
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
                                    onClick={() => {
                                        if(result) return
                                        const correct = Boolean(c.isCorrect)
                                        console.log('[Encounter] click select', level, i, correct);
                                        setResult({ index: i, correct })
                                    }}
                                    style={{cursor: 'pointer'}}
                                >
                                    <div className={styles.choiceText} style={{padding: '8px 12px'}}>{c.label}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* result overlay inside the encounter box */}
                    {result && (
                        <div className={styles.resultOverlay} role="status">
                            <div className={styles.resultBox} onClick={() => {
                                console.log('[Encounter] confirm result click', level, result.correct);
                                if(window && typeof window.onEncounterResult === 'function'){
                                    try{ window.onEncounterResult(encounterMeta, result.correct); }catch(err){}
                                }
                                onClose && onClose();
                            }}>
                                <div style={{fontSize: 'var(--result-font-size, 96px)', textAlign: 'center'}}>{result.correct ? 'You win!' : 'You lose!'}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Level-specific convenience functions/components
export function LevelOneEncounter(props){
    const choices = [
        { label: 'Approach the glowing altar', isCorrect: false },
        { label: 'Inspect the carved runes', isCorrect: true },
        { label: 'Run back to town', isCorrect: false },
        { label: 'Shout for help', isCorrect: false },
    ]
    return <EncounterDialog level={'level_one'} title={'Level One Encounter'} text={'<p>A mysterious sage blocks your path. Choose your action:</p>'} choices={choices} {...props} />
}

export function LevelTwoEncounter(props){
    const choices = [
        { label: 'Steal the key from the guard', isCorrect: false },
        { label: 'Distract the guard with a joke', isCorrect: true },
        { label: 'Charge the gate', isCorrect: false },
        { label: 'Hide in the shadows', isCorrect: false },
    ]
    return <EncounterDialog level={'level_two'} title={'Level Two Encounter'} text={'<p>A sleepy guard stands watch. What do you do?</p>'} choices={choices} {...props} />
}

export function LevelThreeEncounter(props){
    const choices = [
        { label: 'Challenge the CSS wizard', isCorrect: true },
        { label: 'Offer a truce', isCorrect: false },
        { label: 'Run away', isCorrect: false },
        { label: 'Hide behind a column', isCorrect: false },
    ]
    return <EncounterDialog level={'level_three'} title={'Level Three Encounter'} text={'<p>The final boss awaits. Choose wisely:</p>'} choices={choices} {...props} />
}