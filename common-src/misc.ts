export interface ICoords {
    x: number;
    y: number;
    0: number;
    1: number;
    length: number;
}

export var coords = (x: number, y: number): ICoords => {
    return {
        x: x,
        y: y,
        0: x,
        1: y,
        length: 2
    };
}
