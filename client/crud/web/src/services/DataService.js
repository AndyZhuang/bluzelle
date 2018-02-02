import {addPrefix} from "../components/Editor";
import {PREFIX as jsonPrefix} from '../components/JSONEditor/JSONEditor';
import {observableMapRecursive} from "../mobXUtils";

const strToByteArray = str => new TextEncoder('utf-8').encode(str);
const serialize = x => strToByteArray(JSON.stringify(x));

const objectToKeyData = obj => ({
    bytearray: addPrefix(serialize(obj), jsonPrefix)});


const data = observableMapRecursive({

    key1: objectToKeyData({
        array: [1, 2, 3, 4]
    }),

    anotherKey: objectToKeyData({
        fieldA: 1.23,
        fieldB: 4.56,
        bool: true,
        crazyObject: {
            "true": false
        }
    }),

    complexObject: objectToKeyData({
        arrays: [1, 2, [{field: "feild"}, []], 3, ["apples", ["and", ["oranges"]]]]
    })
});

export const getSwarmData = () => data;