import {EditableField} from "../EditableField";

export class KeyList extends Component {
    render() {
        return (
            <div style={{
                padding: 10
            }}>
                <BS.ListGroup>
                    <BS.ListGroupItem>
                        <span style={{display: 'inline-block', width: 25}}>
                            <BS.Glyphicon glyph='open-file'/>
                        </span>

                        <EditableField
                            val={'Sample Row 1'}/>
                    </BS.ListGroupItem>
                    <BS.ListGroupItem active>
                        <span style={{display: 'inline-block', width: 25}}>
                            <BS.Glyphicon glyph='font'/>
                        </span>
                        <EditableField
                            val={'Sample Row 2'}/>

                        <BS.Glyphicon
                            style={{float: 'right'}}
                            glyph='chevron-right'/>
                    </BS.ListGroupItem>
                    <BS.ListGroupItem>
                        <span style={{display: 'inline-block', width: 25}}>
                            <span style={{
                                fontWeight: 'bold',
                                fontFamily: 'monospace'
                            }}>{'{}'}</span>
                        </span>

                        <EditableField
                            val={'Sample Row 3'}/>
                    </BS.ListGroupItem>
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