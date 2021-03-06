# Middlewares

Middlewares are used when you want to do anything more than just change the state. It can be used to dispatch asynchronous actions for e.g. to load external data or perform a side-effect in the application.

```js
const API_REQUEST = 'mymodule/REQUEST'
const mymodule = {
  middleware(store) {
    return next => action => {

      if (action.type == API_REQUEST) {
        console.log(action.payload.body, 'Api request')
      }

      return next(action)
    }
  }
}
```

Just like you can do with reducers, you can also use an object for middlewares, when you want to listen to a single or multiple action types:

```js
const API_REQUEST = 'mymodule/REQUEST'
const mymodule = {
  middleware: {
    [API_REQUEST]: store => next => action => {
      console.log(action.payload.body, 'Api request')
      return next(action)
    }
  }
}
```

Inside middlewares you can dispatch an action using `next()` or `dispatch()`, see the [Side Effects](SideEffects.md) documentation for better understanding on when and how to use them.

You can check Redux's documentation for a more detailed documentation about Redux's [middlewares](http://redux.js.org/docs/advanced/Middleware.html).
