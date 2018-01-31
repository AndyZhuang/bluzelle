import {EditableField} from "../../EditableField";
import {RenderTree} from "../Trees/RenderTree";
import {execute} from "../../../services/CommandQueueService";

export const RenderTreeWithEditableKey = ({obj, propName, ...props}) => {
    const preamble =
        <EditableField
            val={propName}
            renderVal={val => <span style={{color: 'navy'}}>{val}</span>}
            onChange={newkey => {

                execute(
                    () => {
                        const oldval = obj.get(propName);
                        obj.delete(propName);
                        obj.set(newkey, oldval);
                    },
                    () => {
                        const oldval = obj.get(newkey);
                        obj.delete(newkey);
                        obj.set(propName, oldval);
                    },
                    <span>Renamed <code key={1}>{propName}</code> to <code key={2}>{newkey}</code>.</span>);
            }}/>;

    return <RenderTree
        obj={obj}
        propName={propName}
        preamble={preamble}
        {...props}/>;
};