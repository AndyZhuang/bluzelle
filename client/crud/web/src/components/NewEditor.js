import {defaultKeyData as jsonDefault} from './JSONEditor';
import {defaultKeyData as plainTextDefault} from './PlainTextEditor';
import {ObjIcon} from "./ObjIcon";

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
                    <BS.ListGroup>
                        <BS.ListGroupItem onClick={() => this.json()}>
                            <ObjIcon keyData={observable.map(jsonDefault)}/>
                            JSON Data
                        </BS.ListGroupItem>
                        <BS.ListGroupItem onClick={() => this.plainText()}>
                            <ObjIcon keyData={observable.map(plainTextDefault)}/>
                            Plain Text
                        </BS.ListGroupItem>
                    </BS.ListGroup>
                </BS.Modal.Body>
            </BS.Modal>
        );
    }
}