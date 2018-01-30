import {commandQueue} from "../services/CommandQueueService";

@observer
export class QueueEditor extends Component {
    render() {
        return (
            <div>
                <h2>Command Queue</h2>

                <BS.ListGroup>
                    {commandQueue.map(
                        ({ doIt, undoIt, message }, index) =>

                        <BS.ListGroupItem
                            onClick={undoIt}
                            key={index}>

                            {message}
                        </BS.ListGroupItem>
                    )}
                </BS.ListGroup>
            </div>
        );
    }
}