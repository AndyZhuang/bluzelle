import {EditableField} from "../EditableField";
import {executeContext} from "../../services/CommandQueueService";
import {ObjIcon} from "../ObjIcon";

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
        const {obj, selected, onSelect} = this.props;


        const select = target => this.context.execute({
            doIt: () => onSelect(target),
            undoIt: () => onSelect(selected),
            onSave: () => {},
            message: <span>Selected <code key={1}>{target}</code>.</span>
        });

        const keyList = obj.keys().sort().map(key =>
            <BS.ListGroupItem
                key={key}
                onClick={() => selected === key ? select(null) : select(key)}
                active={selected === key}>

                <span style={{display: 'inline-block', width: 25}}>
                    <ObjIcon keyData={obj.get(key)}/>
                </span>

                <EditableField
                    val={key}
                    onChange={newkey => {

                        const old = obj.get(key);
                        const onSave = savedKeys => ({
                            [newkey]: savedKeys[key] || old.get('bytearray'),
                            [key]: 'deleted'});
                        const message = <span>Renamed <code key={1}>{key}</code> to <code key={2}>{newkey}</code>.</span>;

                        if(selected === key) {

                            // This execution changes the selection to follow the new key name while the one in the
                            // else block does not.

                            this.context.execute({
                                doIt: () => {
                                    onSelect(null, () => {
                                        obj.delete(key);
                                        obj.set(newkey, old);
                                        onSelect(newkey);
                                    });
                                },
                                undoIt: () => {
                                    onSelect(null, () => {
                                        obj.delete(newkey);
                                        obj.set(key, old);
                                        onSelect(key);
                                    });
                                },
                                onSave,
                                message
                            });

                        } else {

                            this.context.execute({
                                doIt: () => {
                                    obj.delete(key);
                                    obj.set(newkey, old);
                                },
                                undoIt: () => {
                                    obj.delete(newkey);
                                    obj.set(key, old);
                                },
                                onSave,
                                message
                            });

                        }
                    }}/>

                {
                    key === selected ?
                        <BS.Glyphicon
                            style={{float: 'right'}}
                            glyph='chevron-right'/>
                        : null
                }
            </BS.ListGroupItem>);


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
                        onSelect(key);
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

                    if (selected !== null) {
                        const oldObj = obj.get(selected);

                        this.context.execute({
                            doIt: () => {
                                onSelect(null, () => {
                                    obj.delete(selected);
                                });
                            },
                            undoIt: () => {
                                obj.set(selected, oldObj);
                                onSelect(selected);
                            },
                            onSave: () => ({[selected]: 'deleted'}),
                            message: <span>Deleted <code key={1}>{selected}</code></span>
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