import dispatcher from "../AppDispatcher.js"

export function changeTitle(title){
	dispatcher.dispatch({
		type: "CHANGE_TITLE",
		title,
	});
}
