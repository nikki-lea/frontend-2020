# On React
[Data Fetching with Hooks](#data-fetching-with-hooks)

[Reducers and useReducer](#reducers-and-usereducer)

[refs and useRef](#refs-and-useref)

[useMemo and React Memo API](#usememo-and-react-memo-api)

[useCallback](#useCallback)

[Component Rerender Behavior](#component-rerender-behavior)

[React Higher Order Components](#react-higher-order-components)  

[Controlled components in React](#controlled-components-in-react)

[Hooks Usage in React](#hooks-usage-in-react)


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

You can, however, update content using `ref.current.textContent`, like so:
```
import React, { useRef} from 'react';
import "./styles.css";

export default function App() {
  const timeRef = useRef();
  const intervalRef = useRef({timer: null});

  const updateTime = () => {
    const newTime = parseInt(timeRef.current.textContent) + 1;
    timeRef.current.textContent = newTime;
  }
  const startTimer = () => {
    intervalRef.current.timer = setInterval(updateTime, 1000)
  };
  const clearTimer = () => {
    clearInterval(intervalRef.current.timer);
    timeRef.current.textContent = "0";
  };

  return (
    <div className="App">
      <p ref={timeRef}>0</p>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={clearTimer}>Stop Timer</button>
    </div>
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

### Component Rerender Behavior
useState: Rerenders on on each setState update. What if you have a setState handler thats passed to a child component, to update the parent component state? In this case, if the child calls setState, then the parent would rerender, and rerender all of its children, regardless of if the child is even using the state that had been changed. useMemo helps mitigate this.

on useEffect, if useEffect returns a function, this is a 'cleanup handler'. On a rerender, the cleanup handler will first run with the previous state, then the outer scoped function defined in useEffect will run. Also, the cleanup handler will run after the component unmounts. The useEffect will run on every state update if no dependency array is specified, and the handler will run after the current state is set to the DOM. Be careful with causing infinite rerenders in useEffect's dependency array. If something such as a function in your dependency array is re-defined on every rerender, and useEffect updates state each time, you will have an infinite rerender loop.

useLayoutEffect - This is identical to useEffect but runs synchronously after all DOM mutations. Note that if you have SSR, neither useEffect or useLayout will run until after the JavaScript is downloaded client side. If something must render client side you can render it conditionally using a useEffect with an empty dependency list. This is handy if you need to manipulate the DOM after state is set but before first paint, such as adding a class conditionally.

useContext - All consumers that are descendents of a provider will rerender whenever the provider's value prop changes. If you have a parent component that uses state from useContext, it will rerender all of its descendents, regardless of if they consume state from useContext. You can in theory memoize the components to help insulate them from this but use react dev tools profiler to measure first.

### Conditional Rendering in React
- Using if statements, you can return null and it will render nothing
- If/else statements
- Ternary operators, useful since this can be inlined
- Using &&, renders either the element or nothing, `{isLoading && <p>Loading</p}`
Switch case, you can technically inline it if its an IIFE, conditional renderings with multiple conditions
```
      {(() => {
        switch (status) {
          case 'info':
            return <Info text={text} />;
          case 'warning':
            return <Warning text={text} />;
          case 'error':
            return <Error text={text} />;
          default:
            return null;
        }
      })()}
```
Enums
```
jsx part
      {
        {
          info: <Info text={text} />,
          warning: <Warning text={text} />,
          error: <Error text={text} />,
        }[status]
      }
```
## React higher order components
This is an example:
```
// Higher-Order Component
function withLoadingIndicator(Component) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />;
    }
 
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  };
}
 
const ListWithLoadingIndicator = withLoadingIndicator(List);
 
function App({ list, isLoading }) {
  return (
    <div>
      <h1>Hello Conditional Rendering</h1>
 
      <ListWithLoadingIndicator isLoading={isLoading} list={list} />
    </div>
  );
}
```

### Controlled components in React
React form elements typically maintain their own state in addition to the react mutable state. We use react state as a single source of truth for values. Be mindful that the form submit handler goes on the form wrapper itself, and that it will cause a hard page reload.  
An example of a form:  
```      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
```
React inputs expanded:  
Type:  
- number/text  
- submit (triggers the onSubmit handler on form)  
- file (interact with the javascript file system api, that can be accessed with `const selectedFile = document.getElementById('input').files[0];`)
- value (if not assigned to state, and assigned to a constant, it will pin the value)
Name: An identifier used for react, propagates the value with the event as e.target.name

### Hooks Usage in React
- A custom Hook is a JavaScript function whose name starts with ”use” and that may call other Hooks. 
- Must be run in react components, operate on react component state, return no jsx


#### usePrevious
```
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```
[useDeepCompareEffect](https://github.com/kentcdodds/use-deep-compare-effect)    
[React Hooks for Analytics](https://getanalytics.io/utils/react-hooks/)    
[GraphQL Hooks](https://github.com/nearform/graphql-hooks#readme)
