import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';
import { browserHistory } from 'react-router'
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livro'

ReactDOM.render(
    (<Router>
        <App>
            <switch>
                <Route exact path="/" component={Home}/>
                <Route path="/autor" component={AutorBox}/>
                <Route path="/livro" component={LivroBox}/>
            </switch>
        </App>
    </Router>),
    document.getElementById('root'));
registerServiceWorker();
