import {HashRouter, Route} from 'react-router-dom'
import {Main} from 'components/Main'
import DevTools from 'mobx-react-devtools';

export const App = () => (
    <div style={{height: '100%'}}>
        {/*<DevTools/>*/}
        <HashRouter>
            <Route component={Main} />
        </HashRouter>
    </div>
);

