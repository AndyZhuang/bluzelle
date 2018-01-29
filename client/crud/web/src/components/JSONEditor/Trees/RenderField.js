import {del, get, observableMapRecursive} from "../../../mobXUtils";
import {EditableField} from "../../EditableField";
import {Delete} from "../Buttons";

export const RenderField = ({ obj, propName, preamble, editing, onChange, hovering }) => (
    <div>
        {preamble && <span style={{ marginRight: 5 }}>{preamble}:</span>}

        <EditableField
            active={editing}
            onChange={v => {
                onChange();
                obj.set(propName, observableMapRecursive(JSON.parse(v)));
            }}
            val={JSON.stringify(get(obj, propName))}
            validateJSON={true}
            renderVal={v =>
                <span style={{ color: colorFromType(v) }}>{v}</span> }/>

        { hovering && <Delete onClick={ () => del(obj, propName) }/> }
    </div>
);


const colorTypeMap = {
    string: 'blue',
    number: 'red',
    boolean: 'purple'
};

const colorFromType = obj =>
    colorTypeMap[typeof JSON.parse(obj)] || 'pink';