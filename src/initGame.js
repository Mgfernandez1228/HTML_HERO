import initKaplay from "./kaplayCtx";
import { isTextBoxVisibleAtom, store, textBoxContentAtom } from "./store";

export default function initGame(){

    const k = initKaplay();

    //loading important sprites:
    k.loadSprite("background3", "./background3.png");
    k.loadSprite("background2", "./background2.png");
    k.loadSprite("background1", "./background1.png");
        k.loadSprite("characters", "characters.png", {
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

    //for proper player placement between screens
    let retTo2 = false;
    let retTo1 = false;

    //for proper npc placement after interaction
    let movedNpc1 = false;
    let movedNpc2 = false;
    let defeatedNpc3 = false;


    k.scene("level_three", () => {
        const DIAGONAL_FACTOR = 1/Math.sqrt(2);
        let isCollidingNpc = false;

        k.add([k.sprite("background3"), k.pos(0, -70), k.scale(8)]);

        const npc = k.add([
                k.sprite("characters", {anim: "npc-left"}),
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

        //global update loop
        player.onUpdate(() => {

            player.direction.x = 0;
            player.direction.y = 0;

            //player input to move
            if(k.isKeyDown("left")) player.direction.x = -1; //horizontal stuff
            if(k.isKeyDown("right")) player.direction.x = 1;

            if(k.isKeyDown("up")) player.direction.y = -1;// height stuff
            if(k.isKeyDown("down")) player.direction.y = 1;


            //smooth animations to keep nice cycle

            if(player.direction.eq(k.vec2(-1, 0)) &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(player.direction.eq(k.vec2(1, 0)) &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(player.direction.eq(k.vec2(0, -1)) &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(player.direction.eq(k.vec2(0, 1)) &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.eq(k.vec2(0, 0)) &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving diagonally
            if(player.direction.x && player.direction.y){
                player.move(player.direction.scale(DIAGONAL_FACTOR*player.speed));
                return;//to prevent following lines of movement
            }

            //check when colliding from npx
            if(isCollidingNpc && k.isKeyPressed("space")){

                if(player.direction.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, "Final Boss JavaScript");
                    defeatedNpc3 = true;
                    npc.play("npc-down");
                }

                if(player.direction.eq(k.vec2(0,1))){
                    store.set(textBoxContentAtom, "Final Boss JavaScript");
                    defeatedNpc3 = true;
                    npc.play("npc-up");
                }

                if(player.direction.eq(k.vec2(1,0))){
                    store.set(textBoxContentAtom, "Final Boss JavaScript");
                    defeatedNpc3 = true;
                    npc.play("npc-left");
                }

                if(player.direction.eq(k.vec2(-1,0))){
                    store.set(textBoxContentAtom, "Final Boss JavaScript");
                    defeatedNpc3 = true;
                    npc.play("npc-right");
                }

                store.set(isTextBoxVisibleAtom, true);



            }

            player.move(player.direction.scale(player.speed));

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
                k.sprite("characters", {anim: "npc-down"}),
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

            k.go("level_three");
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

            //player input to move
            if(k.isKeyDown("left")) player.direction.x = -1; //horizontal stuff
            if(k.isKeyDown("right")) player.direction.x = 1;

            if(k.isKeyDown("up")) player.direction.y = -1;// height stuff
            if(k.isKeyDown("down")) player.direction.y = 1;


            //smooth animations to keep nice cycle

            if(player.direction.eq(k.vec2(-1, 0)) &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(player.direction.eq(k.vec2(1, 0)) &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(player.direction.eq(k.vec2(0, -1)) &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(player.direction.eq(k.vec2(0, 1)) &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.eq(k.vec2(0, 0)) &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving diagonally
            if(player.direction.x && player.direction.y){
                player.move(player.direction.scale(DIAGONAL_FACTOR*player.speed));
                return;//to prevent following lines of movement
            }

            //check when colliding from npc
            if(isCollidingNpc && k.isKeyPressed("space")){

                if(player.direction.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, "Beautiful day, isn't it?");
                    npc.play("npc-down");
                    npc.pos = k.vec2(328, 208);
                    movedNpc2 = true;
                }

                if(player.direction.eq(k.vec2(0,1))){
                    store.set(textBoxContentAtom, "Horrible day, isn't it?");
                    npc.play("npc-up");
                }

                if(player.direction.eq(k.vec2(1,0))){
                    store.set(textBoxContentAtom, "Boring day, isn't it?");
                    npc.play("npc-left");
                }

                if(player.direction.eq(k.vec2(-1,0))){
                    store.set(textBoxContentAtom, "Cool day, isn't it?");
                    npc.play("npc-right");
                }

                store.set(isTextBoxVisibleAtom, true);



            }

            player.move(player.direction.scale(player.speed));

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
                k.sprite("characters", {anim: "npc-down"}),
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
            k.go("level_two");
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

            //player input to move
            if(k.isKeyDown("left")) player.direction.x = -1; //horizontal stuff
            if(k.isKeyDown("right")) player.direction.x = 1;

            if(k.isKeyDown("up")) player.direction.y = -1;// height stuff
            if(k.isKeyDown("down")) player.direction.y = 1;


            //smooth animations to keep nice cycle

            if(player.direction.eq(k.vec2(-1, 0)) &&
            player.getCurAnim().name !== "left"){
                player.play("left");
            }

            if(player.direction.eq(k.vec2(1, 0)) &&
            player.getCurAnim().name !== "right"){
                player.play("right");
            }

            if(player.direction.eq(k.vec2(0, -1)) &&
            player.getCurAnim().name !== "up"){
                player.play("up");
            }

            if(player.direction.eq(k.vec2(0, 1)) &&
            player.getCurAnim().name !== "down"){
                player.play("down");
            }

            //setting idle animations cool trick to find current anim

            if(player.direction.eq(k.vec2(0, 0)) &&
            !player.getCurAnim().name.includes("idle")){
                player.play(`${player.getCurAnim().name}-idle`);//converts current anim move to string for method
            }

            //if moving diagonally
            if(player.direction.x && player.direction.y){
                player.move(player.direction.scale(DIAGONAL_FACTOR*player.speed));
                return;//to prevent following lines of movement
            }

            //check when colliding from npx
            if(isCollidingNpc && k.isKeyPressed("space")){

                if(player.direction.eq(k.vec2(0,-1))){
                    store.set(textBoxContentAtom, "Get Ready! if you can't do this you will never beat the CSS wizard and King JavaScript HTML HERO");
                    npc.play("npc-down");
                    npc.pos = k.vec2(-100, -100);
                    movedNpc1 = true;
                }

                if(player.direction.eq(k.vec2(0,1))){
                    store.set(textBoxContentAtom, "Horrible day, isn't it?");
                    npc.play("npc-up");
                }

                if(player.direction.eq(k.vec2(1,0))){
                    store.set(textBoxContentAtom, "Boring day, isn't it?");
                    npc.play("npc-left");
                }

                if(player.direction.eq(k.vec2(-1,0))){
                    store.set(textBoxContentAtom, "Cool day, isn't it?");
                    npc.play("npc-right");
                }

                store.set(isTextBoxVisibleAtom, true);



            }

            player.move(player.direction.scale(player.speed));

        })

    });



    k.go("level_one");

}