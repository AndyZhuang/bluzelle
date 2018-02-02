import {EditableField} from "../EditableField";
import {getPrefix} from "../Editor";
import {execute} from "../../services/CommandQueueService";
import {PREFIX as jsonPrefix} from '../JSONEditor';
import {PREFIX as textPrefix} from '../PlainTextEditor';

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

        const keyList = obj.keys().sort().map(key =>
            <BS.ListGroupItem
                key={key}
                onClick={() => selected === key ? onSelect(null) : onSelect(key)}
                active={selected === key}>

                <span style={{display: 'inline-block', width: 25}}>
                    {objIcon(obj.get(key))}
                </span>

                <EditableField
                    val={key}
                    onChange={newkey => {
                        const old = obj.get(key);
                        obj.delete(key);
                        obj.set(newkey, old);

                        selected === key && onSelect(newkey);
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
                        onSelect(null);
                        obj.delete(selected);
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

const objIcon = keyData => (
    <span style={{display: 'inline-block', width: 25}}>
        { getPrefix(keyData) === jsonPrefix &&
            <span style={{
                fontWeight: 'bold',
                fontFamily: 'monospace'
            }}>{'{}'}</span> }

        { getPrefix(keyData) === textPrefix &&
            <BS.Glyphicon glyph='font'/> }
    </span>
);