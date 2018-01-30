import {EditableField} from "../../EditableField";
import {observableMapRecursive} from "../../../mobXUtils";
import {execute} from "../../../services/CommandQueueService";

export const NewField = ({ arr, onEnd }) => (
    <div>
        {arr.length}:

        <EditableField
            active={true}
            val={''}
            validateJSON={true}
            onChange={val => {
                try {
                    const obj = observableMapRecursive(JSON.parse(val));

                    // todo: refactor this into renderArray like we have in renderObject
                    execute(
                        () => arr.push(obj),
                        () => arr.pop(),
                        `Pushed ${JSON.stringify(val)} to array.`);

                } catch(e) {}

                onEnd();
            }}/>
    </div>
);