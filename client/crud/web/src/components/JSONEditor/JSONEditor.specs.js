import {JSONEditor} from "./JSONEditor";
import {RenderObject} from "./Objects/RenderObject";
import {RenderArray} from "./Arrays/RenderArray";
import {RenderTree} from "./Trees/RenderTree";
import {EditableField} from "./EditableField";
import {Hoverable} from "./Hoverable";
import {each} from 'lodash';
import {observableMapRecursive as omr} from "../../mobXUtils";

describe('JSONEditor', () => {

    describe('renders', () => {

        it('should render an object', () => {

            const obj = omr({ root: { a: 5 }});
            const mWrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            expect(mWrapper
                .find(RenderTree)
                .filterWhere(el => el.props().propName === 'a'))
                .to.have.length(1);
        });

        it('should render recursively', () => {

            const obj = omr({ root: { a: { b: 5 }}});

            const mWrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            expect(mWrapper
                .find(RenderTree)
                .filterWhere(el => el.props().propName === 'a'))
                .to.have.length(1);

            expect(mWrapper
                .find(RenderTree)
                .filterWhere(el => el.props().propName === 'b'))
                .to.have.length(1);
        });

    });


    describe('updates', () => {

        const types = {
            number: [123, 31.32],
            boolean: [true, false],
            string: ["hello", '"goodbye"']
        };

        each(types, ([val1, val2], type) => {
            it(`should update a ${type} field`, () => {

                const obj = omr({ root: { a: val1 }});
                const mWrapper = mount(<JSONEditor obj={obj} propName='root'/>);

                mWrapper.find(EditableField).filterWhere(el => el.text() === JSON.stringify(val1)).simulate('click');
                mWrapper.find('input').simulate('change', { target: { value: JSON.stringify(val2) }});
                mWrapper.find('form').simulate('submit');

                expect(obj.get('root').get('a')).to.equal(val2);
            });
        });

        it('should delete a boolean field', () => {

            const obj = omr({ root: { a: true }});
            const mWrapper = mount(<JSONEditor obj={obj} propName='root' isRoot={true}/>);

            // mWrapper.find('span').filter({ className: 'glyphicon glyphicon-pencil' })

            mWrapper
                .find(RenderObject)
                .find(Hoverable)
                .simulate('mouseOver');

            mWrapper.find('span')
                .filter({ className: 'glyphicon glyphicon-remove' })
                .simulate('click');

            expect(obj.get('root').get('a')).to.be.undefined;

        });

        it('should delete a deep field', () => {

            const obj = omr({ root: {
                field: 123,
                otherObject: {
                    a: true,
                    b: false,
                    c: [1, 2, 3, "delete this"]
                }
            }});

            const mWrapper = mount(<JSONEditor obj={obj} propName='root' isRoot={true}/>);

            mWrapper
                .find(RenderTree)
                .filter({ propName: 3 })
                .find(Hoverable)
                .simulate('mouseOver');

            mWrapper
                .find(RenderTree)
                .filter({ propName: 3 })
                .find('span')
                .filter({ className: 'glyphicon glyphicon-remove' })
                .first()
                .simulate('click');

            expect(obj.get('root').get('otherObject').get('c').length).to.equal(3);


            mWrapper
                .find(RenderTree)
                .filter({ propName: 'otherObject' })
                .simulate('mouseOver')
                .find('span')
                .filter({ className: 'glyphicon glyphicon-remove' })
                .first()
                .simulate('click');

            expect(obj.get('root').get('otherObject')).to.be.undefined;

        });


        it('should update the root field given', () => {

            const obj = omr({ root: { a: { b: 5 }}});

            // const mWrapper = mount(<JSONEditor />);

        });


        it('should update color based on validity-state of JSON', () => {

            const obj = omr({ root: { a: 5 }});

            const mWrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            const ef = mWrapper
                .find(EditableField)
                .filterWhere(el => el.text() === '5');

            ef.simulate('click');

            const input = mWrapper.find('input');
            input.simulate('change', { target: { value: '[1, 2, 3]' }});

            // These elements and classes are part of react-bootstrap.
            const form = mWrapper.find('form');
            const group = form.children().at(0);

            expect(input.props()).to.have.property('type', 'text');
            expect(group.props()).to.have.property('validationState', 'success');

        });

    });


    describe('add new field', () => {

        it('should be able to rename the key of a field', () => {

            const obj = omr({ root: {
                somekey: 123
            }});

            const wrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            wrapper.find(EditableField)
                .filterWhere(el => el.text() === 'somekey')
                .simulate('click');

            wrapper.find('input')
                .simulate('change', { target: { value: 'newkey' } });

            wrapper.find('form')
                .simulate('submit');

            expect(obj.get('root').get('newkey')).to.equal(123);
            expect(obj.get('root').get('somekey')).to.be.undefined;

        });


        it('should have a (+) button', () => {

            const obj = omr({ root: { a: 5 }});

            const wrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            wrapper.find(RenderObject).simulate('mouseOver');

            wrapper.find('span')
                .filter({ className: 'glyphicon glyphicon-plus' })
                .simulate('click');

        });


        it('should have two consecutive inputs to create a new field', () => {

            const obj = omr({ root: {}});

            const wrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            wrapper
                .find(Hoverable)
                .simulate('mouseOver');

            wrapper.find('span')
                .filter({ className: 'glyphicon glyphicon-plus' })
                .simulate('click');

            wrapper.find('input')
                .simulate('change', { target: { value: 'keyname' } });

            wrapper.find('form')
                .simulate('submit');

            wrapper.find('input')
                .simulate('change', { target: { value: '51' } });

            wrapper.find('form')
                .simulate('submit');

            expect(obj.get('root').get('keyname')).to.equal(51);

        });

        it('should not create a new field if the user enters invalid key/json', () => {

            const obj = omr({ root: {}});

            const wrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            wrapper
                .find(Hoverable)
                .simulate('mouseOver');

            wrapper.find('span')
                .filter({ className: 'glyphicon glyphicon-plus' })
                .simulate('click');

            wrapper.find('input')
                .simulate('submit');

            wrapper.find('input')
                .simulate('change', { target: { value: 'invalid' } });

            wrapper.find('form')
                .simulate('submit');

            expect(obj.get('root').toJS()).to.be.empty;

        });


        it('should have a single input for new array values', () => {
            const obj = omr({ root: { arr: [] }});
            const wrapper = mount(<JSONEditor obj={obj} propName='root'/>);

            wrapper.find(RenderArray)
                .simulate('mouseOver');

            wrapper.find(RenderArray)
                .find('span')
                .filter({ className: 'glyphicon glyphicon-plus' })
                .simulate('click');

            wrapper.find('input')
                .simulate('change', { target: { value: '"hello world"' }});

            wrapper.find('form')
                .simulate('submit');

            expect(obj.get('root').get('arr').toJS()).to.deep.equal(["hello world"]);

        });

    });

});