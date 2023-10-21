import PlantData, { PlantGrowthStage } from "./plantData";

type plantGrowthTiles = {
    width: number,
    height: number,
    tiles: number[]
}

const ROWLENGTH = 25;

export default class PlantGrowthTileSets {

    static PlantType1: plantGrowthTiles[] = [
        {
            width: 1,
            height: 1,
            tiles: [(ROWLENGTH*24) + 0]
        },
        {
            width: 1,
            height: 1,
            tiles: [(ROWLENGTH*25) + 0]
        },
        {
            width: 1,
            height: 2,
            tiles: [
                (ROWLENGTH*26) + 0,
                (ROWLENGTH*27) + 0
            ]
        },
        {
            width: 1,
            height: 3,
            tiles: [
                (ROWLENGTH* 25) + 1,
                (ROWLENGTH* 26) + 1,
                (ROWLENGTH* 27) + 1
            ]
        },
        {
            width: 1,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 2,
                (ROWLENGTH* 25) + 2,
                (ROWLENGTH* 26) + 2,
                (ROWLENGTH* 27) + 2

            ]
        },
        {
            width: 1,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 3,
                (ROWLENGTH* 25) + 3,
                (ROWLENGTH* 26) + 3,
                (ROWLENGTH* 27) + 3
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 25) + 4, (ROWLENGTH* 25) + 5, (ROWLENGTH* 25) + 6,
                (ROWLENGTH* 26) + 4, (ROWLENGTH* 26) + 5, (ROWLENGTH* 26) + 6,
                (ROWLENGTH* 27) + 4, (ROWLENGTH* 27) + 5, (ROWLENGTH* 27) + 6
            ]
        },
        {
            width: 1,
            height: 3,
            tiles: [
                (ROWLENGTH* 25) + 7,
                (ROWLENGTH* 26) + 7,
                (ROWLENGTH* 27) + 7
            ]
        }
    ]

    static PlantType2: plantGrowthTiles[] = [
        {
            width: 3,
            height: 2,
            tiles: [
                (ROWLENGTH* 26) + 8, (ROWLENGTH* 26) + 9, (ROWLENGTH* 26) + 10,
                (ROWLENGTH* 27) + 8, (ROWLENGTH* 27) + 9, (ROWLENGTH* 27) + 10
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 11, (ROWLENGTH* 24) + 12, (ROWLENGTH* 24) + 13,
                (ROWLENGTH* 25) + 11, (ROWLENGTH* 25) + 12, (ROWLENGTH* 25) + 13,
                (ROWLENGTH* 26) + 11, (ROWLENGTH* 26) + 12, (ROWLENGTH* 26) + 13,
                (ROWLENGTH* 27) + 11, (ROWLENGTH* 27) + 12, (ROWLENGTH* 27) + 13,

            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 14, (ROWLENGTH* 24) + 15, (ROWLENGTH* 24) + 16,
                (ROWLENGTH* 25) + 14, (ROWLENGTH* 25) + 15, (ROWLENGTH* 25) + 16,
                (ROWLENGTH* 26) + 14, (ROWLENGTH* 26) + 15, (ROWLENGTH* 26) + 16,
                (ROWLENGTH* 27) + 14, (ROWLENGTH* 27) + 15, (ROWLENGTH* 27) + 16,

            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 17, (ROWLENGTH* 24) + 18, (ROWLENGTH* 24) + 19, (ROWLENGTH* 24) + 20, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 25) + 17, (ROWLENGTH* 25) + 18, (ROWLENGTH* 25) + 19, (ROWLENGTH* 25) + 20, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 26) + 17, (ROWLENGTH* 26) + 18, (ROWLENGTH* 26) + 19, (ROWLENGTH* 26) + 20, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 27) + 17, (ROWLENGTH* 27) + 18, (ROWLENGTH* 27) + 19, (ROWLENGTH* 27) + 20, (ROWLENGTH* 24) + 17,

            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 24) + 21, (ROWLENGTH* 24) + 22, (ROWLENGTH* 24) + 23, (ROWLENGTH* 24) + 24, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 25) + 21, (ROWLENGTH* 25) + 22, (ROWLENGTH* 25) + 23, (ROWLENGTH* 25) + 24, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 26) + 21, (ROWLENGTH* 26) + 22, (ROWLENGTH* 26) + 23, (ROWLENGTH* 26) + 24, (ROWLENGTH* 24) + 17,
                (ROWLENGTH* 27) + 21, (ROWLENGTH* 27) + 22, (ROWLENGTH* 27) + 23, (ROWLENGTH* 27) + 24, (ROWLENGTH* 24) + 17,
            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 28) + 0, (ROWLENGTH* 28) + 1, (ROWLENGTH* 28) + 2, (ROWLENGTH* 28) + 3, (ROWLENGTH* 28) + 0,
                (ROWLENGTH* 29) + 0, (ROWLENGTH* 29) + 1, (ROWLENGTH* 29) + 2, (ROWLENGTH* 29) + 3, (ROWLENGTH* 28) + 0,
                (ROWLENGTH* 30) + 0, (ROWLENGTH* 30) + 1, (ROWLENGTH* 30) + 2, (ROWLENGTH* 30) + 3, (ROWLENGTH* 28) + 0,
                (ROWLENGTH* 31) + 0, (ROWLENGTH* 31) + 1, (ROWLENGTH* 31) + 2, (ROWLENGTH* 31) + 3, (ROWLENGTH* 28) + 0,

            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 28) + 4, (ROWLENGTH* 28) + 5, (ROWLENGTH* 28) + 6, (ROWLENGTH* 28) + 7, (ROWLENGTH* 28) + 4,
                (ROWLENGTH* 29) + 4, (ROWLENGTH* 29) + 5, (ROWLENGTH* 29) + 6, (ROWLENGTH* 29) + 7, (ROWLENGTH* 28) + 4,
                (ROWLENGTH* 30) + 4, (ROWLENGTH* 30) + 5, (ROWLENGTH* 30) + 6, (ROWLENGTH* 30) + 7, (ROWLENGTH* 28) + 4,
                (ROWLENGTH* 31) + 4, (ROWLENGTH* 31) + 5, (ROWLENGTH* 31) + 6, (ROWLENGTH* 31) + 7, (ROWLENGTH* 28) + 4,

            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 28) + 8, (ROWLENGTH* 28) + 9, (ROWLENGTH* 28) + 10, (ROWLENGTH* 28) + 11, (ROWLENGTH* 28) + 8,
                (ROWLENGTH* 29) + 8, (ROWLENGTH* 29) + 9, (ROWLENGTH* 29) + 10, (ROWLENGTH* 29) + 11, (ROWLENGTH* 28) + 8,
                (ROWLENGTH* 30) + 8, (ROWLENGTH* 30) + 9, (ROWLENGTH* 30) + 10, (ROWLENGTH* 30) + 11, (ROWLENGTH* 28) + 8,
                (ROWLENGTH* 31) + 8, (ROWLENGTH* 31) + 9, (ROWLENGTH* 31) + 10, (ROWLENGTH* 31) + 11, (ROWLENGTH* 28) + 8,

            ]
        },
        {
            width: 5,
            height: 4,
            tiles: [
                (ROWLENGTH* 28) + 12, (ROWLENGTH* 28) + 13, (ROWLENGTH* 28) + 14, (ROWLENGTH* 28) + 15, (ROWLENGTH* 28) + 12,
                (ROWLENGTH* 29) + 12, (ROWLENGTH* 29) + 13, (ROWLENGTH* 29) + 14, (ROWLENGTH* 29) + 15, (ROWLENGTH* 28) + 12,
                (ROWLENGTH* 30) + 12, (ROWLENGTH* 30) + 13, (ROWLENGTH* 30) + 14, (ROWLENGTH* 30) + 15, (ROWLENGTH* 28) + 12,
                (ROWLENGTH* 31) + 12, (ROWLENGTH* 31) + 13, (ROWLENGTH* 31) + 14, (ROWLENGTH* 31) + 15, (ROWLENGTH* 28) + 12,

            ]
        }
    ]

    static PlantType3: plantGrowthTiles[] = [
        {
            width: 3,
            height: 1,
            tiles: [
                (ROWLENGTH* 28) + 16, (ROWLENGTH* 29) + 16, (ROWLENGTH* 29) + 17
            ]
        },
        {
            width: 3,
            height: 2,
            tiles: [
                (ROWLENGTH* 28) + 16, (ROWLENGTH* 30) + 16, (ROWLENGTH* 30) + 17,
                (ROWLENGTH* 28) + 16, (ROWLENGTH* 31) + 16, (ROWLENGTH* 31) + 17
            ]
        },
        {
            width: 3,
            height: 2,
            tiles: [
                (ROWLENGTH* 30) + 18, (ROWLENGTH* 30) + 19, (ROWLENGTH* 19) + 19,
                (ROWLENGTH* 31) + 18, (ROWLENGTH* 31) + 19, (ROWLENGTH* 19) + 19
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 29) + 20, (ROWLENGTH* 29) + 21, (ROWLENGTH* 29) + 22,
                (ROWLENGTH* 30) + 20, (ROWLENGTH* 30) + 21, (ROWLENGTH* 30) + 22,
                (ROWLENGTH* 31) + 20, (ROWLENGTH* 31) + 21, (ROWLENGTH* 31) + 22
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 0, (ROWLENGTH* 32) + 1, (ROWLENGTH* 32) + 2,
                (ROWLENGTH* 33) + 0, (ROWLENGTH* 33) + 1, (ROWLENGTH* 33) + 2,
                (ROWLENGTH* 34) + 0, (ROWLENGTH* 34) + 1, (ROWLENGTH* 34) + 2
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 3, (ROWLENGTH* 32) + 4, (ROWLENGTH* 32) + 5,
                (ROWLENGTH* 33) + 3, (ROWLENGTH* 33) + 4, (ROWLENGTH* 33) + 5,
                (ROWLENGTH* 34) + 3, (ROWLENGTH* 34) + 4, (ROWLENGTH* 34) + 5
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 6, (ROWLENGTH* 32) + 7, (ROWLENGTH* 32) + 8,
                (ROWLENGTH* 33) + 6, (ROWLENGTH* 33) + 7, (ROWLENGTH* 33) + 8,
                (ROWLENGTH* 34) + 6, (ROWLENGTH* 34) + 7, (ROWLENGTH* 34) + 8
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 9, (ROWLENGTH* 32) + 10, (ROWLENGTH* 32) + 11,
                (ROWLENGTH* 33) + 9, (ROWLENGTH* 33) + 10, (ROWLENGTH* 33) + 11,
                (ROWLENGTH* 34) + 9, (ROWLENGTH* 34) + 10, (ROWLENGTH* 34) + 11
            ]
        },
    ]

    static PlantType4: plantGrowthTiles[] = [
        {
            width: 3,
            height: 1,
            tiles: [
                (ROWLENGTH* 32) + 12, (ROWLENGTH* 32) + 13, (ROWLENGTH* 32) + 14
            ]
        },
        {
            width: 3,
            height: 2,
            tiles: [
                (ROWLENGTH* 33) + 12, (ROWLENGTH* 33) + 13, (ROWLENGTH* 33) + 14,
                (ROWLENGTH* 34) + 12, (ROWLENGTH* 34) + 13, (ROWLENGTH* 34) + 14
            ]
        },
        {
            width: 3,
            height: 2,
            tiles: [
                (ROWLENGTH* 33) + 15, (ROWLENGTH* 33) + 16, (ROWLENGTH* 33) + 17,
                (ROWLENGTH* 34) + 15, (ROWLENGTH* 34) + 16, (ROWLENGTH* 34) + 17
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 18, (ROWLENGTH* 32) + 19, (ROWLENGTH* 32) + 20,
                (ROWLENGTH* 33) + 18, (ROWLENGTH* 33) + 19, (ROWLENGTH* 33) + 20,
                (ROWLENGTH* 34) + 18, (ROWLENGTH* 34) + 19, (ROWLENGTH* 34) + 20
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 32) + 21, (ROWLENGTH* 32) + 22, (ROWLENGTH* 32) + 23,
                (ROWLENGTH* 33) + 21, (ROWLENGTH* 33) + 22, (ROWLENGTH* 33) + 23,
                (ROWLENGTH* 34) + 21, (ROWLENGTH* 34) + 22, (ROWLENGTH* 34) + 23
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 35) + 0, (ROWLENGTH* 35) + 1, (ROWLENGTH* 35) + 2,
                (ROWLENGTH* 36) + 0, (ROWLENGTH* 36) + 1, (ROWLENGTH* 36) + 2,
                (ROWLENGTH* 37) + 0, (ROWLENGTH* 37) + 1, (ROWLENGTH* 37) + 2
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 35) + 3, (ROWLENGTH* 35) + 4, (ROWLENGTH* 35) + 5,
                (ROWLENGTH* 36) + 3, (ROWLENGTH* 36) + 4, (ROWLENGTH* 36) + 5,
                (ROWLENGTH* 37) + 3, (ROWLENGTH* 37) + 4, (ROWLENGTH* 37) + 5
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 35) + 6, (ROWLENGTH* 35) + 7, (ROWLENGTH* 35) + 8,
                (ROWLENGTH* 36) + 6, (ROWLENGTH* 36) + 7, (ROWLENGTH* 36) + 8,
                (ROWLENGTH* 37) + 6, (ROWLENGTH* 37) + 7, (ROWLENGTH* 37) + 8
            ]
        },
    ]

    static PlantType5: plantGrowthTiles[] = [
        {
            width: 1,
            height: 1,
            tiles: [
                (ROWLENGTH* 35) + 9
            ]
        },
        {
            width: 1,
            height: 2,
            tiles: [
                (ROWLENGTH* 36) + 9,
                (ROWLENGTH* 37) + 9
            ]
        },
        {
            width: 3,
            height: 3,
            tiles: [
                (ROWLENGTH* 35) + 10, (ROWLENGTH* 35) + 11, (ROWLENGTH* 35) + 12,
                (ROWLENGTH* 36) + 10, (ROWLENGTH* 36) + 11, (ROWLENGTH* 36) + 12,
                (ROWLENGTH* 37) + 10, (ROWLENGTH* 37) + 11, (ROWLENGTH* 37) + 12,
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 35) + 13, (ROWLENGTH* 35) + 14, (ROWLENGTH* 35) + 15,
                (ROWLENGTH* 36) + 13, (ROWLENGTH* 36) + 14, (ROWLENGTH* 36) + 15,
                (ROWLENGTH* 37) + 13, (ROWLENGTH* 37) + 14, (ROWLENGTH* 37) + 15,
                (ROWLENGTH* 38) + 13, (ROWLENGTH* 38) + 14, (ROWLENGTH* 38) + 15,
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 35) + 16, (ROWLENGTH* 35) + 17, (ROWLENGTH* 35) + 18,
                (ROWLENGTH* 36) + 16, (ROWLENGTH* 36) + 17, (ROWLENGTH* 36) + 18,
                (ROWLENGTH* 37) + 16, (ROWLENGTH* 37) + 17, (ROWLENGTH* 37) + 18,
                (ROWLENGTH* 38) + 16, (ROWLENGTH* 38) + 17, (ROWLENGTH* 38) + 18,
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 35) + 19, (ROWLENGTH* 35) + 20, (ROWLENGTH* 35) + 21,
                (ROWLENGTH* 36) + 19, (ROWLENGTH* 36) + 20, (ROWLENGTH* 36) + 21,
                (ROWLENGTH* 37) + 19, (ROWLENGTH* 37) + 20, (ROWLENGTH* 37) + 21,
                (ROWLENGTH* 38) + 19, (ROWLENGTH* 38) + 20, (ROWLENGTH* 38) + 21,
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 35) + 22, (ROWLENGTH* 35) + 23, (ROWLENGTH* 35) + 24,
                (ROWLENGTH* 36) + 22, (ROWLENGTH* 36) + 23, (ROWLENGTH* 36) + 24,
                (ROWLENGTH* 37) + 22, (ROWLENGTH* 37) + 23, (ROWLENGTH* 37) + 24,
                (ROWLENGTH* 38) + 22, (ROWLENGTH* 38) + 23, (ROWLENGTH* 38) + 24,
            ]
        },
        {
            width: 3,
            height: 4,
            tiles: [
                (ROWLENGTH* 38) + 0, (ROWLENGTH* 38) + 1, (ROWLENGTH* 38) + 2,
                (ROWLENGTH* 39) + 0, (ROWLENGTH* 39) + 1, (ROWLENGTH* 39) + 2,
                (ROWLENGTH* 40) + 0, (ROWLENGTH* 40) + 1, (ROWLENGTH* 40) + 2,
                (ROWLENGTH* 41) + 0, (ROWLENGTH* 41) + 1, (ROWLENGTH* 41) + 2,
            ]
        }
    ]

    static randomPlantType(): plantGrowthTiles[] {
        
        let plantTypes = [
            PlantGrowthTileSets.PlantType1, PlantGrowthTileSets.PlantType2, PlantGrowthTileSets.PlantType3,
            PlantGrowthTileSets.PlantType4, PlantGrowthTileSets.PlantType5
        ];

        let choice = plantTypes[Math.floor(Math.random() * plantTypes.length)];

        return choice;
    }

    static AddToTileSet(plantData: PlantData, tileIndexData: number[][]){


        if(!plantData.alive){
            return tileIndexData;
        } else {

            let aerialTileInfo = (plantData.plantGrowthType[plantData.plantGrowthStage] as plantGrowthTiles );

            let xOffset = (aerialTileInfo.width - 1)/2;
    
            for(let x = -xOffset; x <= xOffset; x++){
                for(let y = 0; y < aerialTileInfo.height; y++){
                    tileIndexData[plantData.startPos.y + y - (aerialTileInfo.height)][plantData.startPos.x + x] = aerialTileInfo.tiles[(x + xOffset) + (y * (aerialTileInfo.width))]
                }
            }
        }

    }


}
