import { EventEmitter } from "events";

class TitleStore extends EventEmitter{
	constructor(){
		super();
		this.title = "Tic Tac Toe";
	}

	getTitle(){
		return this.title;
	}

	setTitle(t){
		this.title = t;
		this.emit("change");
	}
}

const titleStore = new TitleStore;
window.titleStore = titleStore;
export default titleStore;