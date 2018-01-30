import {observableMapRecursive as omr} from "../../mobXUtils";
import {PlainTextEditor} from "./PlainTextEditor";

describe('Plain text editor', () => {

    it('should respond to changes in the text area', () => {

        const obj = omr({ myText: 'Hello World' });
        const wrapper = mount(
            <PlainTextEditor
                obj={obj}
                propName='myText'/>);

        wrapper.find('input')
            .simulate('change', { target: { value: "Different text" }});

        expect(obj.toJS()).to.deep.equal({ myText: "Different text" });

    });

});