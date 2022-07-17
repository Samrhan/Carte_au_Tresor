import {Adventurer, Dimension, LineType, Mountain, Movement, Orientation, Treasure} from "./structures";
import {MapService} from "./map.service";

export class MapFactory {
    /**
     * Creates a map from a file data
     * @param mapData
     */
    public static createMap(mapData: string): MapService {
        const lines = MapFactory.filterFile(mapData);
        const parsedLines = lines.map(MapFactory.parseLine);

        // First we retrieve the map dimensions
        const dimensionIndex = parsedLines.findIndex(line => line.type == LineType.DIMENSION);
        if (dimensionIndex === -1) {
            throw new Error('Missing map dimension');
        }

        const dimension = <Dimension>parsedLines[dimensionIndex].data;
        parsedLines.splice(dimensionIndex, 1);

        // Then we create the map with the others lines
        const map = new MapService(dimension);
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
        const lineType = LineType[MapFactory.getEnumKeyByValue<typeof LineType>(LineType, information[0])];

        let x, y;
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
                const amount = parseInt(information[3]);
                if (isNaN(x) || isNaN(y) || isNaN(amount) || amount < 1) {
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
                if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
                    throw new Error('Invalid adventurer coordinates: ' + line);
                }
                return {
                    type: lineType,
                    data: {
                        coordinates: {x: Number(information[2]), y: Number(information[3])},
                        name: information[1],
                        orientation: Orientation[MapFactory.getEnumKeyByValue<typeof Orientation>(Orientation, information[4])],
                        movements: information[5].split('').map(movement => Movement[MapFactory.getEnumKeyByValue<typeof Movement>(Movement, movement)]),
                        treasure: 0,
                    }
                }

            case LineType.DIMENSION:
                const width = parseInt(information[1]);
                const height = parseInt(information[2]);
                if (isNaN(width) || isNaN(height)) {
                    throw new Error('Invalid dimension: ' + line);
                }
                return {type: lineType, data: {width, height}}

            default:
                throw new Error('Malformed line: ' + line);
        }
    }

    /**
     * Returns the key of the enum value
     * @param enumToCheck
     * @param value
     */
    static getEnumKeyByValue<T>(enumToCheck: any, value: string): keyof T {
        let key = Object.keys(enumToCheck).find((x) => enumToCheck[x] == value);
        if (!key) {
            throw new Error('Invalid value: ' + value);
        }
        return key as keyof T;
    }

}
