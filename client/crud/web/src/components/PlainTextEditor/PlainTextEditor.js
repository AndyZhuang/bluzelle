@observer
export class PlainTextEditor extends Component {
    handleChange(e) {
        const {obj, propName} = this.props;
        obj.set(propName, e.target.value);
    }

    render() {
        const { obj, propName } = this.props;

        return (
            <div>
                <BS.FormControl
                    type="textarea"
                    value={obj.get(propName)}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
}