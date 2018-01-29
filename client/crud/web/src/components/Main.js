import {JSONEditor} from "./JSONEditor";
import {getSwarmData} from '../services/DataService';
import {KeyList} from "./KeyList";
import logo from './logo-color.png';
import 'bootstrap/dist/css/bootstrap.css';


const MainComponent = () => (
    <ReflexContainer style={{ height: '100%' }}>
        <ReflexFixed style={{
            marginBottom: 15
        }}>
            <img src={logo}/>
            <h1 style={{
                display: 'inline-block',
                fontWeight: 'bold',
                marginLeft: 35,
                marginBottom: 0,
                verticalAlign: 'bottom',
                fontSize: 40
            }}>Database Editor</h1>
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