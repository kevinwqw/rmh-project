import createMobxWidget from '../../common/createMobxWidget';
import Home from './components';
import Store from './store';
import { StoreContext } from './context';

export default {
    id: 'demo-widget',
    create: createMobxWidget(Home, Store, StoreContext),
    renderMode: 'client'
};
