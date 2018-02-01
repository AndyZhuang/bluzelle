import {RenderTree} from "./Trees/RenderTree";
import {execute} from "../../services/CommandQueueService";
import PropTypes from 'prop-types';

export class JSONEditor extends Component {

    getChildContext() {
        const {obj, propName} = this.props;

        return { execute: execute.bind(null, this.onSave.bind(null, obj, propName)) };
    }

    onSave(obj, propName) {
        return {
            [propName]: "o" + JSON.stringify(obj.get(propName))
        };
    }

    render() {

        return <RenderTree {...this.props} />
    }
}


JSONEditor.childContextTypes = {
    execute: PropTypes.func
};