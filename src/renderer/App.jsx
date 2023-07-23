import React from 'react';
import './App.css';

export default function App() {
    const [greetingFromMain, setGreetingFromMain] = React.useState(false);
    const [dependencies, setDependencies] = React.useState([]);
    const [windowTitle, setWindowTitle] = React.useState(null);
    const [greetingText, setGreetingText] = React.useState(null);

    React.useEffect(() => {
        window.ipc.once(
            'greeting',
            (data) => {
                setGreetingFromMain(data);
            }
        );
    }, []);

    const dependencyList = dependencies.map((dep) => {
        return <li key={dep['name']}>{dep['name']}{dep['version'] ? `:${dep['version']}` : ''}</li>;
    });

    async function loadDependencies() {
        setDependencies(await window.ipc.invoke('load-dependencies'));
    }

    function handleTitleChange(event) {
        setWindowTitle(event.target.value);
    }

    function handleHelloRequestChange(event) {
        setGreetingText(event.target.value);
    }

    return (
        <div>
            <div style={{marginBottom: 10}}>
                <p style={{fontStyle: 'italic'}}>Requesting greeting works only once, it demonstrates Electron's "once" listener,
                    as well as sending one-way messages from the main process to a renderer.</p>
                <input name='requestHello' onChange={handleHelloRequestChange} />
                <button onClick={() => window.ipc.send('request-greeting', greetingText)}>Request greeting</button>
                {greetingFromMain && <span style={{marginLeft: 10}}>{greetingFromMain}</span>}
            </div>

            <div style={{marginBottom: 10}}>
                <p style={{fontStyle: 'italic'}}>Changing window title works multiple times, this is an one-way message from a renderer to the main process.</p>
                <input name='title' onChange={handleTitleChange} />
                <button onClick={() => window.ipc.send('set-title', windowTitle)}>Set window title</button>
            </div>

            <p style={{fontStyle: 'italic'}}>Loading dependencies calls main with a promise which can return data.</p>
            <button onClick={loadDependencies}>Load dependencies</button>

            {dependencies.length > 0 && <ul>{dependencyList}</ul>}
        </div>
    );
};