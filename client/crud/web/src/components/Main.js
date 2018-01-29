import {JSONEditor} from "./JSONEditor";
import {getSwarmData} from '../services/DataService';
import {KeyList} from "./KeyList";
import 'bootstrap/dist/css/bootstrap.css';


const MainComponent = () => (
    <ReflexContainer
        style={{height: '100%'}}>

        <ReflexFixed>
            <h1>Database</h1>
        </ReflexFixed>

        <ReflexElement flex={1}>
            <ReflexContainer orientation='vertical'>
                <ReflexElement flex={0.4}>
                    <KeyList/>
                </ReflexElement>
                <ReflexSplitter/>
                <ReflexElement>
                    <JSONEditor obj={getSwarmData()} propName='key1' isRoot={true}/>
                </ReflexElement>
            </ReflexContainer>
        </ReflexElement>
    </ReflexContainer>
);

export const Main = observer(MainComponent);