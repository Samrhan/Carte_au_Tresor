import {Adventurer, Coordinate, Dimension, Mountain, Movement, Orientation, Treasure} from "./structures";

export class MapService {
    mountains: Mountain[] = [];
    treasures: Treasure[] = [];
    adventurers: Adventurer[] = [];

    width: number;
    height: number;

    grid: number[][] = [];

    constructor(dimension: Dimension) {
        this.width = dimension.width;
        this.height = dimension.height;
    }

    addMountain(mountain: Mountain) {
        if (!this.checkCoordinates(mountain.coordinates)) {
            throw new Error('Invalid mountain coordinates: ' + mountain.coordinates.x + ',' + mountain.coordinates.y);
        }
        this.mountains.push(mountain);
    }

    addTreasure(treasure: Treasure) {
        if (!this.checkCoordinates(treasure.coordinates)) {
            throw new Error('Invalid treasure coordinates: ' + treasure.coordinates.x + ',' + treasure.coordinates.y);
        }
        this.treasures.push(treasure);
    }

    addAdventurer(adventurer: Adventurer) {
        if (!this.checkCoordinates(adventurer.coordinates)) {
            throw new Error('Invalid adventurer coordinates: ' + adventurer.coordinates.x + ',' + adventurer.coordinates.y);
        }
        this.adventurers.push(adventurer);
    }

    /**
     * Check if the coordinates are valid.
     * @param coordinates
     */
    checkCoordinates(coordinates: Coordinate): boolean {
        return coordinates.x >= 0 && coordinates.x < this.width && coordinates.y >= 0 && coordinates.y < this.height;
    }

    /**
     * Reset the grid so we can build a new one
     */
    resetGrid() {
        for (let i = 0; i < this.height; i++) {
            this.grid[i] = new Array(this.width).fill(0);
        }
    }

    /**
     * build the grid with mountains, treasures and adventurers
     * The grid will help us to know if we can move to a certain position, and if there is treasure.
     * If the value is -2, it means that there is an adventurer.
     * If the value is -1, it means that there is a mountain.
     * If the value is 0, it means that there is no mountain nor treasure.
     * If the value is > 1, it means that there is treasure.
     */
    buildGrid() {
        this.resetGrid();

        for (const mountain of this.mountains) {
            this.grid[mountain.coordinates.y][mountain.coordinates.x] = -1;
        }

        for (const treasure of this.treasures) {
            this.grid[treasure.coordinates.y][treasure.coordinates.x] = treasure.amount;
        }

        for (const adventurer of this.adventurers) {
            this.grid[adventurer.coordinates.y][adventurer.coordinates.x] = -2;
        }
    }

    /**
     * Display the grid in the console
     */
    displayGrid() {
        for (let i = 0; i < this.height; i++) {
            let line = '';
            for (let j = 0; j < this.width; j++) {
                const value = this.grid[i][j];
                switch (value) {
                    case -2:
                        let adventurerName = this.adventurers.find(adventurer => adventurer.coordinates.x === j && adventurer.coordinates.y === i)?.name;

                        // Just in case the adventurer name is too long, we truncate it, in order to fit in the console.
                        if (adventurerName && adventurerName.length > 4) {
                            adventurerName = adventurerName.substring(0, 3) + '…';
                        }
                        line += `A(${adventurerName})\t`;
                        break;

                    case -1:
                        line += 'M\t';
                        break;

                    case 0:
                        line += '.\t';
                        break;

                    default:
                        if (value.toString().length > 4) {
                            line += `T(${value.toString().substring(0, 3)}…)\t`;
                        } else {
                            line += `T(${value})\t`;
                        }
                }
            }
            console.log(line);
        }
        console.log('\n');
    }

    /**
     * Compute the movement of the adventurer
     * @param verbose: if true, the movement and the grid will be displayed in the console for each adventurer and step
     * @param hardcoreMode: if true, the adventurer will not be able to go out of the map and will die if he tries to.
     */
    explore(verbose: boolean = false, hardcoreMode: boolean = false) {
        // Getting the max possible movements for each adventurer
        const maxMovements = Math.max(...this.adventurers.map((a) => a.movements.length));

        this.buildGrid();

        for (let i = 0; i < maxMovements; i++) {
            for (const adventurer of this.adventurers) {
                const movement = adventurer.movements[i];
                if (!movement) {
                    // Could happen if there's one adventurer with fewer movements than the others.
                    continue;
                }
                if (movement === Movement.TURN_RIGHT || movement === Movement.TURN_LEFT) {
                    adventurer.orientation = MapService.computeNewOrientation(adventurer.orientation, movement);

                    if (verbose) {
                        console.log(`${adventurer.name} turns ${movement === Movement.TURN_RIGHT ? 'right' : 'left'} and is now facing ${adventurer.orientation}`);
                    }
                    continue;
                }

                const newCoordinates = MapService.computeNewCoordinates(adventurer.coordinates, adventurer.orientation);

                if (newCoordinates.x < 0 || newCoordinates.x >= this.width || newCoordinates.y < 0 || newCoordinates.y >= this.height) {
                    // Check if we are out of the map
                    // It was not mentioned what to do in this case, so I ehh, improvised.
                    if (hardcoreMode) {
                        if (verbose) {
                            console.log(`${adventurer.name} crossed the border and was killed by a wild animal, and all the recovered treasures were lost. This is a sad story.`);
                        }
                        this.adventurers = this.adventurers.filter((a) => a.name !== adventurer.name);
                    } else if (verbose) {
                        console.log(`${adventurer.name} tried to cross the border but, overcome with fear, turned back.`);
                    }
                    continue;
                }

                if (this.grid[newCoordinates.y][newCoordinates.x] === 0) {
                    adventurer.coordinates = newCoordinates;
                    if (verbose) {
                        console.log(`${adventurer.name} moved to ${adventurer.coordinates.x},${adventurer.coordinates.y}`);
                    }
                } else if (this.grid[newCoordinates.y][newCoordinates.x] > 0) {
                    // Check if we found a treasure, and if we actually moved to this position
                    adventurer.coordinates = newCoordinates;
                    adventurer.treasure += 1;

                    const treasureIndex = this.treasures.findIndex((t) => t.coordinates.x === newCoordinates.x && t.coordinates.y === newCoordinates.y);
                    if (treasureIndex !== -1) {
                        this.treasures[treasureIndex].amount -= 1;
                        if (this.treasures[treasureIndex].amount === 0) {
                            this.treasures.splice(treasureIndex, 1);
                        }
                    }
                    if (verbose) {
                        console.log(`${adventurer.name} moved to ${adventurer.coordinates.x},${adventurer.coordinates.y} and found a treasure! Carrying ${adventurer.treasure} treasure${adventurer.treasure > 1 ? 's' : ''}.`);
                    }
                } else {
                    if (verbose) {
                        console.log(`${adventurer.name} couldn't move this time, there was ${this.grid[newCoordinates.y][newCoordinates.x] === -1 ? 'a mountain' : 'an adventurer'} blocking the way`);
                    }
                    continue;
                }
                this.buildGrid();
                if (verbose) {
                    this.displayGrid()
                }

            }
        }

        for (const adventurer of this.adventurers) {
            if (verbose) {
                console.log(`${adventurer.name} ended at (${adventurer.coordinates.x}, ${adventurer.coordinates.y}) with ${adventurer.treasure} treasure${adventurer.treasure > 1 ? 's' : ''}.`);
            }
        }
    }

    /**
     * Compute the new coordinates of the adventurer, based on the orientation.
     * @param coordinates
     * @param orientation
     * @returns {Coordinate}
     * @private
     */
    private static computeNewCoordinates(coordinates: Coordinate, orientation: Orientation): Coordinate {
        switch (orientation) {
            case Orientation.NORTH:
                return {x: coordinates.x, y: coordinates.y - 1};
            case Orientation.EAST:
                return {x: coordinates.x + 1, y: coordinates.y};
            case Orientation.SOUTH:
                return {x: coordinates.x, y: coordinates.y + 1};
            case Orientation.WEST:
                return {x: coordinates.x - 1, y: coordinates.y};
        }
    }

    /**
     * Compute the new orientation of the adventurer, based on the movement and the orientation.
     * @param orientation
     * @param movement
     * @returns {Orientation}
     * @private
     */
    private static computeNewOrientation(orientation: Orientation, movement: Movement): Orientation {
        switch (movement) {
            case Movement.TURN_RIGHT:
                switch (orientation) {
                    case Orientation.NORTH:
                        return Orientation.EAST;
                    case Orientation.EAST:
                        return Orientation.SOUTH;
                    case Orientation.SOUTH:
                        return Orientation.WEST;
                    case Orientation.WEST:
                        return Orientation.NORTH;
                }
                break;

            case Movement.TURN_LEFT:
                switch (orientation) {
                    case Orientation.NORTH:
                        return Orientation.WEST;
                    case Orientation.EAST:
                        return Orientation.NORTH;
                    case Orientation.SOUTH:
                        return Orientation.EAST;
                    case Orientation.WEST:
                        return Orientation.SOUTH;
                }
                break;

            case Movement.ADVANCE:
                // We should never be here, because we should have already checked the orientation.
                return orientation;
        }
    }

    /**
     * Serialize the data of the map to be saved in a file with the right format.
     */
    serialize(): string {
        let stringToWrite = ''
        stringToWrite += `C - ${this.width} - ${this.height}\n`

        if (this.mountains.length > 0) {
            stringToWrite += '# {M comme Montagne} - {Axe horizontal} - {Axe vertical}\n'
        }
        for (const mountain of this.mountains) {
            stringToWrite += `M - ${mountain.coordinates.x} - ${mountain.coordinates.y}\n`
        }

        if (this.treasures.length > 0) {
            stringToWrite += '# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}\n'
        }
        for (const treasure of this.treasures) {
            stringToWrite += `T - ${treasure.coordinates.x} - ${treasure.coordinates.y} - ${treasure.amount}\n`
        }

        if (this.adventurers.length > 0) {
            stringToWrite += '# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}\n'
        }
        for (const adventurer of this.adventurers) {
            stringToWrite += `A - ${adventurer.name} - ${adventurer.coordinates.x} - ${adventurer.coordinates.y} - ${adventurer.orientation} - ${adventurer.treasure}\n`
        }

        return stringToWrite;
    }
}
