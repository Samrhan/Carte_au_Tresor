import {Adventurer, Dimension, LineType, Mountain, Movement, Orientation, Treasure} from "./structures";
import {MapService} from "./map.service";

export class MapFactory {
    /**
     * Creates a map from a file data
     * @param mapData
     */
    public static createMap(mapData: string): MapService {
        const lines = MapFactory.filterFile(mapData);
        const map = new MapService();

        const parsedLines = lines.map(line => MapFactory.parseLine(line));
        for (const line of parsedLines) {
            switch (line.type) {
                case LineType.MOUNTAIN:
                    map.addMountain(<Mountain>line.data);
                    break;
                case LineType.TREASURE:
                    map.addTreasure(<Treasure>line.data);
                    break;
                case LineType.ADVENTURER:
                    map.addAdventurer(<Adventurer>line.data);
                    break;
                case LineType.DIMENSION:
                    map.setSize(<Dimension>line.data);
                    break;
            }
        }
        return map;
    }

    /**
     * Filters the file to remove comments and empty lines
     * @param fileContent
     */
    static filterFile(fileContent: string): string[] {
        return fileContent.split('\n')
            .filter(line => line.trim().length > 0 && !line.trim().startsWith('#'));
    }

    /**
     * Parses a line and returns the corresponding object
     * @param line
     * @returns {type: LineType, data: Mountain | Treasure | Adventurer | Dimension}
     */
    static parseLine(line: string): { type: LineType, data: Mountain | Treasure | Adventurer | Dimension } {
        const information = line.split('-').map(info => info.trim());
        const lineType = LineType[MapFactory.getEnumKeyByValue(LineType, information[0]) as keyof typeof LineType];
        let x, y, amount, width, height;
        switch (lineType) {
            case LineType.MOUNTAIN:
                x = parseInt(information[1]);
                y = parseInt(information[2]);
                if (isNaN(x) || isNaN(y)) {
                    throw new Error('Invalid mountain coordinates: ' + line);
                }

                return {
                    type: lineType,
                    data: {coordinates: {x, y},}
                }
            case LineType.TREASURE:
                x = parseInt(information[1]);
                y = parseInt(information[2]);
                amount = parseInt(information[3]);
                if (isNaN(x) || isNaN(y) || isNaN(amount)) {
                    throw new Error('Invalid treasure coordinates or amount: ' + line);
                }
                return {
                    type: lineType,
                    data: {
                        coordinates: {x, y},
                        amount,
                    }
                }
            case LineType.ADVENTURER:
                x = parseInt(information[2]);
                y = parseInt(information[3]);
                if (isNaN(x) || isNaN(y)) {
                    throw new Error('Invalid adventurer coordinates: ' + line);
                }
                return {
                    type: lineType,
                    data: {
                        coordinates: {x: Number(information[2]), y: Number(information[3])},
                        name: information[1],
                        orientation: Orientation[MapFactory.getEnumKeyByValue(Orientation, information[4]) as keyof typeof Orientation],
                        movements: information[5].split('').map(movement => Movement[MapFactory.getEnumKeyByValue(Movement, movement) as keyof typeof Movement]),
                        treasure: 0,
                    }
                }
            case LineType.DIMENSION:
                width = parseInt(information[1]);
                height = parseInt(information[2]);
                if (isNaN(width) || isNaN(height)) {
                    throw new Error('Invalid dimension: ' + line);
                }
                return {type: lineType, data: {width, height}}

            default:
                // This should never happen because we are filtering the file before
                throw new Error('Malformed line: ' + line);
        }
    }

    /**
     * Returns the key of the enum value
     * @param enumToCheck
     * @param value
     */
    static getEnumKeyByValue(enumToCheck: any, value: string): string {
        let keys = Object.keys(enumToCheck).filter((x) => enumToCheck[x] == value);
        if (keys.length == 0) {
            throw new Error('Invalid value: ' + value);
        }
        return keys[0];
    }

}
