import {JSONEditor, PREFIX as jsonPrefix} from "./JSONEditor";

// This component chooses the correct rendering component based
// on data type.

// TODO: better name for keyData
export const Editor = ({ keyData, keyName }) => {
    const type = getPrefix(keyData);

    return (
        <React.Fragment>
            { type === jsonPrefix && <JSONEditor keyData={keyData} keyName={keyName}/> }
        </React.Fragment>
    );
};


const getPrefix = keyData => keyData.get('bytearray')[0];
export const addPrefix = (bytearray, prefix) => new Uint8Array([prefix, ...bytearray]);
export const getRaw = keyData => keyData.get('bytearray').subarray(1);