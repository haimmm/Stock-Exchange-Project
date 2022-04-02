import * as util from "./utility.js"

export default class Marquee{
  constructor(container){
    this.container  = container;
    this.marquee    = document.createElement("div");
    this.clone      = document.createElement("div");
    this.animations = [];

    this.marquee.className = "marquee";
    this.clone.className   = this.marquee.className;

    this.container.appendChild(this.marquee);
    this.container.appendChild(this.clone);

    //starting position
    this.marquee.style.left = `${this.container.offsetWidth}px`;
    this.clone.style.left   = this.marquee.style.left;
  }

  //fetch the data, then set animations
  load = async () => {
    let data = undefined;
    try{
      data = await util.getData("https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse");
    }catch(err){
      console.error(err);
    }

    const sortedDataByChange = data.sort((a,b) => a.changesPercentage - b.changesPercentage);
    this.#dataToElement(sortedDataByChange);

    this.speed      = 0.04;
    this.distance   = this.marquee.offsetWidth * 2;
    this.time       = this.distance / this.speed;
    
    const finishPosiiton = -2*this.marquee.offsetWidth + this.container.offsetWidth;
    this.animations.push(this.#setAnimation(this.marquee, finishPosiiton, this.time));
    this.animations.push(this.#setAnimation(this.clone, finishPosiiton, this.time, this.time/2));

    this.container.addEventListener('mouseenter', () => {
      this.animations.forEach(x => {x.pause()});
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.animations.forEach(x => {x.play()});
    });
  }

  #setAnimation = (element, finishPos, time, delay=0) => {
    return element.animate([
        // keyframes
        {left: `${finishPos}px`}
      ], {
        // timing options
        duration: time,
        iterations: Infinity,
        delay: delay
      })
  }

  #dataToElement = data => {
    const containerWidth = this.container.offsetWidth;
    //display 50 stocks with best and worst changes.
    for(let i = 0; i < 25; i++){
        const best = data[data.length-1-i];
        const worst = data[i];
        
        this.marquee.innerHTML +=  
          `<span class="item">${best.symbol}:<span class="positive">${util.prettyFloat(best.changesPercentage)}%</span></span>
           <span class="item">${worst.symbol}:<span class="negative">${util.prettyFloat(worst.changesPercentage)}%</span></span>`;
    }
    this.clone.innerHTML = this.marquee.innerHTML;
  }
}






