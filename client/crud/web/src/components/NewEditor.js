import {defaultKeyData as jsonDefault} from './JSONEditor';
import {defaultKeyData as plainTextDefault} from './PlainTextEditor';

export class NewEditor extends Component {
    json() {
        this.props.keyData.set('bytearray', jsonDefault.bytearray);
    }

    plainText() {
        this.props.keyData.set('bytearray', plainTextDefault.bytearray);
    }

    render() {
        return (
            <BS.Modal show={true} onHide={this.props.onCancel}>
                <BS.Modal.Header closeButton>
                    <BS.Modal.Title>
                        Select Key Type
                    </BS.Modal.Title>
                </BS.Modal.Header>
                <BS.Modal.Body>
                    <BS.ButtonGroup>
                        <BS.Button onClick={() => this.json()}>JSON Data</BS.Button>
                        <BS.Button onClick={() => this.plainText()}>Plain Text</BS.Button>
                    </BS.ButtonGroup>
                </BS.Modal.Body>
            </BS.Modal>
        );
    }
}