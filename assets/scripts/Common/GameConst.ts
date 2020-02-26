export enum GameConst {
    GAME_STATUS_END = 0,
    GAME_STATUS_FREE = 1,
    GAME_STATUS_PLAY = 2,
    CHANGE_STATUS = 'CHANGE_STATUS',
    CHANGE_HERO_STATUS = 'CHANGE_HERO_STATUS',
    GAME_END = 'GAME_END'
};
export enum HeroAct {
    RUN = "run",
    JUMP = "jump",
    ROLL = "roll"
};

export enum HeroStatus {
    DEAD = 0,
    FREE = 1,
    PLAY = 2,
};

export enum ComponentPos {
    HERO_X = -92,
    HERO_Y = -57,
    LEFT_DEAD_X = -280
}

export const GroundsPos = [
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 1]
];

export const obstaclePos = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
];

export const CoinPos = [
    [],
    [],
    []
];