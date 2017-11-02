import Tabs from './MainTabs'
import NodeGraph from 'components/tabs/NodeGraph'
import MessageListTabBody from 'components/tabs/MessageListTabBody'
import NodeListTabBody from 'components/tabs/NodeListTabBody'
import LogTabBody from 'components/tabs/LogTabBody'
import SettingsTabBody from 'components/tabs/SettingsTabBody'
import Header from './Header'
import QAHandle from 'components/QAHandle'

export default class Main extends Component {

    componentDidCatch(error, info) {
        confirm('An unrecoverable error occurred, the application will now reload') && (window.location.href = window.location.origin);
    }

    render() {
        return (
            <Layout type="column">
                {/\?functional-testing/.test(window.location.href) && (
                    <Fixed>
                        <div><QAHandle /></div>
                    </Fixed>
                )}
                <Fixed>
                    <Header />
                    <div style={{height: 6}}/>
                </Fixed>
                <Fixed>
                    <div style={{height: 40}}>
                        <Tabs/>
                    </div>
                </Fixed>
                <Flex style={{overflow: 'auto', borderTop: '1px solid #555'}}>
                    <Switch>
                        <Route path="/message-list/:address" component={MessageListTabBody} />
                        <Route path="/message-list" component={MessageListTabBody} />
                        <Route path="/node-graph" component={NodeGraph}/>
                        <Route path="/node-list" component={NodeListTabBody}/>
                        <Route path="/settings" component={SettingsTabBody}/>
                        <Route component={LogTabBody}/>
                    </Switch>
                </Flex>
            </Layout>
        )
    }
}


