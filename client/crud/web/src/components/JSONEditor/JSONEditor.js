import {RenderTree} from "./Trees/RenderTree";
import {execute} from "../../services/CommandQueueService";
import {pipe} from 'lodash/fp';
import {getRaw, addPrefix} from "../Editor";
import {observableMapRecursive as omr} from "../../mobXUtils";
import {byteArrayToStr, strToByteArray} from "../../util/encoding";
import PropTypes from 'prop-types';


export const PREFIX = 0;

export class JSONEditor extends Component {

    getChildContext() {
        const {keyData} = this.props;

        return {
            execute: args => execute({
                onSave: this.onSave.bind(this, keyData.get('interpreted')), ...args })
        };
    }

    onSave(interpreted) {
        return {
            [this.props.keyName]: addPrefix(serialize(interpreted), PREFIX)
        };
    }

    render() {
        const {keyData} = this.props;

        keyData.has('interpreted')
            || keyData.set('interpreted', omr(interpret(getRaw(keyData))));

        return <RenderTree obj={keyData} propName='interpreted' isRoot={true}/>
    }
}


JSONEditor.childContextTypes = {
    execute: PropTypes.func
};


const interpret = pipe(byteArrayToStr, JSON.parse);
const serialize = pipe(JSON.stringify, strToByteArray);


export const objectToKeyData = obj => ({
    bytearray: addPrefix(serialize(obj), PREFIX)});