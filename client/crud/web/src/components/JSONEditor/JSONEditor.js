import {RenderTree} from "./Trees/RenderTree";
import {execute} from "../../services/CommandQueueService";
import PropTypes from 'prop-types';

export class JSONEditor extends Component {

    getChildContext() {
        return { execute: execute.bind(null, this.onSave.bind(this)) };
    }

    onSave() {
        return {
            key: JSON.stringify(this.props.obj)
        };
    }

    render() {

        return <RenderTree {...this.props} />
    }
}


JSONEditor.childContextTypes = {
    execute: PropTypes.func
};