import {getRaw, addPrefix} from "../Editor";
import {execute} from "../../services/CommandQueueService";

export const PREFIX = 1;
const ENCODING = 'utf-8';

@observer
export class PlainTextEditor extends Component {

    constructor(props) {
        super(props);

        const {keyData} = this.props;

        this.state = {
            val: byteArrayToStr(getRaw(keyData)),
            oldVal: byteArrayToStr(getRaw(keyData))
        };
    }

    onSubmit(e) {
        e.preventDefault();

        const {keyData, keyName} = this.props;
        const currentVal = this.state.val;
        const oldVal = this.state.oldVal;

        execute({
            doIt: () => this.setState({val: currentVal}),
            undoIt: prev => prev.doIt ? prev.doIt()
                : this.setState({val: byteArrayToStr(getRaw(keyData))}),
            onSave: this.onSave.bind(this, currentVal),
            message: <span>Updated <code key={1}>{keyName}</code>.</span>
        });

        this.setState({oldVal: currentVal});
    }

    onSave(interpreted) {
        return {
            [this.props.keyName]: addPrefix(strToByteArray(interpreted), PREFIX)
        };
    }

    handleChange(e) {
        this.setState({val: e.target.value});
    }

    render() {
        return (
            <div style={{height: '100%'}}>
                <BS.Form style={{height: '100%'}}>
                    <BS.FormControl
                        style={{height: '100%', resize: 'none'}}
                        componentClass="textarea"
                        value={this.state.val}
                        onChange={this.handleChange.bind(this)}
                        onBlur={this.onSubmit.bind(this)}/>
                </BS.Form>
            </div>
        );
    }
}

const strToByteArray = str => new TextEncoder(ENCODING).encode(str);
const byteArrayToStr = arr => new TextDecoder(ENCODING).decode(arr);