import {useAtom, useAtomValue } from "jotai";
import {textBoxContentAtom, isTextBoxVisibleAtom, mobileButtonAtom } from "../store.js";
import {motion} from "framer-motion";
import "./TextBox.css";
import { useEffect, useState } from "react";

const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.5 },
}

export default function TextBox(){

    const [isVisible, setIsVisible] = useAtom(isTextBoxVisibleAtom);
    const [mobileDown] = useAtom(mobileButtonAtom);
    const [isCloseRequest, setIsCloseRequest] = useState(false);
    const content = useAtomValue(textBoxContentAtom);

    const handleAnimationComplete = () => {
        if(isCloseRequest){
            setIsVisible(false);
            setIsCloseRequest(false);
        }

    };

    useEffect(() =>{
        const closeHandler = (e) => {
            if (!isVisible) return;
            if(e.code === "Space"){
                setIsCloseRequest(true);
            }
        };

        window.addEventListener("keydown",closeHandler);

        return () =>{
            window.removeEventListener("keydown", closeHandler)//cleanup function for no copies
        };

    }, [isVisible, setIsVisible]);

    // Close via mobile ACT button: when mobile button goes down while
    // the text box is visible, trigger close — but respect the game's
    // short "just opened" guard and any mobile consume flag set when opening.
    useEffect(() => {
        if(!isVisible) return;
        try{
            const justOpened = !!(window.__TEXTBOX_JUST_OPENED);
            const consume = !!(window.__MOBILE_CONSUME_PRESS);
            if(mobileDown && !justOpened && !consume){
                setIsCloseRequest(true);
            }
        }catch(e){}
    }, [mobileDown, isVisible]);

    return( 
    isVisible && (
    <motion.div 
        className="text-box" 
        inital={{opacity:0, scale:0.5}} 
        animate={isCloseRequest ? "closed" : "open"}//when player wants to close text
        variants={variants}
        transition={{duration:0.2}}
        onAnimationComplete={handleAnimationComplete}
    >
        <p>{content}</p>
    </motion.div >
        )
    );
}