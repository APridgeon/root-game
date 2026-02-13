import * as Phaser from 'phaser';
import { Events } from "../events/events";
import Game_Config from "../game_config";
import TreeComponents, { TreeType } from "./aerialTreeTiles";
import { Position } from "./plantData";

/**
 * Represents an active growing point (meristem) of the tree.
 * Handles the individual state of a branch tip.
 */
export class GrowthBud {
    /** Current world position of the bud */
    pos: Position;
    /** Relative angle of growth in degrees */
    angle: number;
    /** How many growth cycles this specific bud has existed */
    life: number;
    /** Multiplier for the length of growth segments */
    growthLength: number;
    /** The species/type of tree this bud belongs to */
    treeType: TreeType;
    /** Whether this bud is still actively extending */
    growing: boolean = true;
    /** Index for the specific leaf sprite variation chosen for this bud */
    leafChoice: number;

    /**
     * @param pos Starting position
     * @param angle Initial angle offset
     * @param life Starting life age
     * @param growthLength Speed/length of extension
     * @param treeType Species type
     */
    constructor(pos: Position, angle: number, life: number, growthLength: number, treeType: TreeType) {
        this.pos = pos;
        this.angle = angle;
        this.life = life;
        this.growthLength = growthLength;
        this.treeType = treeType;

        this.leafChoice = Phaser.Math.RND.between(0, TreeComponents.treeTypeLeafMap.get(this.treeType).length - 1);
    }
}

/**
 * Configuration object defining the procedural DNA of a tree.
 */
export type TreeSettings = {
    /** Seed string for the random number generator to ensure deterministic growth */
    seed: string,
    /** Current cumulative age of the entire tree */
    life: number,
    /** Current thickness of the trunk/branches */
    lineWidth: number,
    /** Rate at which branches get thinner as the tree grows (0-1) */
    lineWidthDecrease: number,
    /** Base distance covered in one growth step */
    growthAmount: number,
    /** Random variance in degrees applied to growth direction */
    wobbliness: number,
    /** Frequency of branching (steps between new shoots) */
    internodeLength: number,
    /** Minimum tree age before branching is allowed */
    branchDelay: number,
    /** Maximum number of active buds allowed */
    abilityToBranch: number,
    /** Life threshold where secondary branches stop growing */
    newBranchesTerminateSooner: number,
    /** Minimum bud age before leaves start appearing */
    startLeafGrowth: number,
    /** Base color used for leaf tinting */
    color: Phaser.Display.Color,
    /** The species template to use for assets */
    treeType: TreeType
}

/**
 * The main Tree controller. 
 * Manages a collection of {@link GrowthBud} objects and renders them to a Phaser Graphics object.
 */
export class Tree {
    /** Cached scale from global config */
    private readonly scale = Game_Config.MAP_SCALE;
    /** List of active leaf sprite objects */
    private leafClumps: Phaser.GameObjects.Image[] = [];
    /** Collection of all active and inactive growth points */
    public buds: GrowthBud[] = [];

    /**
     * @param pos Root position of the tree
     * @param treeSettings Procedural generation parameters
     * @param graphics The Graphics object used to draw the wood/branches
     * @param scene The parent Phaser scene
     */
    constructor(
        private pos: Position,
        public treeSettings: TreeSettings,
        private graphics: Phaser.GameObjects.Graphics,
        private scene: Phaser.Scene
    ) {
        this.initGrowth();
        this.setupListeners();
    }

    /**
     * Initializes the seed and triggers the starting growth burst.
     */
    private initGrowth() {
        this.buds.push(new GrowthBud(this.pos, 0, 0, 1, this.treeSettings.treeType));
        Phaser.Math.RND.sow([`${this.treeSettings.seed}`]);
        
        for (let i = 0; i < 10; i++) {
            this.generateTree();
        }
    }

    /**
     * Subscribes to global game events and handles cleanup.
     */
    private setupListeners() {
        const uiScene = this.scene.scene.get('UI');
        uiScene.events.on(Events.TurnConfirm, this.generateTree, this);
        
        this.scene.events.once('shutdown', () => {
            uiScene.events.off(Events.TurnConfirm, this.generateTree, this);
        });
    }

    /**
     * Primary growth loop. Iterates through all buds to extend branches and spawn leaves.
     */
    private generateTree() {
        this.clearLeaves();

        this.buds.forEach((bud, index) => {
            if (!bud.growing) {
                this.drawLeafClump(bud);
                return;
            }

            this.drawBranchSegment(bud);
            this.updateBudPosition(bud);
            
            bud.life++;

            if (this.shouldBranch(bud, index)) {
                this.createNewBranch(bud);
            }

            this.handleGrowthMilestones(bud, index);
        });

        this.updateGlobalTreeStats();
    }

    /** Sets the line style and moves the "pen" to the current bud position */
    private drawBranchSegment(bud: GrowthBud) {
        const colors = [0x816976, 0x4a3838];
        const branchColor = colors[Phaser.Math.RND.between(0, 1)];
        const branchWidth = this.treeSettings.lineWidth * this.scale;

        this.graphics.lineStyle(branchWidth, branchColor);
        this.graphics.beginPath();
        this.graphics.moveTo(bud.pos.x, bud.pos.y);
    }

    /** Calculates next position based on angle and wobbliness */
    private updateBudPosition(bud: GrowthBud) {
        let angle = Phaser.Math.RND.between(
            90 - this.treeSettings.wobbliness, 
            90 + this.treeSettings.wobbliness
        ) + bud.angle;

        if (bud.pos.y > this.pos.y - (10 * this.scale)) {
            angle = Phaser.Math.Clamp(angle, 0, 180);
        }

        const rad = Phaser.Math.DegToRad(angle);
        const dist = this.treeSettings.growthAmount * bud.growthLength * this.scale;

        bud.pos.x -= Math.cos(rad) * dist;
        bud.pos.y -= Math.sin(rad) * dist;

        this.graphics.lineTo(bud.pos.x, bud.pos.y);
        this.graphics.stroke();
    }

    /** Determines if a bud is eligible to split into a new branch */
    private shouldBranch(bud: GrowthBud, index: number): boolean {
        return (
            this.treeSettings.life > this.treeSettings.branchDelay &&
            bud.life % this.treeSettings.internodeLength === 0 &&
            index < this.treeSettings.abilityToBranch
        );
    }

    /** Spawns a new GrowthBud at the current position with a random angle */
    private createNewBranch(bud: GrowthBud) {
        const newAngle = Phaser.Math.RND.between(0, 90) * Phaser.Math.RND.sign();
        this.buds.push(new GrowthBud({ ...bud.pos }, newAngle, 0, bud.growthLength, this.treeSettings.treeType));
    }

    /** Checks life thresholds for leaf spawning and growth termination */
    private handleGrowthMilestones(bud: GrowthBud, index: number) {
        const isTrunk = index === 0;

        if (bud.life > this.treeSettings.startLeafGrowth && !isTrunk) {
            this.drawLeafClump(bud);
        }

        if (bud.life > this.treeSettings.newBranchesTerminateSooner && !isTrunk) {
            this.drawLeafClump(bud);
            bud.growing = false;
        }
    }

    /** Ages the tree and reduces the line width for future segments */
    private updateGlobalTreeStats() {
        this.treeSettings.life += 1;
        this.treeSettings.lineWidth = Math.max(1, this.treeSettings.lineWidth * this.treeSettings.lineWidthDecrease);
    }

    /**
     * Renders a 3-layer tinted leaf clump at the bud's position.
     * @param bud The bud where leaves should be drawn
     */
    private drawLeafClump(bud: GrowthBud) {
        const { color, treeType } = this.treeSettings;
        const leafFrames = TreeComponents.treeTypeLeafMap.get(treeType)[bud.leafChoice];
        
        const tints = [
            color.clone().setFromHSV(color.h, 0.37, 0.32).color,
            color.clone().setFromHSV(this.wrapHue(color.h - 0.2), 0.54, 0.50).color,
            color.clone().setFromHSV(this.wrapHue(color.h - 0.4), 0.4, 0.6).color
        ];

        const layers = [leafFrames.bottom, leafFrames.middle, leafFrames.top];
        
        layers.forEach((frame, i) => {
            const img = this.scene.add.image(bud.pos.x, bud.pos.y, 'trees', frame)
                .setScale(this.scale)
                .setTint(tints[i])
                .setDepth(5);
            this.leafClumps.push(img);
        });
    }

    /** Helper to ensure Hue values stay within the 0-1 range */
    private wrapHue = (h: number) => h < 0 ? h + 1 : h;

    /** Removes leaf sprites from the scene without clearing the bud history */
    private clearLeaves() {
        this.leafClumps.forEach(c => c.destroy());
        // this.leafClumps = [];
    }

    /**
     * Fully resets the tree state.
     */
    public clear() {
        this.clearLeaves();
        this.buds = [];
    }
}