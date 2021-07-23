# On React
[Data Fetching with Hooks](#data-fetching-with-hooks) 
[Reducers and useReducer](#reducers-and-usereducer) 

### Data Fetching with Hooks
Must be worked around this way using an async function will return an AsyncFunction object, whereas useEffect must return either nothing or a cleanup function. 
```
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://hn.algolia.com/api/v1/search?query=redux',
      );
 
      setData(result.data);
    };
 
    fetchData();
  }, []);
```

### Reducers and useReducer
A reducer is a function that takes two arguments, a current state and an action, and returns a new state. Different actions enable reducers to provide conditional state transitions. Typically actions come in a pair of {type, payload}, where payload specifies necessary information to perform the update.

The useReducer hook has the following syntax `const [state, dispatch] = useReducer(todoReducer, initialState);` with a reducer function as follows: 
```
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'A':
      return {...state, a: action.payload.update};
    default:
      return state;
  }
};
```

In this case the state can be referenced off the state that is returned in the destructuring, and the dispatch used to dispatch an action `dispatch({ type: 'A', payload: {update: 'foo}});`
