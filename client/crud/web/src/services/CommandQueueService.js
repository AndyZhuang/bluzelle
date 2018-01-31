import {isObservableArray} from "mobx/lib/mobx";

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


// Caution: the consecutive execution of undoIt and doIt
// must return the original object, or else subsequent redos
// will not be bound correctly.

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


export const del = (obj, propName) => {
    if(isObservableArray(obj)) {
        const old = obj[propName];

        execute(
            () => obj.splice(propName, 1),
            () => obj.splice(propName, 0, old),
            <span>Deleted index <code key={1}>{propName}</code>.</span>);
    } else {
        const old = obj.get(propName);

        execute(
            () => obj.delete(propName),
            () => obj.set(propName, old),
            <span>Deleted key <code key={1}>{propName}</code>.</span>);
    }
};