const fpsHistory: number[] = [];

const historyLength = 60;
export const getRefreshedAvgFPS = (timeDiff: number) => {
    fpsHistory.push(timeDiff);
    if (fpsHistory.length > historyLength) fpsHistory.shift();

    const timeForLast60Frames = fpsHistory.reduce((total, r) => total + r, 0);
    return (1000 * historyLength / timeForLast60Frames).toFixed(0);
};
