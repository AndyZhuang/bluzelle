import {observableMapRecursive} from "../mobXUtils";

const data = observableMapRecursive(testData());

export const getSwarmData = () => data;

function testData() {
    return {
        key1: {
            array: [1, 2, 3, 4]
        },

        anotherKey: {
            fieldA: 1.23,
            fieldB: 4.56,
            bool: true,
            crazyObject: {
                "true": false
            }
        },

        complexObject: {
            arrays: [1, 2, [{ field: "feild" }, []], 3, ["apples", ["and", ["oranges"]]]]
        }
    };
}