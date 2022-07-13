import {Orientation, Movement} from "../enums";
import {Coordinate} from "./coordinate.interface";

export interface Adventurer {
    name: string;
    coordinates: Coordinate;
    orientation: Orientation;
    movements: Movement[];
    treasure: number;
}
