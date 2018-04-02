import io from 'socket.io-client/dist/socket.io'
import { select, call } from 'redux-saga/effects'
import config from '../../config'
import { selectors } from '../modules/auth'

export const createSocketWithToken = token => (namespace, url = config('socketUrl')) => {
  if (process.env.BUILD_FLAG_IS_CLIENT !== 'true') {
    throw new Error('Calling createSocket from node.')
  }

  const socket = io(`${url}${namespace}`, {
    query: { access_token: token },
    transports: ['websocket'],
    upgrade: false,
  })

  socket.on('connect_error', err => console.error('socket connect_error', err))
  socket.on('connect_timeout', err => console.error('socket connect_timeout', err))
  socket.on('error', err => console.error('socket error', err))

  return new Promise((resolve) => {
    socket.on('connect', res => resolve(socket, res))
  })
}

export default function* (...params) {
  const token = yield select(selectors.getAccessToken)

  return yield call(createSocketWithToken(token), ...params)
}
