# On React
[Data Fetching with Hooks](#data-fetching-with-hooks)

[Reducers and useReducer](#reducers-and-usereducer)

[refs and useRef](#refs-and-useref)



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

### Refs and useRef
useRef hook returns a mutable object that stays intact throughout the lifetime of a react component. The current property can hold any modifiable value. The current property gets initialized with whatever value is passed to the constructor, for example:
```
  const hasClickedButton = React.useRef(false);
 
  const [count, setCount] = React.useState(0);
 
  function onClick() {
    const newCount = count + 1;
 
    setCount(newCount);
 
    hasClickedButton.current = true;
  }
```
The important thing about refs is that it doesn't trigger a rerender. The ref is a sort of instance variable that will persist across rerenders. You typically see react refs used in conjunction with the DOM api like so
```
function ComponentWithDomApi({ label, value, isFocus }) {
  const ref = React.useRef(); // (1)
 
  React.useEffect(() => {
    if (isFocus) {
      ref.current.focus(); // (3)
    }
  }, [isFocus]);
 
  return (
    <label>
      {/* (2) */}
      {label}: <input type="text" value={value} ref={ref} />
    </label>
  );
}
```

A callback ref is a function which can be used for the HTML element's ref attribute in JSX, which can be used in conjunction with the useCallback hook like so:
```
const ref = React.useCallback((node) => {
    if (!node) return;
 
    const { width } = node.getBoundingClientRect();
 
    document.title = `Width:${width}`;
  }, []);
```

