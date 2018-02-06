import {ObjIcon} from "../ObjIcon";
import {executeContext} from "../../services/CommandQueueService";
import {EditableField} from "../EditableField";
import {selectedKey} from "./KeyList";

@executeContext
@observer
export class KeyListItem extends Component {

    select(target) {
        const oldVal = selectedKey.get();

        this.context.execute({
            doIt: () => selectedKey.set(target),
            undoIt: () => selectedKey.set(oldVal),
            onSave: () => {},
            message: <span>Selected <code key={1}>{target}</code>.</span>
        });
    }

    changeSelection(newkey) {

        const {obj, keyname} = this.props;

        selectedKey.get() === keyname ? changeCurrentSelection.call(this) : changeNoncurrentSelection.call(this);


        function rename(obj, oldKey, newKey) {
            const oldVal = obj.get(oldKey);
            obj.delete(oldKey);
            obj.set(newKey, oldVal);
        }

        const old = obj.get(keyname);
        function onSave(savedKeys) {
            return {
                [newkey]: savedKeys[keyname] || old.get('bytearray'),
                [keyname]: 'deleted'
            };
        }

        function message() {
            return <span>Renamed <code key={1}>{keyname}</code> to <code key={2}>{newkey}</code>.</span>;
        }


        function changeCurrentSelection() {
            this.context.execute({
                doIt: () => {
                    selectedKey.set(null);
                    rename(obj, keyname, newkey);
                    selectedKey.set(newkey);
                },
                undoIt: () => {
                    selectedKey.set(null);
                    rename(obj, newkey, keyname);
                    selectedKey.set(keyname);
                },
                onSave,
                message: message()
            });
        }

        function changeNoncurrentSelection() {
            this.context.execute({
                doIt: () => rename(obj, keyname, newkey),
                undoIt: () => rename(obj, newkey, keyname),
                onSave,
                message: message()
            });
        }

    }


    render() {

        const {obj, keyname} = this.props;

        return (
            <BS.ListGroupItem
                onClick={() => selectedKey.get() === keyname ? this.select(null) : this.select(keyname)}
                active={selectedKey.get() === keyname}>

                <span style={{display: 'inline-block', width: 25}}>
                    <ObjIcon keyData={obj.get(keyname)}/>
                </span>

                <EditableField
                    val={keyname}
                    onChange={this.changeSelection.bind(this)}/>

                {
                    keyname === selectedKey.get() ?
                        <BS.Glyphicon
                            style={{float: 'right'}}
                            glyph='chevron-right'/>
                        : null
                }
            </BS.ListGroupItem>);
    }
}