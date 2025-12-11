import {useAtom, useAtomValue } from "jotai";
import {textBoxContentAtom } from "../store.js";
import {motion} from "framer-motion";
import "./TextBox.css";
import { useEffect, useState } from "react";

const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.5 },
}

export default function TextBox(){

    const [isVisible, setIsVisible] = useAtom(textBoxContentAtom);
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