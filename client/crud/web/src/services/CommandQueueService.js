export const commandQueue = observable([]);

export const execute = (doIt, undoIt, message) => {
    doIt();

    // Wrap all previous undo commands in the current undo command.
    commandQueue.map(obj => {
        const innerUndo = obj.undoIt;
        obj.undoIt = () => { undoIt(); innerUndo(); };
    });

    commandQueue.push({
        doIt,
        undoIt,
        message});
};