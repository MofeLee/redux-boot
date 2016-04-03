import test from 'tape'
import Choko, {BOOT} from '../src/lib/bootstrap'


test('Boostrap new app with no arguments', (assert) => {
  const app = Choko()

  assert.deepLooseEqual(
    Reflect.ownKeys(app.store),
    ['dispatch', 'subscribe', 'getState', 'replaceReducer'],
    'Store created'
  )

  assert.end()
})

test('Boostrap new app with an initial state', (assert) => {
  const initialState = {
    variables: {
      name: 'Test app'
    }
  }
  const app = Choko(initialState)

  assert.deepEqual(
    app.store.getState(),
    initialState,
    'State is equal to initial state'
  )

  assert.end()
})

test('Boostrap new app with a module implementing a reducer', (assert) => {
  const initialState = {
    foo: 'bar'
  }

  const testModule = {
    reducer(state, action) {
      if (action.type === BOOT) {
        assert.pass('Reducer called')
        return {
          ...state,
          foo: 'baz'
        }
      }
      return state
    }
  }

  const modules = [
    testModule
  ]

  const app = Choko(initialState, modules)

  assert.equal(
    app.store.getState().foo,
    'baz',
    'Module reducer changed state'
  )

  assert.end()
})

test('Boostrap new app with a module implementing a middleware', (assert) => {
  const AFTER_BOOT = 'choko/core/test/AFTER_BOOT'

  const afterBoot = (value) => {
    return {
      type: AFTER_BOOT,
      payload: {
        foo: value
      }
    }
  }

  const initialState = {
    foo: 'bar'
  }

  const testModule = {

    reducer(state, action) {
      if (action.type === AFTER_BOOT) {
        assert.pass('Reducer called')
        return {
          ...state,
          foo: action.payload.foo
        }
      }
      return state
    },

    middleware({getState, dispatch}) {
      return next => (action) => {

        if (action.type === BOOT) {
          assert.pass('Middleware called')
          dispatch(afterBoot('baz'))
        }

        return next(action)
      }
    }

  }

  const modules = [
    testModule
  ]

  const app = Choko(initialState, modules)

  assert.equal(
    app.store.getState().foo,
    'baz',
    'Module middle dispatched an action that changed state'
  )

  assert.end()
})