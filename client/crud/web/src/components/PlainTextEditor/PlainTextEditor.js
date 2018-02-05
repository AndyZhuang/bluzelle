import {getRaw, addPrefix} from "../Editor";
import {execute} from "../../services/CommandQueueService";
import {byteArrayToStr, strToByteArray} from "../../util/encoding";


export const PREFIX = 1;
const ENCODING = 'utf-8';

@observer
export class PlainTextEditor extends Component {

    constructor(props) {
        super(props);

        const {keyData} = this.props;

        this.state = {
            oldVal: byteArrayToStr(getRaw(keyData))
        };
    }

    onSubmit(e) {
        e.preventDefault();

        const newVal = this.props.keyData.get('interpreted');
        const oldVal = this.state.oldVal;

        const {keyName} = this.props;


        execute({
            doIt: () => this.props.keyData.set('interpreted', newVal),
            undoIt: () => this.props.keyData.set('interpreted', oldVal),
            onSave: this.onSave.bind(this, newVal),
            message: <span>Updated <code key={1}>{keyName}</code>.</span>
        });

        this.setState({oldVal: newVal});
    }

    onSave(interpreted) {
        return {
            [this.props.keyName]: addPrefix(strToByteArray(interpreted), PREFIX)
        };
    }

    handleChange(e) {
        this.props.keyData.set('interpreted', e.target.value);
    }

    render() {

        const {keyData} = this.props;

        keyData.has('interpreted')
            || keyData.set('interpreted', byteArrayToStr(getRaw(keyData)));

        return (
            <div style={{height: '100%'}}>
                <BS.Form style={{height: '100%'}}>
                    <BS.FormControl
                        style={{height: '100%', resize: 'none'}}
                        componentClass="textarea"
                        value={keyData.get('interpreted')}
                        onChange={this.handleChange.bind(this)}
                        onBlur={this.onSubmit.bind(this)}/>
                </BS.Form>
            </div>
        );
    }
}

export const textToKeyData = str => ({
    bytearray: addPrefix(strToByteArray(str), PREFIX)});