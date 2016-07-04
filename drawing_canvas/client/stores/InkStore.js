import { EventEmitter } from "events";

class InkStore extends EventEmitter{
	constructor(){
		super();
	}

	getColour(){
		return this.colour;
	}

	setColour(colour){
		this.colour = colour;
		this.emit("change");
	}

}

const inkStore = new InkStore;
window.inkStore = inkStore;
export default inkStore;