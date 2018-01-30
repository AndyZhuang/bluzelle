export const commandQueue = observable([]);
export const currentPosition = observable(0);


const revert = targetPosition => {
    const cp = currentPosition.get();
    
    if (cp > targetPosition) {
        commandQueue[cp].undoIt();
        currentPosition.set(cp - 1)
        revert(targetPosition);
    }

    if (cp < targetPosition) {
        commandQueue[cp + 1].doIt();
        currentPosition.set(cp + 1)
        revert(targetPosition);
    }
};

commandQueue.push({
    message: 'Initial state',
    revert: revert.bind(this, 0)
});


export const execute = (doIt, undoIt, message) => {
    doIt();

    currentPosition.set(currentPosition.get() + 1);
    deleteFuture();

    commandQueue.push({
        revert: revert.bind(this, currentPosition.get()),
        doIt,
        undoIt,
        message
    });
};

const deleteFuture = () =>
    (currentPosition.get() >= 0) && (commandQueue.length = currentPosition.get());