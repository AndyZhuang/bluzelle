import logo from './logo-color.png';

export const Header = () => (
    <React.Fragment>
        <img src={logo}/>
        <h1 style={{
            display: 'inline-block',
            fontWeight: 'bold',
            marginLeft: 35,
            marginBottom: 0,
            verticalAlign: 'bottom',
            fontSize: 40
        }}>Database Editor</h1>
    </React.Fragment>
);