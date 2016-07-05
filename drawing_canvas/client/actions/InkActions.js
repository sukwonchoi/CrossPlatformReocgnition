import dispatcher from "../AppDispatcher.js"

export function changeColour(colour){
  dispatcher.dispatch({
    type: "CHANGE_COLOUR",
    colour,
  });
}
