import {EditableField} from "../EditableField";

@observer
export class KeyList extends Component {
    render() {

        const {obj, selected, onSelect} = this.props;

        const list = obj.keys().sort().map(key =>
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

        return (
            <div style={{ padding: 10 }}>
                <BS.ListGroup>
                    {list}
                </BS.ListGroup>
                <BS.ButtonGroup>
                    <BS.Button style={{color: 'green'}}>
                        <BS.Glyphicon glyph='plus'/>
                    </BS.Button>
                    <BS.Button style={{color: 'red'}}>
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