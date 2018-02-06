import {EditableField} from "../EditableField";
import {executeContext} from "../../services/CommandQueueService";
import {KeyListItem} from "./KeyListItem";


export const selectedKey = observable(null);

@executeContext
@observer
export class KeyList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false
        };
    }

    render() {
        const {obj} = this.props;

        const keyList = obj.keys().sort().map(keyname =>
            <KeyListItem key={keyname} {...{keyname, obj}}/>);


        const newKey = this.state.editing &&
            <BS.ListGroupItem>
                <span style={{display: 'inline-block', width: 25}}>
                    <BS.Glyphicon glyph='asterisk'/>
                </span>
                <EditableField
                    val=''
                    active={true}
                    onChange={key => {
                        this.setState({editing: false});
                        if (key === '') return;
                        obj.set(key, observable.map({}));
                        selectedKey.set(key);
                    }}/>
            </BS.ListGroupItem>;


        const addButton =
            <BS.Button
                style={{color: 'green'}}
                onClick={() => this.setState({editing: true})}>
                <BS.Glyphicon glyph='plus'/>
            </BS.Button>;

        const removeButton =
            <BS.Button
                style={{color: 'red'}}
                onClick={() => {

                    if (selectedKey.get() !== null) {
                        const oldObj = obj.get(selectedKey.get());

                        this.context.execute({
                            doIt: () => {
                                selectedKey.set(null);
                                obj.delete(selectedKey.get());
                            },
                            undoIt: () => {
                                obj.set(selectedKey.get(), oldObj);
                                selectedKey.set(selectedKey.get());
                            },
                            onSave: () => ({[selectedKey.get()]: 'deleted'}),
                            message: <span>Deleted <code key={1}>{selectedKey.get()}</code></span>
                        });
                    }

                }}>
                <BS.Glyphicon glyph='remove'/>
            </BS.Button>;


        return (
            <div style={{padding: 10}}>
                <BS.ListGroup>
                    {keyList}
                    {newKey}
                </BS.ListGroup>
                <BS.ButtonGroup>
                    {addButton}
                    {removeButton}
                </BS.ButtonGroup>
            </div>
        );
    }
}