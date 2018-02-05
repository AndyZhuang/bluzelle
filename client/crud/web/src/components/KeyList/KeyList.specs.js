import {KeyList} from "./KeyList";
import {toJS} from 'mobx';
import {observableMapRecursive as omr} from "../../util/mobXUtils";
import {textToKeyData} from "../PlainTextEditor";

describe('KeyList', () => {

    class SelectionWrapper extends Component {
        constructor(props) {
            super(props);
            this.state = {selected: null};
        }

        render() {
            return React.cloneElement(this.props.children, {
                selected: this.state.selected,
                onSelect: (v, callback) => this.setState({selected: v}, callback)
            });
        }
    }


    // TODO: all components should use context.execute. We should mock execute here.

    const findLabel = (wrapper, word) =>
        wrapper.find(BS.ListGroupItem)
            .filterWhere(el => el.text().includes(word));

    it('should be able to select a new key', () => {

        const spy = sinon.spy();
        const obj = omr({
            hello: textToKeyData("world"),
            goodbye: textToKeyData("cruel world")
        });

        const wrapper = mount(<KeyList obj={obj} onSelect={spy}/>);

        findLabel(wrapper, 'hello').simulate('click');

        expect(spy.calledWith('hello'));
        expect(spy.calledWith('blah')).to.equal(false);

    });

    it('should deselect the key when double-selecting', () => {

        const spy = sinon.spy();
        const obj = omr({ a: textToKeyData("2") });

        const wrapper = mount(
            <KeyList obj={obj} selected='a' onSelect={spy}/>);

        findLabel(wrapper, 'a').simulate('click');

        expect(spy.calledWith(null));

    });


    it('should be able to delete a key', () => {

        const obj = omr({ a: textToKeyData("2") });

        const wrapper = mount(<SelectionWrapper><KeyList obj={obj}/></SelectionWrapper>);

        findLabel(wrapper, 'a').simulate('click');

        wrapper.find(BS.Button)
            .at(1)
            .simulate('click');

        expect(toJS(obj)).to.deep.equal({});

    });


    it('should be able to add a new key', () => {

        const obj = omr({});

        const wrapper = mount(<SelectionWrapper><KeyList obj={obj}/></SelectionWrapper>);

        wrapper.find(BS.Button)
            .at(0)
            .simulate('click');

        wrapper.find('input')
            .simulate('change', { target: { value: 'newkey' } });

        wrapper.find('form')
            .simulate('submit');

        expect(toJS(obj)).to.deep.equal({ newkey: {} });

    });


    it('should not add a key with a blank field', () => {

        const obj = omr({});

        const wrapper = mount(<SelectionWrapper><KeyList obj={obj}/></SelectionWrapper>);

        wrapper.find(BS.Button)
            .at(0)
            .simulate('click');

        wrapper.find('form')
            .simulate('submit');

        expect(obj.toJS()).to.deep.equal({});

    });

});