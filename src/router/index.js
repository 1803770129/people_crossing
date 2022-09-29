import App from '../App'
import Mesh from '../pages/mesh/index'

export default {
    routes: [
        { exact: true, path: '/', component: App },
        { exact: true, path: '/mesh', component: Mesh },
    ],
}