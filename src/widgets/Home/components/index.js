import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context';

const Home = () => {
    const store = useStore();
    const { message } = store;
    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default observer(Home);
