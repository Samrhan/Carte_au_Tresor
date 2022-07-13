import {Adventurer, Coordinate, Dimension, Mountain, Movement, Orientation, Treasure} from "./structures";

export class MapService {
    mountains: Mountain[] = [];
    treasures: Treasure[] = [];
    adventurers: Adventurer[] = [];
    width!: number;
    height!: number;

    grid: number[][] = [];

    setSize(dimension: Dimension) {
        this.width = dimension.width;
        this.height = dimension.height;
    }

    addMountain(data: Mountain) {
        this.mountains.push(data);
    }

    addTreasure(data: Treasure) {
        this.treasures.push(data);
    }

    addAdventurer(data: Adventurer) {
        this.adventurers.push(data);
    }

    /**
     * Reset the grid so we can build a new one
     */
    resetGrid() {
        for (let i = 0; i < this.height; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    /**
     * build the grid with mountains, treasures and adventurers
     * The grid will help us to know if we can move to a certain position, and if there is treasure.
     * If the value is -1, it means that there is a mountain.
     * If the value is 0, it means that there is no mountain nor treasure.
     * If the value is 1, it means that there is an adventurer.
     * If the value is > 1, it means that there is treasure.
     */
    buildGrid() {
        this.resetGrid();

        for (const mountain of this.mountains) {
            this.grid[mountain.coordinates.y][mountain.coordinates.x] = -1;
        }

        for (const treasure of this.treasures) {
            this.grid[treasure.coordinates.y][treasure.coordinates.x] = treasure.amount + 1;
        }

        for (const adventurer of this.adventurers) {
            this.grid[adventurer.coordinates.y][adventurer.coordinates.x] = 1;
        }
    }

    /**
     * Compute the new coordinates of the adventurer
     */

    displayGrid() {
        // Display the grid in the console, width and height are set in the service.
        for (let i = 0; i < this.height; i++) {
            let line = '';
            for (let j = 0; j < this.width; j++) {
                const value = this.grid[i][j];
                switch (value) {
                    case -1:
                        line += 'M\t';
                        break;
                    case 0:
                        line += '.\t';
                        break;
                    case 1:
                        line += `A(${this.adventurers.find((a) => a.coordinates.x === j && a.coordinates.y === i)?.name})\t`;
                        break;
                    default:
                        // We add 1 to the value because the value 1 is reserved for the adventurer.
                        line += `T(${value - 1})\t`;
                }
            }
            console.log(line);
        }
        console.log('\n');
    }

    /**
     * Compute the movement of the adventurer
     * @param verbose: if true, the movement and the grid will be displayed in the console for each adventurer and step
     */
    computeMovements(verbose: boolean = false) {
        const maxMovements = Math.max(...this.adventurers.map((a) => a.movements.length));

        for (let i = 0; i < maxMovements; i++) {
            for (const adventurer of this.adventurers) {
                const movement = adventurer.movements[i];
                if (movement === Movement.TURN_RIGHT || movement === Movement.TURN_LEFT) {
                    adventurer.orientation = MapService.computeNewOrientation(adventurer.orientation, movement);
                    if(verbose) {
                        console.log(`${adventurer.name} turns ${movement === Movement.TURN_RIGHT ? 'right' : 'left'} and is now facing ${adventurer.orientation}`);
                    }
                    break;
                }
                const newCoordinates = this.computeNewCoordinates(adventurer.coordinates, adventurer.orientation);
                if (this.grid[newCoordinates.y][newCoordinates.x] === 0) {
                    adventurer.coordinates = newCoordinates;
                } else if (this.grid[newCoordinates.y][newCoordinates.x] > 1 && !(newCoordinates.x === adventurer.coordinates.x && newCoordinates.y === adventurer.coordinates.y)) {
                    adventurer.coordinates = newCoordinates;
                    adventurer.treasure += 1;
                    const treasureIndex = this.treasures.findIndex((t) => t.coordinates.x === newCoordinates.x && t.coordinates.y === newCoordinates.y);
                    if (treasureIndex !== -1) {
                        this.treasures[treasureIndex].amount -= 1;
                        if (this.treasures[treasureIndex].amount === 0) {
                            this.treasures.splice(treasureIndex, 1);
                        }
                    }
                }
                this.buildGrid();
                if (verbose) {
                    console.log(`${adventurer.name} moved to ${adventurer.coordinates.x},${adventurer.coordinates.y}`);
                    this.displayGrid()
                }
            }
        }
    }

    /**
     * Compute the new coordinates of the adventurer, based on the movement and the orientation.
     * @param coordinates
     * @param orientation
     * @returns {Coordinate}
     * @private
     */
    private computeNewCoordinates(coordinates: Coordinate, orientation: Orientation): Coordinate {
        let coordinatesToReturn: Coordinate;
        switch (orientation) {
            case Orientation.NORTH:
                coordinatesToReturn = {x: coordinates.x, y: coordinates.y - 1};
                break;
            case Orientation.EAST:
                coordinatesToReturn = {x: coordinates.x + 1, y: coordinates.y};
                break;
            case Orientation.SOUTH:
                coordinatesToReturn = {x: coordinates.x, y: coordinates.y + 1};
                break;
            case Orientation.WEST:
                coordinatesToReturn = {x: coordinates.x - 1, y: coordinates.y};
                break;
            default:
                throw new Error('Unknown orientation');
        }
        // We check if the new coordinates are in the grid.
        if (coordinatesToReturn.x < 0 || coordinatesToReturn.x >= this.width || coordinatesToReturn.y < 0 || coordinatesToReturn.y >= this.height) {
            // If the new coordinates are out of the grid, we place them on the opposite side of the grid.
            if (coordinatesToReturn.x < 0) {
                coordinatesToReturn.x = this.width - 1;
            }
            if (coordinatesToReturn.x >= this.width) {
                coordinatesToReturn.x = 0;
            }
            if (coordinatesToReturn.y < 0) {
                coordinatesToReturn.y = this.height - 1;
            }
            if (coordinatesToReturn.y >= this.height) {
                coordinatesToReturn.y = 0;
            }
        }

        return coordinatesToReturn;
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
                    default:
                        throw new Error('Unknown orientation');
                }
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
                    default:
                        throw new Error('Unknown orientation');
                }
            case Movement.ADVANCE:
                return orientation;
        }
    }

    serialize(): string {
        let stringToWrite = ''
        stringToWrite += `C - ${this.width} - ${this.height}\n`
        stringToWrite += '# {M comme Montagne} - {Axe horizontal} - {Axe vertical}\n'
        for (const mountain of this.mountains) {
            stringToWrite += `M - ${mountain.coordinates.x} - ${mountain.coordinates.y}\n`
        }
        stringToWrite += '# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}\n'
        for (const treasure of this.treasures) {
            stringToWrite += `T - ${treasure.coordinates.x} - ${treasure.coordinates.y} - ${treasure.amount}\n`
        }
        stringToWrite += '# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}\n'
        for (const adventurer of this.adventurers) {
            stringToWrite += `A - ${adventurer.name} - ${adventurer.coordinates.x} - ${adventurer.coordinates.y} - ${adventurer.orientation} - ${adventurer.treasure}\n`
        }
        return stringToWrite;
    }
}
