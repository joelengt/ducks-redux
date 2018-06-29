import createDuck from './remoteObjDuck'
import reset from './resetDuckExtension'

export default createDuck({ namespace: 'my-app',store: 'user', path: '/users' }).extend(reset)