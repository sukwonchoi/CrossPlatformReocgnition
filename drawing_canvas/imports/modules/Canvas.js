  


  export function clearCanvas(){
    console.log(this.clickX + " " + this.clickY);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    alert(window.pdollar.Recognize(pointArray).Name + " Score: " + window.pdollar.Recognize(pointArray).Score);
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;
  }
