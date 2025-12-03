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
                k.pos(1480, 500),
        ]);

        //collison logic for walls
        


        //wall collions end
        

        

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
            k.pos(k.center()),
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
                    store.set(textBoxContentAtom, "Beautiful day, isn't it?");
                    npc.play("npc-down");
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

    k.scene("level_two", () => {
        const DIAGONAL_FACTOR = 1/Math.sqrt(2);
        let isCollidingNpc = false;

        k.add([k.sprite("background2"), k.pos(0, -70), k.scale(8)]);

        const npc = k.add([
                k.sprite("characters", {anim: "npc-left"}),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(1480, 500),
        ]);

        //collison logic for walls
        


        //wall collions end
        
        //warp collison
        const warpToThree = k.add([
                k.pos(890, 0),
                k.rect(128, 16), 
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.8),
                
        ]);

        warpToThree.onCollide("player", () => {

            k.go("level_three");

        })
        

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
            k.pos(k.center()),
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
                    store.set(textBoxContentAtom, "Beautiful day, isn't it?");
                    npc.play("npc-down");
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

        const npc = k.add([
                k.sprite("characters", {anim: "npc-left"}),
                k.area(),
                k.body({isStatic: true}),
                k.anchor("center"),
                k.scale(8),
                k.pos(1480, 500),
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


        //wall collions end
        
        //warp collison
        const warpToTwo = k.add([
                k.pos(890, 0),
                k.rect(128, 16), 
                k.area(),
                k.anchor("center"),
                k.scale(8),
                k.opacity(0.0),
                
        ]);

        warpToTwo.onCollide("player", () => {
            k.go("level_two");
        })
        

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
            k.pos(1200, 990),
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
                    store.set(textBoxContentAtom, "Beautiful day, isn't it?");
                    npc.play("npc-down");
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