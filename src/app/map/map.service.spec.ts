import {MapService} from "./map.service";
import {Movement, Orientation} from "./structures";

describe('MapService', function () {
    let service: MapService;
    beforeAll(() => {
      jest.spyOn(console, 'log').mockImplementation((s) => s);
    })
    beforeEach(
        () => {
            service = new MapService();

        });
    it('should create an instance of the service', () => {
        expect(service).toBeTruthy();
    });
    it('should set the size of the map', () => {
        const dimension = {width: 10, height: 10};
        service.setSize(dimension);
        expect(service.width).toBe(dimension.width);
        expect(service.height).toBe(dimension.height);
    })
    it('should add a mountain', () => {
        const mountain = {coordinates: {x: 1, y: 1}};
        service.addMountain(mountain);
        expect(service.mountains).toContain(mountain);
    })
    it('should add a treasure', () => {
        const treasure = {coordinates: {x: 1, y: 1}, amount: 1};
        service.addTreasure(treasure);
        expect(service.treasures).toContain(treasure);

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

    it('should build the grid', () => {
        const dimension = {width: 10, height: 10};
        service.setSize(dimension);
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
        expect(service.grid[1][1]).toBe(2);
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
        expect(service.grid[1][1]).toBe(1);
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
        service.computeMovements();
        expect(service.adventurers[0].coordinates).toEqual({x: 2, y: 1});
        expect(service.adventurers[0].orientation).toBe(Orientation.EAST);
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
        jest.spyOn((service as any), "computeNewCoordinates");
        service.computeMovements();
        expect((service as any).computeNewCoordinates).not.toHaveBeenCalled();
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
        jest.spyOn((service as any), "computeNewCoordinates");
        service.computeMovements();
        expect((service as any).computeNewCoordinates).toHaveBeenCalledWith({x: 1, y: 1}, adventurer.orientation);
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
        service.computeMovements();
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
        service.computeMovements();
        expect(service.buildGrid).toHaveBeenCalledTimes(4);
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
        const treasure = {coordinates: {x: 1, y: 2}, amount: 1};
        service.addTreasure(treasure);
        service.buildGrid();
        service.computeMovements();
        expect(service.adventurers[0].treasure).toBe(1);
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
        service.computeMovements();
        expect(service.treasures[0].amount).toBe(1);
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
        service.computeMovements();
        expect(service.treasures.length).toBe(0);
    })

    it("should display the step if verbose is true", () => {
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
        service.computeMovements(true);
        expect(console.log).toHaveBeenCalledTimes(12);
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
        service.computeMovements();
        const serialized = service.serialize();
        expect(serialized).toBeTruthy();
        expect(serialized).toBe("C - 10 - 10\n" +
            "# {M comme Montagne} - {Axe horizontal} - {Axe vertical}\n" +
            "# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}\n" +
            "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}\n" +
            "A - adventurer - 2 - 1 - E - 0\n"
        );
    })

    it('should compute the right coordinates', () => {
        let newCoordinate = (service as any).computeNewCoordinates({x: 1, y: 1}, Orientation.EAST);
        expect(newCoordinate).toEqual({x: 2, y: 1});
        newCoordinate = (service as any).computeNewCoordinates({x: 1, y: 1}, Orientation.SOUTH);
        expect(newCoordinate).toEqual({x: 1, y: 2});
        newCoordinate = (service as any).computeNewCoordinates({x: 1, y: 1}, Orientation.WEST);
        expect(newCoordinate).toEqual({x: 0, y: 1});
        newCoordinate = (service as any).computeNewCoordinates({x: 1, y: 1}, Orientation.NORTH);
        expect(newCoordinate).toEqual({x: 1, y: 0});
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
