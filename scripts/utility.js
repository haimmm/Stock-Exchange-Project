/**standard fetch function
 * @returns parsed json data
 * **/
export const getData = async url =>{
    const response = await fetch(url);
    const data = await response.json();
    if(response.ok)
        return data;
    else
        throw new Error(`The request failed: ${data}`);
}

/**get element by it's ID
 * @returns the element object
 * **/
export const getElement = id =>{
    const element = document.getElementById(id);
    if(element)
        return element;
    else
        throw new Error(`Theere is no such element with id "${id}"`);
}

/**get multiple elements by their IDs. 
 * @returns array with elements objects.
 * **/
export const getElements =  (...args) =>{
    if (args.length === 1) return getElement(args[0]);

    const elements = []
    for(const id of args){
        const element = document.getElementById(id);
        if(element)
            elements.push(element)
        else
            throw new Error(`Theere is no such element with id "${id}"`);
    }
    return elements;
}


/**format any number to have exactly 2 decimal points and adds "+" sign if positive.
 * @returns the number with the new format as a string.
 * **/
export const prettyFloat = num =>{
    num = (+num).toFixed(2);
    return (num > 0 ? '+' :"") + num ;
}

/**standard debounce function
 * @returns the debounce function
 * **/
export const debounce = (fn, wait) => {
    let timeoutId;
    return function(){
      const args = arguments;  
      if(timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(function(){
        timeoutId = null;
        fn.apply(null, args);
      }, wait);
    }
}

export const clearHTML = element => element.innerHTML = "";
