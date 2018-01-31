import {RenderTree} from "../Trees/RenderTree";
import {Collapsible} from "../Collapsible";
import {Plus, Edit, Delete} from "../Buttons";
import {Hoverable} from "../Hoverable";
import {get, del} from '../../../mobXUtils';
import {NewField} from "./NewField";
import {execute} from "../../../services/CommandQueueService";

@observer
export class RenderArray extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showNewField: false
        };
    }

    render() {
        const {obj, propName, preamble, hovering, isRoot, onEdit} = this.props;

        const buttons = hovering &&
            <React.Fragment>
                <Plus onClick={() => this.setState({ showNewField: true })}/>
                {isRoot || <Delete onClick={() => del(obj, propName)}/>}
                <Edit onClick={onEdit}/>
            </React.Fragment>;


        const newField = this.state.showNewField &&
            <Hoverable>
                <NewField
                    preamble={get(obj, propName).length}
                    onChange={newObj => {
                        this.setState({ showNewField: false });

                        execute(
                            () => get(obj, propName).push(newObj),
                            () => get(obj, propName).pop(),
                            <span>Pushed <code key={1}>{JSON.stringify(newObj)}</code> to <code key={2}>{propName}</code>.</span>);
                    }}
                    onError={() => this.setState({showNewField: false})}/>
            </Hoverable>;


        const fieldList = get(obj, propName).map((value, index) =>
            <RenderTree
                key={index}
                obj={get(obj, propName)}
                propName={index}
                preamble={<span>{index}</span>}/>);


        return <Collapsible
            label={`[] (${get(obj, propName).length} entries)`}
            buttons={buttons}
            preamble={preamble}>

            {fieldList}
            {newField}
        </Collapsible>;
    }
}