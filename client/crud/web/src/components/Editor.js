import {getPrefix, isNew} from "./keyData";
import {JSONEditor, PREFIX as jsonPrefix} from "./JSONEditor";
import {PlainTextEditor, PREFIX as textPrefix} from './PlainTextEditor';
import {NewEditor} from "./NewEditor";

// This component chooses the correct rendering component based
// on data type.

// TODO: better name for keyData

export const Editor = observer(props => {

    const {keyData} = props;

    const type = getPrefix(keyData);

    console.log('')

    return (
        <React.Fragment>
            { type === jsonPrefix && <JSONEditor {...props}/> }
            { type === textPrefix && <PlainTextEditor {...props}/> }
            { isNew(keyData) && <NewEditor {...props}/> }
        </React.Fragment>
    );
});