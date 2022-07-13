import {MapFactory} from "./map.factory";
import {Adventurer, Coordinate, Dimension, LineType, Mountain, Orientation, Treasure} from "./structures";

describe(MapFactory.name, () => {

    const file = "C - 3 - 4\n" +
        "M - 1 - 0\n" +
        "M - 2 - 1\n" +
        "T - 0 - 3 - 2\n" +
        "T - 1 - 3 - 3\n" +
        "A - Lara - 1 - 1 - S - AADADAGGA"

    it('should create a map', () => {

        const map = MapFactory.createMap(file);
        expect(map.adventurers.length).toBe(1);
        expect(map.treasures.length).toBe(2);
        expect(map.mountains.length).toBe(2);
        expect(map.grid.length).toBe(4);
        expect(map.grid[0].length).toBe(3);

        expect(map.adventurers[0].name).toBe('Lara');
        expect(map.adventurers[0].coordinates.x).toBe(1);
        expect(map.adventurers[0].coordinates.y).toBe(1);
        expect(map.adventurers[0].orientation).toBe(Orientation.SOUTH);
        expect(map.adventurers[0].movements).toEqual(['A', 'A', 'D', 'A', 'D', 'A', 'G', 'G', 'A']);

        expect(map.treasures[0].coordinates.x).toBe(0);
        expect(map.treasures[0].coordinates.y).toBe(3);
        expect(map.treasures[0].amount).toBe(2);
        expect(map.treasures[1].coordinates.x).toBe(1);
        expect(map.treasures[1].coordinates.y).toBe(3);
        expect(map.treasures[1].amount).toBe(3);

        expect(map.mountains[0].coordinates.x).toBe(1);
        expect(map.mountains[0].coordinates.y).toBe(0);
        expect(map.mountains[1].coordinates.x).toBe(2);
        expect(map.mountains[1].coordinates.y).toBe(1);
    });

    it("should filter out comment and blank lines", () => {
        const dirtyFile = "C - 3 - 4\n" +
            "M - 1 - 0\n" +
            "M - 2 - 1\n" +
            "T - 0 - 3 - 2\n" +
            "T - 1 - 3 - 3\n" +
            "# This is a comment\n" +
            "    \n" + // This is a blank line
            "A - Lara - 1 - 1 - S - AADADAGGA\n"
        const lines = MapFactory.filterFile(dirtyFile);
        expect(lines).toStrictEqual(MapFactory.filterFile(file));
    })

    it("should parse a treasure line", () => {
        const line = "T - 0 - 3 - 2";
        const parsedLine = MapFactory.parseLine(line);
        expect(parsedLine.type).toBe(LineType.TREASURE);
        expect((parsedLine.data as Treasure).coordinates.x).toBe(0);
        expect((parsedLine.data as Treasure).coordinates.y).toBe(3);
        expect((parsedLine.data as Treasure).amount).toBe(2);
    })

    it("should parse a mountain line", () => {
        const line = "M - 1 - 0";
        const parsedLine = MapFactory.parseLine(line);
        expect(parsedLine.type).toBe(LineType.MOUNTAIN);
        expect((parsedLine.data as Mountain).coordinates.x).toBe(1);
        expect((parsedLine.data as Mountain).coordinates.y).toBe(0);
    })

    it("should parse an adventurer line", () => {
        const line = "A - Lara - 1 - 1 - S - AADADAGGA";
        const parsedLine = MapFactory.parseLine(line);
        expect(parsedLine.type).toBe(LineType.ADVENTURER);
        expect((parsedLine.data as Adventurer).name).toBe('Lara');
        expect((parsedLine.data as Adventurer).coordinates.x).toBe(1);
        expect((parsedLine.data as Adventurer).coordinates.y).toBe(1);
        expect((parsedLine.data as Adventurer).orientation).toBe(Orientation.SOUTH);
        expect((parsedLine.data as Adventurer).movements).toEqual(['A', 'A', 'D', 'A', 'D', 'A', 'G', 'G', 'A']);
    })

    it("should parse the map dimensions", () => {
        const line = "C - 3 - 4";
        const parsedLine = MapFactory.parseLine(line);
        expect(parsedLine.type).toBe(LineType.DIMENSION);
        expect((parsedLine.data as Dimension).width).toBe(3);
        expect((parsedLine.data as Dimension).height).toBe(4);
    })

    it("should return the enum key from value", () => {
        expect(MapFactory.getEnumKeyByValue(LineType, 'M')).toBe('MOUNTAIN');
    })

    it("should throw an error if a value is not in enum", () => {
        expect(() => MapFactory.getEnumKeyByValue(LineType, 'Z')).toThrowError("Invalid value: " + 'Z');
    })

    it("should throw an error if a line is malformed", () => {
        const line = "Z";
        expect(() => MapFactory.parseLine(line)).toThrowError("Invalid value: " + line);
    })

    it("should throw an error if dimension is malformed", () => {
        const line = "C - a - 4";
        expect(() => MapFactory.parseLine(line)).toThrowError("Invalid dimension: " + line);
    })

    it("should throw an error if treasure is malformed", () => {
        const line = "T - 0 - 3 - a";
        expect(() => MapFactory.parseLine(line)).toThrowError('Invalid treasure coordinates or amount: ' + line);
    })

    it("should throw an error if mountain is malformed", () => {
        const line = "M - a - 0";
        expect(() => MapFactory.parseLine(line)).toThrowError('Invalid mountain coordinates: ' + line);
    })

    it("should throw an error if adventurer is malformed", () => {
        const line = "A - Lara - 1 - e - S - AADADAGGA";
        expect(() => MapFactory.parseLine(line)).toThrowError('Invalid adventurer coordinates: ' + line);
    })
})
