export enum GameConst {
    GAME_STATUS_END = 0,
    GAME_STATUS_FREE = 1,
    GAME_STATUS_PLAY = 2,
    CHANGE_STATUS = 'CHANGE_STATUS',
    GAME_END = 'GAME_END'
};
export const HeroAct = {
    RUN: "run",
    JUMP: "jump",
    ROLL: "roll"
};

export enum HeroStatus {
    DEAD = 0,
    PLAY = 1,
};

export const GroundsPos = [
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 0]
];

export const CoinPos = [
    [],
    [],
    []
];