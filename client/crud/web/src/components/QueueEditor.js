import {commandQueue, undo, redo, canUndo, canRedo, currentPosition} from "../services/CommandQueueService";

@observer
export class QueueEditor extends Component {
    render() {
        return (
            <div>
                <h2>Command Queue</h2>

                <BS.ButtonGroup>
                    <BS.Button onClick={undo}
                        disabled={!canUndo()}>
                        <BS.Glyphicon glyph='chevron-left'/>
                    </BS.Button>
                    <BS.Button onClick={redo}
                        disabled={!canRedo()}>
                        <BS.Glyphicon glyph='chevron-right'/>
                    </BS.Button>
                </BS.ButtonGroup>

                <div style={{fontFamily: 'monospace'}}>
                    <BS.ListGroup>
                        {commandQueue.map(
                            ({revert, message}, index) =>

                                <BS.ListGroupItem
                                    onClick={revert}
                                    key={index}
                                    active={currentPosition.get() === index}>

                                    {message}
                                </BS.ListGroupItem>
                        )}
                    </BS.ListGroup>
                </div>
            </div>
        );
    }
}