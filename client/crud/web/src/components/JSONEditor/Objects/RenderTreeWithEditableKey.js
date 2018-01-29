import {EditableField} from "../../EditableField";
import {RenderTree} from "../Trees/RenderTree";

export const RenderTreeWithEditableKey = ({obj, propName, ...props}) => {
    const preamble =
        <EditableField
            val={propName}
            renderVal={val => <span style={{color: 'navy'}}>{val}</span>}
            onChange={newkey => {
                const oldval = obj.get(propName);
                obj.delete(propName);
                obj.set(newkey, oldval);
            }}/>;

    return <RenderTree
        obj={obj}
        propName={propName}
        preamble={preamble}
        {...props}/>;
};