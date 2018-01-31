import {commandQueue, currentPosition} from "../services/CommandQueueService";

@observer
export class QueueEditor extends Component {
    render() {
        return (
            <div>
                <h2>Command Queue</h2>

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