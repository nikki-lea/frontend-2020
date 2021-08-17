# On React
[Data Fetching with Hooks](#data-fetching-with-hooks)

[Reducers and useReducer](#reducers-and-usereducer)

[refs and useRef](#refs-and-useref)

[useMemo and React Memo API](#usememo-and-react-memo-api)

[useCallback](#useCallback)


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
### useMemo and React Memo API
The useMemo hook memoizes a functions return value, running the function only when a dependency has changed. Say if you have a very long list and you are mapping each item on the list, but you only need run the mapping on a particular state change such as after the user has submitted, this is a good way to memoize the function so it just saves the value. Note that useMemo itself has computational cost in that it has to compare the dependencies in the array on each render to see if they've changed, so typically the performance gain from memoization isn't substantially greater than this. 

The React Memo API is used to wrap React components to prevent rerenderings. If you are, for example, rendering a list of text fields, and the current text field and the list are both maintained in state, you will in fact render the app, the list, and each list item on each time a text field is changed because the parent will update its state and then all the children will rerender. You can wrap the function that renders each of the list items with React.memo. If the list items are unchanged, it will use the memoized props rather than rerendering each time. You can even memoize the individual items in the list so that they do not rerender unless they are changed too.

### useCallback
useCallback is used to memoize functions. So given the list example above, say now the list item accepts a callback, onRemove(). onRemove is defined in the App component, then passed to each of the list items so that they can be removed when the user clicks a remove button. This actually entirely negates anything done by React.memo. So the problem is if that the app component rerenders, the handleRemove callback definition gets re-defined, so the memoization things it is in fact a new callback handler. We can handle this through use of useCallback, which will memoize the function itself. 
