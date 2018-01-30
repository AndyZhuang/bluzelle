export const commandQueue = observable([]);

let currentPosition = 0;

const revert = targetPosition => {

    console.log('revert', currentPosition, targetPosition);

    if (currentPosition > targetPosition) {
        console.log('undoing');
        commandQueue[currentPosition--].undoIt();
        revert(targetPosition);
    }

    if (currentPosition < targetPosition) {
        console.log('redoing');
        commandQueue[++currentPosition].doIt();
        revert(targetPosition);
    }
};

commandQueue.push({
    message: 'Initial state',
    revert: revert.bind(this, 0)
});


export const execute = (doIt, undoIt, message) => {
    doIt();

    currentPosition++;
    deleteFuture();

    commandQueue.push({
        revert: revert.bind(this, currentPosition),
        doIt,
        undoIt,
        message
    });
};

const deleteFuture = () =>
    (currentPosition >= 0) && (commandQueue.length = currentPosition);