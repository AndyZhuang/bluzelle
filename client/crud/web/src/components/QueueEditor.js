import {commandQueue, undo, redo, canUndo, canRedo, save, currentPosition} from "../services/CommandQueueService";

@observer
export class QueueEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {show: false};
    }

    render() {

        const buttons = (
            <React.Fragment>
                <BS.ButtonGroup style={{ marginRight: 10 }}>

                    <BS.OverlayTrigger placement="bottom" overlay={
                        <BS.Tooltip id="undo-tooltip">Undo</BS.Tooltip>
                    }>
                        <BS.Button onClick={undo}
                                   disabled={!canUndo()}>

                            <BS.Glyphicon glyph='chevron-left'/>
                        </BS.Button>
                    </BS.OverlayTrigger>

                    <BS.OverlayTrigger placement="bottom" overlay={
                        <BS.Tooltip id="redo-tooltip">Redo</BS.Tooltip>
                    }>
                        <BS.Button onClick={redo}
                                   disabled={!canRedo()}>
                            <BS.Glyphicon glyph='chevron-right'/>
                        </BS.Button>
                    </BS.OverlayTrigger>
                </BS.ButtonGroup>

                <BS.OverlayTrigger placement="bottom" overlay={
                    <BS.Tooltip id="list-tooltip">History</BS.Tooltip>
                }>
                    <BS.Button style={{ marginRight: 10 }}
                               onClick={() => this.setState({ show: true })}>
                        <BS.Glyphicon glyph='list'/>
                    </BS.Button>
                </BS.OverlayTrigger>

                <BS.OverlayTrigger placement="bottom" overlay={
                    <BS.Tooltip id="save-tooltip">Save</BS.Tooltip>
                }>
                    <BS.Button style={{ color: 'green' }}
                               onClick={() => console.log(save())}>
                        <BS.Glyphicon glyph='floppy-save'/>
                    </BS.Button>
                </BS.OverlayTrigger>
            </React.Fragment>
        );


        const historyList =
            commandQueue.map(({revert, message}, index) =>
                <BS.ListGroupItem
                    onClick={revert}
                    key={index}
                    active={currentPosition.get() === index}>

                    {message}
                </BS.ListGroupItem>);

        return (
            <div style={{ padding: 10 }}>

                {buttons}

                <BS.Modal show={this.state.show}
                          onHide={() => this.setState({ show: false })}>
                    <div style={{fontFamily: 'monospace'}}>

                        <BS.ListGroup style={{ margin: 0 }}>
                            {historyList}
                        </BS.ListGroup>
                    </div>
                </BS.Modal>
            </div>
        );
    }
}