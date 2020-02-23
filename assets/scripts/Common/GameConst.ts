export const GameConst = {

};
export const HeroAct = {
    RUN: "run",
    JUMP: "jump",
    ROLL: "roll"
};

export const HeroStatus = {
    DEAD: 0,
    PLAY: 1,
};

export const GroundsPos = [
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 0]
];

export const CoinPos = [
    [],
    [],
    []
];