import {Collapsible} from "../Collapsible";
import {Plus, Edit, Delete} from "../Buttons";
import {Hoverable} from '../Hoverable.js';
import {get, del} from '../../../mobXUtils';
import {RenderTreeWithEditableKey} from "./RenderTreeWithEditableKey";
import {NewField} from "./NewField";
import {execute} from '../../../services/CommandQueueService'

@observer
export class RenderObject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showNewField: false
        };
    }

    render() {
        const {obj, propName, preamble, hovering, onEdit, isRoot} = this.props;

        const buttons = hovering &&
            <React.Fragment>
                <Plus onClick={() => this.setState({showNewField: true})}/>
                {isRoot || <Delete onClick={() => del(obj, propName)}/>}
                <Edit onClick={onEdit}/>
            </React.Fragment>;


        const newField = this.state.showNewField &&
            <Hoverable>
                <NewField
                    onChange={(key, val) => {
                        this.setState({showNewField: false});

                        execute(
                            () => get(obj, propName).set(key, val),
                            () => get(obj, propName).delete(key),
                            `New field ${key}`);
                        }}
                    onError={() => this.setState({showNewField: false})}/>
            </Hoverable>;


        const fieldList = get(obj, propName).keys().sort().map(subkey =>
            <RenderTreeWithEditableKey
                key={subkey}
                obj={get(obj, propName)}
                propName={subkey}/>);


        return (
            <Collapsible
                label={`{} (${get(obj, propName).keys().length} entries)`}
                buttons={buttons}
                preamble={preamble}>

                {newField}
                {fieldList}
            </Collapsible>
        );
    }
}