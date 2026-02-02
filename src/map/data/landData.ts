import PlantData, { Position } from "../../plant/plantData";
import { BiomeType } from "./biomeManager";
import { BiomeBase } from "./biomes/biomeInterface";
import { LandTypes } from "./landGenerator";
import MapData from "./mapData";

/**
 * Represents a single tile of land within the game world.
 * Manages environmental stats, biome affiliation, and structural integrity.
 */
class LandData {

    /** The grid-based coordinate of this land tile. */
    pos: Position;
    
    /** The specific classification of land (e.g., Sandy, Normal). Defaults to {@link LandTypes.None}. */
    landType = LandTypes.None;
    
    /** Remaining durability of the tile before it turns into a hole. */
    landStrength = 0;
    
    /** Indicates if the tile contains phosphorous nutrients. */
    phosphorous = false;
    
    /** Current water level present on this tile. */
    water = 0;

    /** Reference to the biome object this tile currently belongs to. */
    biome: BiomeBase;
    
    /** The type of biome currently influencing this tile. */
    biomeType: BiomeType;
    
    /** Stores the index and relative offset position within its biome. */
    biomeIndex = {index: -1, pos: {x: 0, y: 0}};

    /** Reference to the global map data container. */
    mapData: MapData;

    /**
     * @param landType - The initial type of land to generate.
     * @param pos - The grid coordinates for this tile.
     * @param mapData - The parent map data reference.
     */
    constructor(landType: LandTypes, pos: Position, mapData: MapData){
        this.landType = landType;
        this.pos = pos;
        this.mapData = mapData;
        this.initStrength();
    }

    /**
     * Initializes the `landStrength` based on the current `landType`.
     * @internal
     */
    initStrength() {
        switch(this.landType){
            case LandTypes.Normal:
                this.landStrength = 1;
                break;
            case LandTypes.Sandy:
                this.landStrength = 0.5;
                break;
            case LandTypes.DeadRoot:
                this.landStrength = 2;
                break;
            default:
                this.landStrength = 0;
                break;
        }
    }

    /**
     * Simulates a combat interaction between a plant and the land.
     * Reduces land strength and plant strength simultaneously.
     * * @param plant - The plant data instance initiating the attack.
     * @returns `true` if the land was destroyed (strength <= 0), `false` otherwise.
     */
    public attack(plant: PlantData): boolean {
        const effort = this.landStrength;
        this.landStrength -= plant.strength;
        plant.strength -= effort;
        if(this.landStrength <= 0){
            this.destroy();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if the tile is a valid land mass (not a hole or empty space).
     */
    public isLand(){
        return (this.landType !== LandTypes.Hole && this.landType !== LandTypes.None)
    }

    /**
     * Checks if there is any water value assigned to this tile.
     */
    hasWater(){
        return this.water > 0;
    }

    /**
     * Fully destroys the tile, clearing its data and removing its visual representation
     * from the tilemap layers (decoration and mineral).
     */
    public destroy(){
        this.destroy_data_only()
        const mapDisplay = this.mapData._mapManager.mapDisplay;
        const decoLayer = mapDisplay.tilemap_layers.get('decoration');
        const mineralLayer = mapDisplay.tilemap_layers.get('mineral');

        // Remove decoration if it exists at its offset position
        decoLayer?.putTileAt(-1, this.pos.x + this.biomeIndex.pos.x, this.pos.y + this.biomeIndex.pos.y);
        
        // Remove mineral visual
        mineralLayer?.putTileAt(-1, this.pos.x, this.pos.y);
    }

    /**
     * Dissociates this tile from its current biome and resets environmental stats.
     */
    removeFromBiome(){
        this.biome.landData = this.biome.landData.filter(tile => tile !== this);
        this.biome = undefined;
        this.biomeType = undefined;
        this.water = 0;
        this.phosphorous = false;
        this.biomeIndex = {index: -1, pos: {x: 0, y: 0}};
        this.landStrength = 0;
    }

    /**
     * Resets internal data properties to a "Hole" state without affecting the visual tilemap.
     */
    public destroy_data_only(){
        this.landType = LandTypes.Hole;
        this.landStrength = 0;
        this.biomeIndex = {index: -1, pos: {x: 0, y: 0}}
        this.phosphorous = false;
        this.water = 0;
    }

}

export default LandData;