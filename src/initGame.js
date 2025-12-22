import initKaplay from "./kaplayCtx";
import { isTextBoxVisibleAtom, store, textBoxContentAtom, encounterAtom, heartsAtom, joystickAtom, mobileButtonAtom} from "./store";
import levelOneEncounters, { npcIntro as levelOneIntro, passiveDialog as levelOnePassive } from "./encounters/level_one";
import levelTwoEncounters, { npcIntro as levelTwoIntro, passiveDialog as levelTwoPassive } from "./encounters/level_two";
import levelThreeEncounters, { npcIntro as levelThreeIntro, passiveDialog as levelThreePassive } from "./encounters/level_three";

// pending encounter scheduling: when an NPC dialog opens we schedule the encounter
let _pendingEncounterTimeout = null;
let _pendingEncounterLevel = null;
// track whether the level_three boss has been defeated (module-scope so all handlers can read it)
let defeatedNpc3 = false;
// space release tracking: true when space has been released since last press
try{ window.__SPACE_WAS_RELEASED = true; }catch(e){}

function scheduleEncounter(level){
    // clear any previous
    if(_pendingEncounterTimeout){
        clearTimeout(_pendingEncounterTimeout);
        _pendingEncounterTimeout = null;
        _pendingEncounterLevel = null;
    }

    // if an encounter is already active, don't schedule
    try{
        const active = store.get(encounterAtom);
        if(active) return;
    }catch(e){}

    // Instead of auto-triggering after a timeout, store the pending level
    // and wait for the player to press Space to progress into the encounter.
    _pendingEncounterLevel = level;
    // For level_three, block automatic onUpdate triggers until a manual keydown clears it
    try{ if(level === 'level_three'){ window.__BLOCK_AUTO_TRIGGER_LEVEL3 = true; } }catch(e){}
    // ensure no existing timeout remains
    if(_pendingEncounterTimeout){
        clearTimeout(_pendingEncounterTimeout);
        _pendingEncounterTimeout = null;
    }
    try{ 
        window.__TEXTBOX_JUST_OPENED = true; 
        // Mark space as currently held (require release+press to proceed)
        window.__SPACE_WAS_RELEASED = false;
        // Clear the just-opened flag after a short grace period so user can release
        setTimeout(() => { try{ window.__TEXTBOX_JUST_OPENED = false; }catch(e){} }, 220);
    }catch(e){}
}

function triggerPendingEncounterNow(){
    // If boss already defeated, don't trigger any further pending encounters
    if(defeatedNpc3){
        _pendingEncounterLevel = null;
        if(_pendingEncounterTimeout){ clearTimeout(_pendingEncounterTimeout); _pendingEncounterTimeout = null; }
        try{ window.__AUTO_NEXT_ENCOUNTER = false; }catch(e){}
        return;
    }

    // If auto-trigger for level_three is blocked, don't proceed here when pending is level_three
    try{
        if(window.__BLOCK_AUTO_TRIGGER_LEVEL3 && _pendingEncounterLevel && ((typeof _pendingEncounterLevel === 'string' && _pendingEncounterLevel === 'level_three') || (typeof _pendingEncounterLevel === 'object' && _pendingEncounterLevel.level === 'level_three'))){
            return;
        }
    }catch(e){}

    if(_pendingEncounterLevel){
        // close textbox and open encounter UI immediately
        try{ store.set(isTextBoxVisibleAtom, false); }catch(e){}
        try{ store.set(textBoxContentAtom, ""); }catch(e){}
        try{ store.set(encounterAtom, _pendingEncounterLevel); }catch(e){}
        // mark transitioning to debounce duplicate key presses
        try{ window.__TRANSITIONING = true; }catch(e){}
        setTimeout(() => { try{ window.__TRANSITIONING = false; }catch(e){} }, 220);
        // clear any timeout just in case
        if(_pendingEncounterTimeout){
            clearTimeout(_pendingEncounterTimeout);
            _pendingEncounterTimeout = null;
        }
        _pendingEncounterLevel = null;
        try{ window.__TEXTBOX_JUST_OPENED = false; }catch(e){}
    }
}

// also allow an immediate trigger by pressing Space while the textbox is open
window.addEventListener('keydown', (e) => {
    if(!e) return;
    const code = e.code || e.key;
    // mark that space is currently down
    if(code === 'Space' || code === 'Spacebar' || code === ' '){
        try{ window.__SPACE_WAS_RELEASED = false; }catch(e){}
    }
    // Only allow Space to trigger the pending encounter while the text box is visible
    if((code === 'Space' || code === 'Spacebar' || code === ' ') && _pendingEncounterLevel){
        // require the text box to actually be visible before immediately triggering
        try{
            const textVisibleNow = store.get(isTextBoxVisibleAtom);
            if(!textVisibleNow) return;
        }catch(e){}
        // If an auto-next transition is in progress, ignore manual key presses to avoid duplicates
        if(window.__AUTO_NEXT_ENCOUNTER) return;
        if(window.__TRANSITIONING) return;
        try{
            // Allow triggering pending encounter as long as no encounter UI is currently active.
            const activeEncounter = store.get(encounterAtom);
            if(!activeEncounter){
                // clear the level_three auto-trigger block so manual keydown can progress it
                try{ window.__BLOCK_AUTO_TRIGGER_LEVEL3 = false; }catch(e){}
                // log debug info
                try{ console.log('[initGame] triggerPendingEncounter keydown. pending:', _pendingEncounterLevel); }catch(e){}
                triggerPendingEncounterNow();
            }
        }catch(err){
            // fallback: clear block and trigger if pending
            try{ window.__BLOCK_AUTO_TRIGGER_LEVEL3 = false; }catch(e){}
            triggerPendingEncounterNow();
        }
    }
});

// Clear the 'just opened' guard when the space key is released so a subsequent press can progress.
window.addEventListener('keyup', (e) => {
    if(!e) return;
    const code = e.code || e.key;
    if(code === 'Space' || code === 'Spacebar' || code === ' '){
        try{ window.__TEXTBOX_JUST_OPENED = false; }catch(e){}
        try{ window.__SPACE_WAS_RELEASED = true; }catch(e){}
    }
});

// Global handler: if player presses Space while near the current NPC, open dialogue and schedule encounter
window.addEventListener('keydown', (e) => {
    if(!e) return;
    const code = e.code || e.key;
    const isSpace = code === 'Space' || code === 'Spacebar' || code === ' ';
    if(!isSpace) return;

    try{
        const activeEncounter = store.get(encounterAtom);
        const textVisible = store.get(isTextBoxVisibleAtom);
        if(activeEncounter) return;

        const player = window.__currentPlayer;
        const npc = window.__currentNpc;
        const sceneName = window.__currentScene;
        if(player && npc && playerNearNpc(player, npc)){
            // If the level-three boss is already defeated, show passive dialogue and don't schedule
            if(sceneName === 'level_three' && defeatedNpc3){
                try{
                    const facing = getPlayerFacing(player);
                    if(facing.eq(k.vec2(0,-1))){ store.set(textBoxContentAtom, levelThreePassive.down); window.__currentNpc.play('npc3-down-idle'); }
                    else if(facing.eq(k.vec2(0,1))){ store.set(textBoxContentAtom, levelThreePassive.up); window.__currentNpc.play('npc3-up-idle'); }
                    else if(facing.eq(k.vec2(1,0))){ store.set(textBoxContentAtom, levelThreePassive.right); window.__currentNpc.play('npc3-left-idle'); }
                    else if(facing.eq(k.vec2(-1,0))){ store.set(textBoxContentAtom, levelThreePassive.left); window.__currentNpc.play('npc3-right-idle'); }
                    store.set(isTextBoxVisibleAtom, true);
                }catch(e){}
                return;
            }
            // infer facing from direction or current animation so NPC can play correct facing anim
            let dx = 0, dy = 0;
            try{
                const dir = player.direction;
                if(dir && typeof dir.x === 'number' && typeof dir.y === 'number' && (dir.x !== 0 || dir.y !== 0)){
                    dx = dir.x; dy = dir.y;
                } else {
                    const anim = (player.getCurAnim && player.getCurAnim().name) ? player.getCurAnim().name : '';
                    if(anim.includes('left')) { dx = -1; dy = 0; }
                    else if(anim.includes('right')) { dx = 1; dy = 0; }
                    else if(anim.includes('up')) { dx = 0; dy = -1; }
                    else if(anim.includes('down')) { dx = 0; dy = 1; }
                }
            }catch(e){}

            const playFacing = (x,y) => {
                try{
                    if(x === -1) npc.play('npc-right');
                    else if(x === 1) npc.play('npc-left');
                    else if(y === -1) npc.play('npc-down');
                    else if(y === 1) npc.play('npc-up');
                }catch(e){}
            }

            // set a simple dialogue depending on scene and schedule the encounter
            if(sceneName === 'level_two'){
                store.set(textBoxContentAtom, levelTwoIntro);
                playFacing(dx, dy);
                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_two');
            } else if(sceneName === 'level_three'){
                store.set(textBoxContentAtom, levelThreeIntro);
                playFacing(dx, dy);
                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_three');
            } else if(sceneName === 'level_one'){
                store.set(textBoxContentAtom, levelOneIntro);
                playFacing(dx, dy);
                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_one');
            }
        }
    }catch(e){}
});

export default function initGame(){

    const k = initKaplay();

    function fadeToScene(sceneName, duration = 0.5) {
    const overlay = k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.opacity(0),
        k.fixed(),
        k.z(9999),
    ]);

    // fade to black
    overlay.onUpdate(() => {
        overlay.opacity = Math.min(overlay.opacity + k.dt() / duration, 1);
    });

    // once fully black, change scene
    k.wait(duration, () => {
        k.go(sceneName);

        // fade back in
        const fadeIn = k.add([
            k.rect(k.width(), k.height()),
            k.pos(0, 0),
            k.color(0, 0, 0),
            k.opacity(1),
            k.fixed(),
            k.z(9999),
        ]);

        fadeIn.onUpdate(() => {
            fadeIn.opacity = Math.max(fadeIn.opacity - k.dt() / duration, 0);
            if (fadeIn.opacity <= 0) {
                fadeIn.destroy();
            }
        });
    });
}


// 1. Give the canvas a way to be focused
const canvas = k.canvas;
canvas.setAttribute("tabindex", "0"); 

// 2. When the user returns to the tab, grab focus
window.addEventListener("focus", () => {
    canvas.focus();
});

// 3. When the user clicks anywhere on the page, grab focus
window.addEventListener("mousedown", () => {
    canvas.focus();
});

    // track current scene and expose a global handler to receive encounter results
    let currentScene = null;
    // timestamp (ms) until which player input should be ignored to avoid sticky keys
    let inputBlockedUntil = 0;
    // monkey-patch k.go to capture current scene
    const _origGo = k.go.bind(k);
    k.go = (sceneName) => {
        currentScene = sceneName;
        try{ window.__currentScene = sceneName; }catch(e){}
        return _origGo(sceneName);
    }

    // global handler invoked by the React encounter UI when player confirms result
    window.onEncounterResult = function(meta, correct){
        // meta may be a string (legacy) or an object { level, step }
        let level = null;
        let step = 0;
        try{
            if(typeof meta === 'string'){
                level = meta;
                step = 0;
            } else if(meta && typeof meta === 'object'){
                level = meta.level;
                step = typeof meta.step === 'number' ? meta.step : 0;
            }
        }catch(e){}

        try{ store.set(encounterAtom, null); }catch(e){}
        try{ store.set(isTextBoxVisibleAtom, false); }catch(e){}
        try{ store.set(textBoxContentAtom, ""); }catch(e){}
        // clear any pending scheduled encounter
        if(_pendingEncounterTimeout){
            clearTimeout(_pendingEncounterTimeout);
            _pendingEncounterTimeout = null;
            _pendingEncounterLevel = null;
            try{ window.__BLOCK_AUTO_TRIGGER_LEVEL3 = false; }catch(e){}
        }

        try{ console.log('[initGame] onEncounterResult', meta, correct); }catch(e){}
        // prevent immediate input for a short time to avoid 'stuck' movement
        try{ inputBlockedUntil = Date.now() + 220; }catch(e){}

        // if incorrect properly show by loss of hearts
        if(!correct) {
            try {
                const currentHearts = store.get(heartsAtom);
                store.set(heartsAtom, Math.max(0, currentHearts - 1));
            } catch (e) {}

            return;
        }

        // handle multi-step encounters per level
        try{
            if(level === 'level_one'){
                // level one has single encounter by default
                movedNpc1 = true;
                if(currentScene === level){ fadeToScene('level_two'); }
                return;
            }

            if(level === 'level_two'){
                // two-step sequence: step 0 -> step 1 -> win level
                if(step === 0){
                    // first encounter won: show NPC dialog and queue second encounter
                    try{ store.set(textBoxContentAtom, 'You bested me once... but not yet! Prepare yourself!'); }catch(e){}
                    try{ store.set(isTextBoxVisibleAtom, true); }catch(err){}
                    // set pending encounter to next step; allow immediate auto-transition
                    _pendingEncounterLevel = { level: 'level_two', step: 1 };
                    // auto-trigger next encounter shortly after the current dialog closes
                    try{ window.__AUTO_NEXT_ENCOUNTER = true; }catch(e){}
                    setTimeout(() => {
                        try{
                            if(window.__AUTO_NEXT_ENCOUNTER){
                                window.__AUTO_NEXT_ENCOUNTER = false;
                                triggerPendingEncounterNow();
                            }
                        }catch(e){}
                    }, 160);
                    return;
                }
                if(step === 1){
                    // finished both encounters
                    movedNpc2 = true;
                    return;
                }
            }

            if(level === 'level_three'){
                // three-step sequence: steps 0,1,2 => on finishing step N-1 queue next
                if(step === 0){
                    try{ store.set(textBoxContentAtom, 'Impressive... but you will need more than that.'); }catch(e){}
                    try{ store.set(isTextBoxVisibleAtom, true); }catch(err){}
                    _pendingEncounterLevel = { level: 'level_three', step: 1 };
                    try{ window.__AUTO_NEXT_ENCOUNTER = true; }catch(e){}
                    setTimeout(() => {
                        try{
                            if(window.__AUTO_NEXT_ENCOUNTER){
                                window.__AUTO_NEXT_ENCOUNTER = false;
                                triggerPendingEncounterNow();
                            }
                        }catch(e){}
                    }, 160);
                    return;
                }
                if(step === 1){
                    try{ store.set(textBoxContentAtom, 'You are persistent. Final test!'); }catch(e){}
                    try{ store.set(isTextBoxVisibleAtom, true); }catch(err){}
                    _pendingEncounterLevel = { level: 'level_three', step: 2 };
                    try{ window.__AUTO_NEXT_ENCOUNTER = true; }catch(e){}
                    setTimeout(() => {
                        try{
                            if(window.__AUTO_NEXT_ENCOUNTER){
                                window.__AUTO_NEXT_ENCOUNTER = false;
                                triggerPendingEncounterNow();
                            }
                        }catch(e){}
                    }, 160);
                    return;
                }
                if(step === 2){
                    // completed all three
                    defeatedNpc3 = true;
                    // clear any queued or scheduled encounters and auto-next flags
                    try{ _pendingEncounterLevel = null; }catch(e){}
                    if(_pendingEncounterTimeout){ clearTimeout(_pendingEncounterTimeout); _pendingEncounterTimeout = null; }
                    try{ window.__AUTO_NEXT_ENCOUNTER = false; }catch(e){}
                    // If the level-three scene is active, ensure the NPC switches to a passive animation
                    try{
                        if(window.__currentScene === 'level_three' && window.__currentNpc){
                            try{ window.__currentNpc.play('npc-down'); }catch(e){}
                        }
                    }catch(e){}
                    try{ console.log('[initGame] defeatedNpc3 set true');
                        
                        // Create and dispatch the event
                        const navEvent = new CustomEvent('TERMINAL_NAVIGATE', { 
                            detail: '/Leaderboard' // The path you want to go to
                        });

                        

                        window.dispatchEvent(navEvent);
                        k.quit();

                    }catch(e){}
                    return;
                }
            }
        }catch(e){
            // fallback: mark as completed if unknown
            try{ if(level === 'level_two') movedNpc2 = true; }catch(e){}
            try{ if(level === 'level_three') defeatedNpc3 = true; }catch(e){}
        }
    }

    // Helper: determine player's facing direction.
    // If the player is stationary (direction == 0,0), fall back to the current animation name
    // to infer facing so NPC dialogue shows the correct text when standing still.
    function getPlayerFacing(player){
        try{
            const zero = k.vec2(0,0);
            const dir = player && player.direction ? player.direction : null;
            if(dir && typeof dir.eq === 'function' && !dir.eq(zero)){
                return dir;
            }
            const anim = (player && player.getCurAnim && player.getCurAnim().name) ? player.getCurAnim().name : '';
            if(anim.includes('left')) return k.vec2(-1,0);
            if(anim.includes('right')) return k.vec2(1,0);
            if(anim.includes('up')) return k.vec2(0,-1);
            if(anim.includes('down')) return k.vec2(0,1);
        }catch(e){}
        return k.vec2(0,0);
    }

    //loading important sprites:
    k.loadSprite("background3", "./background3.png");
    k.loadSprite("background2", "./background2.png");
    k.loadSprite("background1", "./background1.png");
        k.loadSprite("characters", "characters3.png", {
            sliceY:2,
            sliceX:8,
            anims: {
                //arbitrary names for the animations does not matter
                "down-idle": 0,
                "up-idle": 1,
                "right-idle": 2,
                "left-idle": 3,
                right: { from: 4, to: 5, loop: true },
                left: { from: 6, to: 7, loop: true },
                down: { from: 8, to: 9, loop: true },
                up: { from: 10, to: 11, loop: true },
                "npc-down": 12,
                "npc-up": 13,
                "npc-right": 14,
                "npc-left": 15,
            },
        });

        k.loadSprite("npcs", "enemies.png", {
            sliceY:2,
            sliceX:8,
            anims: {
                //arbitrary names for the animations does not matter
                "npc3-down-idle": 0,
                "npc3-up-idle": 1,
                "npc3-right-idle": 2,
                "npc3-left-idle": 3,

                "npc1-down-idle": 4,
                "npc1-up-idle": 5,
                "npc1-right-idle": 6,
                "npc1-left-idle": 7,

                "npc2-down-idle": 8,
                "npc2-up-idle": 9,
                "npc2-right-idle": 10,
                "npc2-left-idle": 11,
            },
        });

    //for proper player placement between screens
    let retTo2 = false;
    let retTo1 = false;

    //for proper npc placement after interaction
    let movedNpc1 = false;
    let movedNpc2 = false;
    // track encounter win/lose per level: null = not attempted, true/false = result
    const encounterResults = {
        level_one: null,
        level_two: null,
        level_three: null,
    };


    k.scene("level_three", () => {
        const DIAGONAL_FACTOR = 1/Math.sqrt(2);
        let isCollidingNpc = false;

        k.add([k.sprite("background3"), k.pos(0, -70), k.scale(8)]);

        const npc = k.add([
                k.sprite("npcs", {anim: "npc3-left-idle"}),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(1094, 422),
        ]);

        //collison logic for walls going from left to right

        const rockUP = k.add([
                k.rect(96, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(384, 250), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])
        
        const rockDOWN = k.add([
                k.rect(96, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(384, 637), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])  

        const rockUP2 = k.add([
                k.rect(32, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(768, 120), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])

        const rockDOWN2 = k.add([
                k.rect(32, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(768, 762), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])

        const rockUP3 = k.add([
                k.rect(64, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1106, -16), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])

        const rockDOWN3 = k.add([
                k.rect(64, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1106, 890), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])

        const rockUP4 = k.add([
                k.rect(32, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1408, 120), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])    
        
        const rockDOWN4 = k.add([
                k.rect(32, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1408, 760), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])   
        
        const rockUP5 = k.add([
                k.rect(16, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1472, 248), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ]) 

        const rockDOWN5 = k.add([
                k.rect(16, 16),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1472, 633), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])   

        const rockRIGHT = k.add([
                k.rect(16, 64),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(1600, 433), 
                k.body({isStatic: true}),
                k.opacity(0.0)      
        ])   



        //wall collions end

        const warpBackTwo = k.add([
                k.rect(16, 64),
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.pos(0, 460), 
                k.opacity(0.0)      
        ])    
    
        warpBackTwo.onCollide("player", () => {

            k.go("level_two")
            retTo2 = true;
        
        });

        npc.onCollide("player", () => {

            isCollidingNpc = true;
        
        });

        npc.onCollideEnd("player", () => {

            isCollidingNpc = false;

        })

        const player = k.add([
            k.sprite("characters", {anim: "down-idle"}),
            k.area(),
            k.body(),
            k.anchor("center"),
            k.scale(8),
            k.pos(144, 424),
            "player",
            {
                speed: 800,
                direction: k.vec2(0,0),
                
            },//tag for collisons, string to array of components

        ]);
        try{ window.__currentPlayer = player; window.__currentNpc = npc; }catch(e){}
        try{ window.__currentPlayer = player; window.__currentNpc = npc; }catch(e){}
        try{ window.__currentPlayer = player; window.__currentNpc = npc; }catch(e){}

        //global update loop
        player.onUpdate(() => {

            player.direction.x = 0;
            player.direction.y = 0;

            const spaceKeyDown = k.isKeyDown("space") || store.get(mobileButtonAtom);
            const spaceKeyPressed = k.isKeyPressed("space");

            // 2. Create a custom "Mobile Pressed" flag to mimic k.isKeyPressed
            // This prevents the button from "stuttering" through multiple dialogue steps
            let mobileJustPressed = false;
            if (store.get(mobileButtonAtom) && !window.__MOBILE_BUTTON_HELD) {
                mobileJustPressed = true;
                window.__MOBILE_BUTTON_HELD = true;
            } else if (!store.get(mobileButtonAtom)) {
                window.__MOBILE_BUTTON_HELD = false;
            }

            const isActTriggered = spaceKeyPressed || mobileJustPressed;

            // If player presses Space while a text box is visible and a pending encounter exists,
            // trigger it immediately. This fixes cases where browser keydown timing misses the pending flag.
            try{
                    if(isActTriggered){
                    const textVisibleNow = store.get(isTextBoxVisibleAtom);
                    // avoid triggering immediately if the textbox was just opened by this same keypress
                    const justOpened = !!(window.__TEXTBOX_JUST_OPENED);
                    const spaceReleased = !!(window.__SPACE_WAS_RELEASED);
                    // require that the player has released space since opening the textbox
                    if(textVisibleNow && _pendingEncounterLevel && !justOpened && spaceReleased){
                        try{ console.log('[initGame] triggerPendingEncounter from onUpdate. pending:', _pendingEncounterLevel); }catch(e){}
                        triggerPendingEncounterNow();
                        return;
                    }
                    // if the textbox was just opened, ignore the immediate space press (user must release and press again)
                }
            }catch(e){}

            // If player presses Space while a text box is visible and a pending encounter exists,
            // trigger it immediately. This fixes cases where browser keydown timing misses the pending flag.
            try{
                if(isActTriggered){
                    const textVisibleNow = store.get(isTextBoxVisibleAtom);
                    if(textVisibleNow && _pendingEncounterLevel){
                        try{ console.log('[initGame] triggerPendingEncounter from onUpdate. pending:', _pendingEncounterLevel); }catch(e){}
                        triggerPendingEncounterNow();
                        return;
                    }
                }
            }catch(e){}

            // if a text box (NPC dialogue) is visible, block all player movement
            try{
                const textVisible = store.get(isTextBoxVisibleAtom);
                if(textVisible){
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}

            // briefly ignore input after encounters to avoid sticky movement
            try{
                if(Date.now() < inputBlockedUntil){
                    try{
                        if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                            player.play(`${player.getCurAnim().name}-idle`);
                        }
                    }catch(e){}
                    return;
                }
            }catch(e){}

            // if a text box (NPC dialogue) is visible, block all player movement
            try{
                const textVisible = store.get(isTextBoxVisibleAtom);
                if(textVisible){
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}

            // briefly ignore input after encounters to avoid sticky movement
            try{
                if(Date.now() < inputBlockedUntil){
                    try{
                        if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                            player.play(`${player.getCurAnim().name}-idle`);
                        }
                    }catch(e){}
                    return;
                }
            }catch(e){}

            // briefly ignore input after encounters to avoid sticky movement
            try{
                if(Date.now() < inputBlockedUntil){
                    try{
                        if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                            player.play(`${player.getCurAnim().name}-idle`);
                        }
                    }catch(e){}
                    return;
                }
            }catch(e){}

            // if an encounter UI is active, block all player movement and input
            try{
                const activeEncounter = store.get(encounterAtom);
                if(activeEncounter){
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}

            // if an encounter UI is active, block all player movement and input
            try{
                const activeEncounter = store.get(encounterAtom);
                if(activeEncounter){
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}

            // if an encounter UI is active, block all player movement and input
            try{
                const activeEncounter = store.get(encounterAtom);
                if(activeEncounter){
                    // ensure idle animation
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}

            //player input to move - check joystick first, then keyboard
            const joystick = store.get(joystickAtom);
            if (joystick.x !== 0 || joystick.y !== 0) {
                // Use joystick input (already normalized -1 to 1)
                player.direction.x = joystick.x;
                player.direction.y = joystick.y;
            } else {
                // Fall back to keyboard input
                if(k.isKeyDown("left")) player.direction.x = -1;
                if(k.isKeyDown("right")) player.direction.x = 1;
                if(k.isKeyDown("up")) player.direction.y = -1;
                if(k.isKeyDown("down")) player.direction.y = 1;
            }

            //smooth animations to keep nice cycle
            // For animations, we need to check dominant direction
            const dominantX = Math.abs(player.direction.x) > Math.abs(player.direction.y);
            const dominantY = Math.abs(player.direction.y) > Math.abs(player.direction.x);

            if(dominantX && player.direction.x < -0.3 &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(dominantX && player.direction.x > 0.3 &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(dominantY && player.direction.y < -0.3 &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(dominantY && player.direction.y > 0.3 &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.x === 0 && player.direction.y === 0 &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving
            if(player.direction.x !== 0 || player.direction.y !== 0){
                // Normalize direction for consistent speed
                const len = Math.sqrt(player.direction.x * player.direction.x + player.direction.y * player.direction.y);
                if (len > 1) {
                    player.direction.x /= len;
                    player.direction.y /= len;
                }
                player.move(k.vec2(player.direction.x, player.direction.y).scale(player.speed));
            }

            //check when colliding from npx or adjacent and pressing space
            if((isCollidingNpc || playerNearNpc(player, npc)) && (isActTriggered)){
                // if an encounter UI is active, ignore this input to avoid overlapping dialogue
                try{
                    const activeEncounter = store.get(encounterAtom);
                    if(activeEncounter) return;
                }catch(e){}

                // if boss already defeated, behave as passive NPC (no re-trigger)
                if(defeatedNpc3){
                    const facing = getPlayerFacing(player);
                    if(facing.eq(k.vec2(0,-1))){ store.set(textBoxContentAtom, levelThreePassive.down); npc.play("npc3-down-idle"); }
                    else if(facing.eq(k.vec2(0,1))){ store.set(textBoxContentAtom, levelThreePassive.up); npc.play("npc3-up-idle"); }
                    else if(facing.eq(k.vec2(1,0))){ store.set(textBoxContentAtom, levelThreePassive.right); npc.play("npc3-left-idle"); }
                    else if(facing.eq(k.vec2(-1,0))){ store.set(textBoxContentAtom, levelThreePassive.left); npc.play("npc3-right-idle"); }
                    store.set(isTextBoxVisibleAtom, true);
                    return;
                }
                const facing = getPlayerFacing(player);
                if(facing.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, levelThreeIntro);
                    npc.play("npc3-down-idle");
                }

                if(facing.eq(k.vec2(0,1))){
                    store.set(textBoxContentAtom, levelThreeIntro);
                    npc.play("npc3-up-idle");
                }

                if(facing.eq(k.vec2(1,0))){
                    store.set(textBoxContentAtom, levelThreeIntro);
                    npc.play("npc3-left-idle");
                }

                if(facing.eq(k.vec2(-1,0))){
                    store.set(textBoxContentAtom, levelThreeIntro);
                    npc.play("npc3-right-idle");
                }

                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_three');



            }

        })

    });

    k.scene("level_two", () => {
        const DIAGONAL_FACTOR = 1/Math.sqrt(2);
        let isCollidingNpc = false;

        k.add([k.sprite("background2"), k.pos(0, -70), k.scale(8)]);

        let npc_position = [196, 634];

        if(movedNpc2)
            npc_position = [328, 208]

        let npc = k.add([
                k.sprite("npcs", {anim: "npc2-down-idle"}),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(npc_position),
        ]);

        //collison logic for walls
        
        const tree1 = k.add([
                k.rect(16, 169),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(48, 460), 
                k.opacity(0.0)       
        ])

        const tree2 = k.add([
                k.rect(16, 68),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(468, 844), 
                k.opacity(0.0)       
        ])

        const tree3 = k.add([
                k.rect(16, 48),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(468, 124), 
                k.opacity(0.0)       
        ])

        const bush = k.add([
                k.rect(48, 16),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(245, -7), 
                k.opacity(0.0)       
        ])

        const rocks_up = k.add([
                k.rect(200, 17),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(1216, 248), 
                k.opacity(0.0)       
        ])

        const rocks_down = k.add([
                k.rect(225, 17),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(1216, 640), 
                k.opacity(0.0)       
        ])


        //wall collions end
        
        //warp collison
        const warpToThree = k.add([
                k.pos(1836, 436),
                k.rect(16, 32), 
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        warpToThree.onCollide("player", () => {

            fadeToScene("level_three");
            retTo2 = false;

        })

        const warpBackOne = k.add([
                k.pos(240, 1102),
                k.rect(48, 16), 
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        warpBackOne.onCollide("player", () => {

            k.go("level_one");
            retTo1 = true;

        })
        //end warp collison
        

        npc.onCollide("player", () => {

            isCollidingNpc = true;
        
        });

        npc.onCollideEnd("player", () => {

            isCollidingNpc = false;

        })

        let player_position = [192, 930];

        if(retTo2){
            player_position = [1700, 440]
        }

        // helper to ensure NPC moves to its new location in-place when movedNpc2 becomes true
        let npcMovedHandled = false;

        const player = k.add([
            k.sprite("characters", {anim: "down-idle"}),
            k.area(),
            k.body(),
            k.anchor("center"),
            k.scale(8),
            k.pos(player_position),
            "player",
            {
                speed: 800,
                direction: k.vec2(0,0),
                
            },//tag for collisons, string to array of components

        ]);

        //global update loop
        player.onUpdate(() => {

            player.direction.x = 0;
            player.direction.y = 0;

            // 1. Check the inputs
            const spaceKeyDown = k.isKeyDown("space") || store.get(mobileButtonAtom);
            const spaceKeyPressed = k.isKeyPressed("space");

            // 2. Create a custom "Mobile Pressed" flag to mimic k.isKeyPressed
            // This prevents the button from "stuttering" through multiple dialogue steps
            let mobileJustPressed = false;
            if (store.get(mobileButtonAtom) && !window.__MOBILE_BUTTON_HELD) {
                mobileJustPressed = true;
                window.__MOBILE_BUTTON_HELD = true;
            } else if (!store.get(mobileButtonAtom)) {
                window.__MOBILE_BUTTON_HELD = false;
            }

            const isActTriggered = spaceKeyPressed || mobileJustPressed;

            // If player presses Space while a text box is visible and a pending encounter exists,
            // trigger it immediately. This fixes cases where browser keydown timing misses the pending flag.
            try{
                if(isActTriggered){
                    const textVisibleNow = store.get(isTextBoxVisibleAtom);
                    if(textVisibleNow && _pendingEncounterLevel){
                        try{ console.log('[initGame] triggerPendingEncounter from onUpdate. pending:', _pendingEncounterLevel); }catch(e){}
                        triggerPendingEncounterNow();
                        return;
                    }
                }
            }catch(e){}

            //player input to move
            // if a text box (NPC dialogue) is visible, block all player movement
            try{
                const textVisible = store.get(isTextBoxVisibleAtom);
                if(textVisible){
                    if(player.direction.eq(k.vec2(0, 0)) && !player.getCurAnim().name.includes("idle")){
                        player.play(`${player.getCurAnim().name}-idle`);
                    }
                    return;
                }
            }catch(e){}
          
            //player input to move - check joystick first, then keyboard
            const joystick = store.get(joystickAtom);
            if (joystick.x !== 0 || joystick.y !== 0) {
                // Use joystick input (already normalized -1 to 1)
                player.direction.x = joystick.x;
                player.direction.y = joystick.y;
            } else {
                // Fall back to keyboard input
                if(k.isKeyDown("left")) player.direction.x = -1;
                if(k.isKeyDown("right")) player.direction.x = 1;
                if(k.isKeyDown("up")) player.direction.y = -1;
                if(k.isKeyDown("down")) player.direction.y = 1;
            }


            //smooth animations to keep nice cycle
            // For animations, we need to check dominant direction
            const dominantX = Math.abs(player.direction.x) > Math.abs(player.direction.y);
            const dominantY = Math.abs(player.direction.y) > Math.abs(player.direction.x);

            if(dominantX && player.direction.x < -0.3 &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(dominantX && player.direction.x > 0.3 &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(dominantY && player.direction.y < -0.3 &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(dominantY && player.direction.y > 0.3 &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.x === 0 && player.direction.y === 0 &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving
            if(player.direction.x !== 0 || player.direction.y !== 0){
                // Normalize direction for consistent speed
                const len = Math.sqrt(player.direction.x * player.direction.x + player.direction.y * player.direction.y);
                if (len > 1) {
                    player.direction.x /= len;
                    player.direction.y /= len;
                }
                player.move(k.vec2(player.direction.x, player.direction.y).scale(player.speed));
            }

            // ensure NPC moves to new spot once the level has been won
            try{
                if(movedNpc2 && !npcMovedHandled){
                    try{ npc.pos = k.vec2(328,208); }catch(e){}
                    npcMovedHandled = true;
                }
            }catch(e){}

            //check when colliding from npx or adjacent and pressing space
            if((isCollidingNpc || playerNearNpc(player, npc)) && (isActTriggered)){
                // if an encounter UI is active, ignore this input to avoid overlapping dialogue
                try{
                    const activeEncounter = store.get(encounterAtom);
                    if(activeEncounter) return;
                }catch(e){}

                // if NPC already moved (player won), show passive dialogue but do NOT re-trigger the encounter
                if(movedNpc2){
                    const facing = getPlayerFacing(player);
                    if(facing.eq(k.vec2(0,-1))){
                        store.set(textBoxContentAtom, levelTwoPassive.down);
                        npc.play("npc2-down-idle");
                    }
                    if(facing.eq(k.vec2(0,1))){
                        store.set(textBoxContentAtom, levelTwoPassive.up);
                        npc.play("npc2-up-idle");
                    }
                    if(facing.eq(k.vec2(1,0))){
                        store.set(textBoxContentAtom, levelTwoPassive.right);
                        npc.play("npc2-left-idle");
                    }
                    if(facing.eq(k.vec2(-1,0))){
                        store.set(textBoxContentAtom, levelTwoPassive.left);
                        npc.play("npc2-right-idle");
                    }
                    store.set(isTextBoxVisibleAtom, true);
                    return;
                }

                // If a pending multi-step encounter for level_two is already queued (step > 0),
                // don't re-show the initial "I am the CSS Wizard" dialogue or re-schedule.
                if(_pendingEncounterLevel && typeof _pendingEncounterLevel === 'object' && _pendingEncounterLevel.level === 'level_two' && (_pendingEncounterLevel.step || 0) > 0){
                    return;
                }

                const facing = getPlayerFacing(player);
                if(facing.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, levelTwoIntro);
                    npc.play("npc2-down-idle");
                }


                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_two');
            }

        })

    });


    k.scene("level_one", () => {
        const DIAGONAL_FACTOR = 1/Math.sqrt(2);
        let isCollidingNpc = false;

        k.add([k.sprite("background1"), k.pos(0, -70), k.scale(8)]);

        let npc_position = [578, 94];

        if(movedNpc1)
            npc_position = [-100, -100]

        const npc = k.add([
                k.sprite("npcs", {anim: "npc1-down-idle"}),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(npc_position),
        ]);

        //collison logic for walls
        const tree1 = k.add([
                k.pos(450, 500),
                k.rect(16, 112), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const tree2 = k.add([
                k.pos(580, 900),
                k.rect(16, 48), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const tree3 = k.add([
                k.pos(320, 100),
                k.rect(16, 32), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const bush1 = k.add([
                k.pos(960, 100),
                k.rect(78, 16), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const water1 = k.add([
                k.pos(1345, 100),
                k.rect(16, 48), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const water2 = k.add([
                k.pos(1600, 380),
                k.rect(16, 48), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const water3 = k.add([
                k.pos(1740, 820),
                k.rect(16, 64), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const rock = k.add([
                k.pos(1480, 230),
                k.rect(16, 16), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const rock2 = k.add([
                k.pos(890, 890),
                k.rect(28, 16), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        const startArea =k.add([
                k.pos(1200, 1150),
                k.rect(128, 16), 
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);


        //wall collions end
        
        //warp collison
        const warpToTwo = k.add([
                k.pos(890, -40),
                k.rect(128, 16), 
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        warpToTwo.onCollide("player", () => {
            fadeToScene("level_two");
            retTo1 = false;
            retTo2 = false;
        })
        
        npc.onCollide("player", () => {

            isCollidingNpc = true;
        
        });

        npc.onCollideEnd("player", () => {

            isCollidingNpc = false;

        })

        let player_position = [1200, 990]
        if(retTo1)
            player_position = [578, 220]

        const player = k.add([
            k.sprite("characters", {anim: "down-idle"}),
            k.area(),
            k.body(),
            k.anchor("center"),
            k.scale(8),
            k.pos(player_position),
            "player",
            {
                speed: 800,
                direction: k.vec2(0,0),
                
            },//tag for collisons, string to array of components

        ]);

        //global update loop
        player.onUpdate(() => {

            player.direction.x = 0;
            player.direction.y = 0;

            //player input to move - check joystick first, then keyboard
            const joystick = store.get(joystickAtom);
            if (joystick.x !== 0 || joystick.y !== 0) {
                // Use joystick input (already normalized -1 to 1)
                player.direction.x = joystick.x;
                player.direction.y = joystick.y;
            } else {
                // Fall back to keyboard input
                if(k.isKeyDown("left")) player.direction.x = -1;
                if(k.isKeyDown("right")) player.direction.x = 1;
                if(k.isKeyDown("up")) player.direction.y = -1;
                if(k.isKeyDown("down")) player.direction.y = 1;
            }


            //smooth animations to keep nice cycle
            // For animations, we need to check dominant direction
            const dominantX = Math.abs(player.direction.x) > Math.abs(player.direction.y);
            const dominantY = Math.abs(player.direction.y) > Math.abs(player.direction.x);

            if(dominantX && player.direction.x < -0.3 &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(dominantX && player.direction.x > 0.3 &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(dominantY && player.direction.y < -0.3 &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(dominantY && player.direction.y > 0.3 &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.x === 0 && player.direction.y === 0 &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving
            if(player.direction.x !== 0 || player.direction.y !== 0){
                // Normalize direction for consistent speed
                const len = Math.sqrt(player.direction.x * player.direction.x + player.direction.y * player.direction.y);
                if (len > 1) {
                    player.direction.x /= len;
                    player.direction.y /= len;
                }
                player.move(k.vec2(player.direction.x, player.direction.y).scale(player.speed));
            }

            //check when colliding from npx or adjacent and pressing space
            if((isCollidingNpc || playerNearNpc(player, npc)) && (k.isKeyPressed("space") || store.get(mobileButtonAtom))){
                // if an encounter UI is active, ignore this input to avoid overlapping dialogue
                try{
                    const activeEncounter = store.get(encounterAtom);
                    if(activeEncounter) return;
                }catch(e){}

                const facing = getPlayerFacing(player);

                if(facing.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, levelOneIntro);
                    npc.play("npc1-down-idle");

                }

                if(facing.eq(k.vec2(0,1))){
                    store.set(textBoxContentAtom, levelOnePassive.up);
                    npc.play("npc1-up-idle");
                    
                }

                if(facing.eq(k.vec2(1,0))){
                    store.set(textBoxContentAtom, levelOnePassive.right);
                    npc.play("npc1-left-idle");
                }

                if(facing.eq(k.vec2(-1,0))){
                    store.set(textBoxContentAtom, levelOnePassive.left);
                    npc.play("npc1-right-idle");
                }

                store.set(isTextBoxVisibleAtom, true);
                scheduleEncounter('level_one');

            }

        })

    });



    k.go("level_one");

    // Expose a small debug API for runtime inspection from the browser console.
    try{
        window.__GAME_DEBUG__ = {
            get: () => ({
                encounter: (() => { try{ return store.get(encounterAtom); }catch(e){return null} })(),
                textBoxVisible: (() => { try{ return store.get(isTextBoxVisibleAtom); }catch(e){return null} })(),
                textBoxContent: (() => { try{ return store.get(textBoxContentAtom); }catch(e){return null} })(),
                movedNpc1,
                movedNpc2,
                defeatedNpc3,
                pendingEncounterLevel: _pendingEncounterLevel,
                pendingEncounterScheduled: Boolean(_pendingEncounterTimeout),
                currentScene: currentScene,
            }),
            // quick helpers to mutate state from console
            setEncounter: (v) => { try{ store.set(encounterAtom, v); }catch(e){} },
            setTextBoxVisible: (v) => { try{ store.set(isTextBoxVisibleAtom, v); }catch(e){} },
        };
    }catch(e){}

}

    // Helper: returns true when the player is adjacent to the npc (within pixel threshold)
    // default increased to 140 so interaction range is generous but not too large
    function playerNearNpc(playerObj, npcObj, maxDistance = 140){
        try{
            const px = playerObj.pos && (playerObj.pos.x ?? playerObj.pos[0]);
            const py = playerObj.pos && (playerObj.pos.y ?? playerObj.pos[1]);
            const nx = npcObj.pos && (npcObj.pos.x ?? npcObj.pos[0]);
            const ny = npcObj.pos && (npcObj.pos.y ?? npcObj.pos[1]);
            if(typeof px !== 'number' || typeof py !== 'number' || typeof nx !== 'number' || typeof ny !== 'number') return false;
            const dx = px - nx;
            const dy = py - ny;
            return Math.hypot(dx, dy) <= maxDistance;
        }catch(e){
            return false;
        }
    }

    // Create a floating DOM hint for interacting with NPCs
    function ensureNpcHint() {
        let hint = document.getElementById('npc-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'npc-hint';
            hint.textContent = 'Press Space to interact';
            Object.assign(hint.style, {
                position: 'fixed',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontFamily: '"gameboy", monospace',
                fontSize: '14px',
                borderRadius: '6px',
                pointerEvents: 'none',
                display: 'none',
                zIndex: 99999,
            });
            document.body.appendChild(hint);
        }
        return hint;
    }