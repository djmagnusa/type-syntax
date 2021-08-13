import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import { login, logout } from './actions/auth';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';

const store = configureStore();
console.log('test');

const jsx = (
    <Provider store={store}> 
        <AppRouter />
    </Provider>
);
let hasRendered = false;
const renderApp = () => {  
    if (!hasRendered){ //to make sure app only renders only once and not all the time
        ReactDOM.render(jsx, document.getElementById('app'));
        hasRendered = true;
    }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));


firebase.auth().onAuthStateChanged((user) => {
    if(user) { //if there is a user we knw they just logged in
        // console.log('log in');
            // console.log('uid', user.uid) //user.uid stores the user id
            store.dispatch(login(user.uid));
            renderApp();
            if (history.location.pathname === '/') { //if they just logged in and they are on the login page  
                history.push('/dashboard');
            }
    } else {
        // console.log('log out');
        store.dispatch(logout());
        renderApp();
        history.push('/'); //when they log out it will bring them to the login page
    }
});

