import {MapService} from "./map.service";
import {Movement, Orientation} from "./structures";

describe('MapService', function () {
    const dimension = {width: 10, height: 10};
    let service: MapService;

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation((s) => s);
    })

    beforeEach(() => {
        service = new MapService();
        service.setSize(dimension);
    });

    it('should create an instance of the service', () => {
        expect(service).toBeTruthy();
    });

    describe("Initialization", () => {
        it('should set the size of the map', () => {
            const dimension = {width: 15, height: 15};
            service.setSize(dimension);
            expect(service.width).toBe(dimension.width);
            expect(service.height).toBe(dimension.height);
        })

        it('should add a mountain', () => {
            const mountain = {coordinates: {x: 1, y: 1}};
            service.addMountain(mountain);
            expect(service.mountains).toContain(mountain);
        })

        it('should throw an error when adding a mountain with invalid coordinates', () => {
            const mountain = {coordinates: {x: 11, y: 11}};
            expect(() => service.addMountain(mountain)).toThrowError('Invalid mountain coordinates: 11,11');
        })

        it('should add a treasure', () => {
            const treasure = {coordinates: {x: 1, y: 1}, amount: 1};
            service.addTreasure(treasure);
            expect(service.treasures).toContain(treasure);
        })

        it('should throw an error when adding a treasurer with invalid coordinates', () => {
            const treasure = {coordinates: {x: 11, y: 11}, amount: 2};
            expect(() => service.addTreasure(treasure)).toThrowError('Invalid treasure coordinates: 11,11');
        })

        it('should add an adventurer', () => {
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            expect(service.adventurers).toContain(adventurer);
        })

        it('should throw an error when adding an adventurer with invalid coordinates', () => {
            const adventurer = {
                coordinates: {x: 11, y: 11},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT],
                treasure: 0
            };
            expect(() => service.addAdventurer(adventurer)).toThrowError('Invalid adventurer coordinates: 11,11');
        })

        it("should return true if the coordinates are valid", () => {
            const coordinates = {x: 2, y: 5};
            expect(service.checkCoordinates(coordinates)).toBeTruthy();
        })

        it("should return false if the coordinates are not valid", () => {
            const coordinates = {x: 11, y: 11};
            expect(service.checkCoordinates(coordinates)).toBeFalsy();
        })
    })

    describe("Map generation", () => {

        it('should build the grid', () => {
            service.buildGrid();
            expect(service.grid).toBeTruthy();
            expect(service.grid.length).toBe(dimension.width);
            expect(service.grid[0].length).toBe(dimension.height);
            expect(service.grid[0][0]).toBe(0);
        })

        it("should add mountain to the grid correctly", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const mountain = {coordinates: {x: 1, y: 1}};
            service.addMountain(mountain);
            service.buildGrid();
            expect(service.grid[1][1]).toBe(-1);
        })

        it("should add treasure to the grid correctly", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const treasure = {coordinates: {x: 1, y: 1}, amount: 1};
            service.addTreasure(treasure);
            service.buildGrid();
            expect(service.grid[1][1]).toBe(1);
        })

        it("should add adventurer to the grid correctly", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.buildGrid();
            expect(service.grid[1][1]).toBe(-2);
        })

        it("should reset the grid", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const mountain = {coordinates: {x: 1, y: 1}};
            service.addMountain(mountain);
            service.buildGrid();
            service.resetGrid();
            expect(service.grid[1][1]).toBe(0);

        })
    })

    describe("Map exploration", () => {
        it('should compute movements', () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            service.buildGrid();
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT, Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.explore();
            expect(adventurer.coordinates).toEqual({x: 2, y: 1});
            expect(adventurer.orientation).toBe(Orientation.EAST);
        })

        it("should not call computeNewCoordinates if the movement is not ADVANCE", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            service.buildGrid();
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            jest.spyOn((MapService as any), "computeNewCoordinates");
            service.explore();
            expect((MapService as any).computeNewCoordinates).not.toHaveBeenCalled();
        })

        it("should call computeNewCoordinates if the movement is ADVANCE", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.buildGrid();
            jest.spyOn((MapService as any), "computeNewCoordinates");
            service.explore();
            expect((MapService as any).computeNewCoordinates).toHaveBeenCalledWith({
                x: 1,
                y: 1
            }, adventurer.orientation);
        })

        it("should call computeNewOrientation if the movement is TURN_RIGHT or TURN_LEFT", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.buildGrid();
            jest.spyOn((MapService as any), "computeNewOrientation");
            service.explore();
            expect((MapService as any).computeNewOrientation).toHaveBeenCalledWith(Orientation.NORTH, Movement.TURN_RIGHT);
        })

        it("should build the grid for every advance movement for every adventurer", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.NORTH,
                movements: [Movement.TURN_RIGHT, Movement.ADVANCE, Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.addAdventurer(adventurer);
            service.buildGrid();
            jest.spyOn(service, "buildGrid");
            service.explore();
            // 5 = 1 for the initialisation + 2 for the first adventurer + 2 for the second
            expect(service.buildGrid).toHaveBeenCalledTimes(5);
        })

        it("should add a treasure to the adventurer if he finds one", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            const treasure = {coordinates: {x: 1, y: 2}, amount: 2};
            service.addTreasure(treasure);
            service.buildGrid();
            service.explore();
            expect(adventurer.treasure).toBe(1);
        })

        it("should remove 1 treasure if the adventurer finds one", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            const treasure = {coordinates: {x: 1, y: 2}, amount: 2};
            service.addTreasure(treasure);
            service.buildGrid();
            service.explore();
            expect(treasure.amount).toBe(1);
        })

        it('should decrease the treasure amount if the adventurer finds a treasure', () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            const treasure = {coordinates: {x: 1, y: 2}, amount: 2};
            service.addTreasure(treasure);
            service.buildGrid();
            service.explore();
            expect(treasure.amount).toBe(1);
        })

        it("should remove the treasure from the list if there is no more treasure", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            const treasure = {coordinates: {x: 1, y: 2}, amount: 1};
            service.addTreasure(treasure);
            service.buildGrid();
            service.explore();
            expect(service.treasures.length).toBe(0);
        })

        it("should not add a treasure if he his on a case where there is a treasure, but he was already here", ()=>{
            const adventurer = {
                coordinates: {x: 1, y: 0},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE, Movement.ADVANCE],
                treasure: 0
            };
            const mountain = {coordinates: {x: 1, y: 2}};
            const treasure = {coordinates: {x: 1, y: 1}, amount: 3};

            service.addAdventurer(adventurer);
            service.addTreasure(treasure);
            service.addMountain(mountain);
            service.buildGrid();
            service.explore();

            expect(adventurer.treasure).toBe(1);
            expect(treasure.amount).toBe(2);
            expect(adventurer.coordinates.y).toBe(1);
        })

        it('should compute the right coordinates', () => {
            let newCoordinate = (MapService as any).computeNewCoordinates({x: 1, y: 1}, Orientation.EAST);
            expect(newCoordinate).toEqual({x: 2, y: 1});
            newCoordinate = (MapService as any).computeNewCoordinates({x: 1, y: 1}, Orientation.SOUTH);
            expect(newCoordinate).toEqual({x: 1, y: 2});
            newCoordinate = (MapService as any).computeNewCoordinates({x: 1, y: 1}, Orientation.WEST);
            expect(newCoordinate).toEqual({x: 0, y: 1});
            newCoordinate = (MapService as any).computeNewCoordinates({x: 1, y: 1}, Orientation.NORTH);
            expect(newCoordinate).toEqual({x: 1, y: 0});
        })

        it("should not move the adventurer if he try to cross a mountain", () => {
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            const mountain = {coordinates: {x: 1, y: 2}};
            service.addAdventurer(adventurer);
            service.addMountain(mountain);
            service.buildGrid();
            service.explore();
            expect(adventurer.coordinates).toEqual({x: 1, y: 1});
        })

        it("should not move the adventurer if he try to go on a case where there is another adventurer", () => {
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            const evilAdventurer = {
                coordinates: {x: 1, y: 2},
                name: 'evil_adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.addAdventurer(evilAdventurer);
            service.buildGrid();
            service.explore();
            expect(adventurer.coordinates).toEqual({x: 1, y: 1});
            expect(evilAdventurer.coordinates).toEqual({x: 1, y: 3});
        })

        it("should move both adventurers if one goes on a case where there was an adventurer, but he moved first", () => {
            const adventurer = {
                coordinates: {x: 1, y: 1},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            const goodAdventurer = {
                coordinates: {x: 1, y: 2},
                name: 'good_adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(goodAdventurer);
            service.addAdventurer(adventurer);
            service.buildGrid();
            service.explore();
            expect(adventurer.coordinates).toEqual({x: 1, y: 2});
            expect(goodAdventurer.coordinates).toEqual({x: 1, y: 3});
        })

        it("should not move the adventurer if he try to cross the border", () => {
            const adventurer = {
                coordinates: {x: 9, y: 9},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.buildGrid();
            service.explore();
            expect(adventurer.coordinates).toEqual({x: 9, y: 9});
        })

        it("should kill the adventurer if he try to cross a border while hardcore mode is activated", () => {
            const dimension = {width: 10, height: 10};
            service.setSize(dimension);
            const adventurer = {
                coordinates: {x: 9, y: 9},
                name: 'adventurer',
                orientation: Orientation.SOUTH,
                movements: [Movement.ADVANCE],
                treasure: 0
            };
            service.addAdventurer(adventurer);
            service.buildGrid();
            service.explore(false, true);
            expect(service.adventurers.length).toEqual(0);
        })

        it('should compute the right orientation', () => {
            let newOrientation = (MapService as any).computeNewOrientation(Orientation.EAST, Movement.TURN_RIGHT);
            expect(newOrientation).toBe(Orientation.SOUTH);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.EAST, Movement.TURN_LEFT);
            expect(newOrientation).toBe(Orientation.NORTH);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.SOUTH, Movement.TURN_RIGHT);
            expect(newOrientation).toBe(Orientation.WEST);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.SOUTH, Movement.TURN_LEFT);
            expect(newOrientation).toBe(Orientation.EAST);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.WEST, Movement.TURN_RIGHT);
            expect(newOrientation).toBe(Orientation.NORTH);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.WEST, Movement.TURN_LEFT);
            expect(newOrientation).toBe(Orientation.SOUTH);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.NORTH, Movement.TURN_RIGHT);
            expect(newOrientation).toBe(Orientation.EAST);
            newOrientation = (MapService as any).computeNewOrientation(Orientation.NORTH, Movement.TURN_LEFT);
            expect(newOrientation).toBe(Orientation.WEST);
        })

    });

    it("should display the step and the end if verbose is true", () => {
        const dimension = {width: 10, height: 10};
        service.setSize(dimension);
        const adventurer = {
            coordinates: {x: 1, y: 1},
            name: 'adventurer',
            orientation: Orientation.SOUTH,
            movements: [Movement.ADVANCE],
            treasure: 0
        };
        service.addAdventurer(adventurer);
        const treasure = {coordinates: {x: 1, y: 2}, amount: 1};
        service.addTreasure(treasure);
        service.buildGrid();
        jest.spyOn(console, "log");
        service.explore(true);
        expect(console.log).toHaveBeenCalledTimes(13);
    })

    it('should serialize the map', () => {
        const dimension = {width: 10, height: 10};
        service.setSize(dimension);
        service.buildGrid();
        const adventurer = {
            coordinates: {x: 1, y: 1},
            name: 'adventurer',
            orientation: Orientation.NORTH,
            movements: [Movement.TURN_RIGHT, Movement.ADVANCE],
            treasure: 0
        };
        service.addAdventurer(adventurer);
        service.explore();
        const serialized = service.serialize();
        expect(serialized).toBeTruthy();
        expect(serialized).toBe("C - 10 - 10\n" +
            "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}\n" +
            "A - adventurer - 2 - 1 - E - 0\n"
        );
    })
});
