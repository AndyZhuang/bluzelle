import {EditableField} from "../EditableField";

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
                    }}/>
            </BS.ListGroupItem>;


        return (
            <div style={{padding: 10}}>
                <BS.ListGroup>
                    {keyList}
                    {newKey}
                </BS.ListGroup>
                <BS.ButtonGroup>
                    <BS.Button
                        style={{color: 'green'}}
                        onClick={() => this.setState({editing: true})}>
                        <BS.Glyphicon glyph='plus'/>
                    </BS.Button>
                    <BS.Button
                        style={{color: 'red'}}
                        onClick={() => {
                            if (selected !== null) {
                                onSelect(null);
                                obj.delete(selected);
                            }
                        }}>
                        <BS.Glyphicon glyph='remove'/>
                    </BS.Button>
                </BS.ButtonGroup>
            </div>
        );
    }
}

const objIcon = obj => (
    <span style={{display: 'inline-block', width: 25}}>
        {
            'isObjectType' ?
                (
                    <span style={{
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    }}>{'{}'}</span>
                ) : (
                    <BS.Glyphicon glyph={
                        'isBinaryType' ? 'open-file' : 'font'
                    }/>
                )
        }
    </span>
);