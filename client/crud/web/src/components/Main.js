import {Editor} from "./Editor";
import {getSwarmData} from '../services/DataService';
import {KeyList} from "./KeyList";
import {Header} from "./Header";
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
                <ReflexFixed style={{ marginBottom: 15 }}>
                   <Header/>
                </ReflexFixed>
                <ReflexElement flex={1}>
                    <ReflexContainer orientation='vertical'>
                        <ReflexElement flex={0.4}>
                            <KeyList
                                obj={obj}
                                selected={selected}
                                onSelect={key => this.setState({ selected: key })}/>

                            <hr/>

                            <QueueEditor/>
                        </ReflexElement>
                        <ReflexSplitter/>
                        <ReflexElement>
                            {
                                selected !== null &&
                                    <Editor obj={obj} propName={selected}/>
                            }
                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>
            </ReflexContainer>
        );
    }
}