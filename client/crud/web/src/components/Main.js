import {Editor} from "./Editor";
import {getSwarmData} from '../services/DataService';
import {KeyList} from "./KeyList";
import {Header} from "./Header/Header";
import 'bootstrap/dist/css/bootstrap.css';
import {QueueEditor} from "./QueueEditor";

@observer
export class Main extends Component {
    constructor(props) {
        super(props);

        const obj = getSwarmData();

        this.state = {
            obj,
            selected: obj.keys()[0]
        };
    }

    render() {

        const {obj, selected} = this.state;
        
        return (
            <ReflexContainer style={{height: '100%'}}>
                <ReflexFixed>
                    <Header/>
                    <hr/>
                </ReflexFixed>
                <ReflexElement flex={1}>
                    <ReflexContainer orientation='vertical'>
                        <ReflexElement flex={0.4}>
                            <QueueEditor/>

                            <hr/>

                            <KeyList
                                obj={obj}
                                selected={selected}
                                onSelect={(key, callback) => this.setState({selected: key}, callback)}/>
                        </ReflexElement>
                        <ReflexSplitter/>
                        <ReflexElement>
                            {
                                selected !== null &&
                                <Editor keyData={obj.get(selected)}
                                        keyName={selected}
                                        onCancel={() => {
                                            obj.delete(selected);
                                            this.setState({selected: null});
                                        }}/>
                            }
                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>
            </ReflexContainer>
        );
    }
}