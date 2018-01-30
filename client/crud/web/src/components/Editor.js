import {JSONEditor} from "./JSONEditor";

// This component chooses the correct rendering component based
// on data type.
export const Editor = ({ obj, propName }) =>
    <JSONEditor obj={obj} propName={propName} isRoot={true}/>;