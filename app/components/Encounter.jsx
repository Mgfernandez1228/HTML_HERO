import React, { useEffect, useState } from 'react'
import styles from './Encounter.module.css'

const Encounter = ({ player, enemy }) => {
    const brokenLines = [
        '<p>This is a header</p>',
        '<h1>This is a paragraph</h1>',
        '<style> checkSubmission() </style>',
        '<script> h1 { color: green } </script>'
    ]

    const correctCode1 = [
        '<h1>This is a header</h1>',
        '<p>This is a paragraph</p>',
        '<style> h1 { color: green } </style>',
        '<script> checkSubmission() </script>'
    ]

    const correctCode2 = [
        '<h1>This is a header</h1>',
        '<p>This is a paragraph</p>',
        '<script> checkSubmission() </script>',
        '<style> h1 { color: green } </style>'
    ]

    // lines state mirrors the 4 input textareas
    const [lines, setLines] = useState(['', '', '', ''])
    // displayed code lines (for the #code area) and its status class
    const [displayLines, setDisplayLines] = useState(brokenLines)
    const [codeState, setCodeState] = useState('broken') // 'broken' or 'fixed'
    // output messages (array of strings) shown in the output paragraph
    const [outputMsgs, setOutputMsgs] = useState([])

    useEffect(() => {
        // on mount show the broken example
        setDisplayLines(brokenLines)
        setCodeState('broken')
    }, [])

    function handleChange(index, value) {
        const v = (value || '').trim()
        if (v === correctCode1[index] || v === correctCode2[index]) {
            const canonical = v === correctCode1[index] ? correctCode1[index] : correctCode2[index]
            setLines(prev => {
                const copy = [...prev]
                copy[index] = canonical
                return copy
            })
            setDisplayLines(prev => {
                const copy = [...prev]
                copy[index] = canonical
                return copy
            })
        } else {
            setLines(prev => {
                const copy = [...prev]
                copy[index] = value
                return copy
            })
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            checkSubmission()
        }
    }

    function checkSubmission() {
        const userCode1 = lines.map(l => (l || '').trim())
        const flags = userCode1.map((v, i) => v === correctCode1[i] || v === correctCode2[i]) 
        const allCorrect = flags.every(Boolean) && (flags.length === correctCode1.length || flags.length === correctCode2.length); 

            // update displayed code lines: show the matched correct canonical text for lines that are correct,
            // otherwise show the user's submitted text (or '(empty)')
            setDisplayLines(userCode1.map((t, i) => {
                const v = t || ''
                if (v === correctCode1[i]) return correctCode1[i]
                if (v === correctCode2[i]) return correctCode2[i]
                return t || '(empty)'
            }))

        if (allCorrect) {
            setOutputMsgs(['Code has been fixed!'])
            setCodeState('fixed')
        } else {
            const anyCorrect = flags.some(Boolean)
            if (!anyCorrect) {
                setOutputMsgs(['Nope, code is still broken.'])
            } else {
                // for each correct line, push a yellowish message
                const msgs = []
                flags.forEach((ok, idx) => {
                    if (ok) msgs.push(`Line ${idx + 1} is correct!`)
                })
                setOutputMsgs(msgs)
            }
            setCodeState('broken')
        }
    }

    return (
        <div className='fixed inset-0 bg-black/30  flex items-center justify-center z-50'>
            <div className='bg-gray-100 text-black p-8 rounded-2xl border-4 border-gray-700 shadow-2xl flex flex-col items-center justify-center'>
                <h4>Fix me!</h4>
                <div id='code' className={`${styles[codeState]} ${styles.code}`} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginBottom: 8 }}>
                    {displayLines.map((line, i) => (
                        <div key={i} className={`${styles.codeLine} ${((displayLines[i] === correctCode1[i]) || (displayLines[i] === correctCode2[i])) ? styles.correct : styles.wrong}`}>
                            {line}
                        </div>
                    ))}
                </div>

                <form className='flex flex-col gap-4' id='fix-code-1' onSubmit={e => e.preventDefault()}>
                    {[0, 1, 2, 3].map(i => (
                        <div className='flex flex-row justify-center items-center gap-2' key={i}>
                            <label htmlFor={`line-${i + 1}`}>Line {i + 1}:</label>
                                            <textarea className={styles.line}
                                id={`line-${i + 1}`}
                                rows={1}
                                cols={50}
                                value={lines[i]}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    ))}
                </form>

                    <div id='output-1' style={{ marginTop: 12 }}>
                        {outputMsgs.length === 0 ? ' ' : outputMsgs.map((m, idx) => (
                            <div key={idx} className={m.startsWith('Line') ? styles.lineCorrect : (m === 'Code has been fixed!' ? styles.correct : styles.error)}>
                                {m}
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    )
}

export default Encounter