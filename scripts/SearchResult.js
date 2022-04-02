import * as util from "./utility.js"

export default class SearchResult{
    constructor(resultsList){
        this.resultsList = resultsList;
    }

    renderResults = (profiles, userInput) => {
        util.clearHTML(resultsList) //override prev search
        if (!profiles) return; // in case searchbar is empty 
        if(profiles.length > 0){
            for(const profile of profiles){
                let resultItem       = document.createElement("li");
                resultItem.innerHTML = `<div class="list-item-container">
                                            <a class="companyName" href="./company.html?symbol=${profile.symbol}">${profile.profile.companyName}</a>
                                            <span class="symbol">${profile.symbol}</span>
                                            <span class="price-change ${profile.profile.changesPercentage > 0 ? "positive": "negative"}">(${util.prettyFloat(profile.profile.changesPercentage)}%)</span>
                                            <div class="list-image-container"><img class="list-image hidden" src="${profile.profile.image}" alt="logo" onload=this.classList.remove("hidden")></div>
                                        </div>`;
                this.resultsList.appendChild(resultItem);
            }

            this.#mark(document.getElementsByClassName("companyName"),userInput);
            this.#mark(document.getElementsByClassName("symbol"),userInput);
        }else { // no results
            const noResults          = document.createElement("li");
            noResults.style.fontSize = "3rem";
            noResults.innerHTML      = "Sorry but couldn't find any results... :'("
            this.resultsList.appendChild(noResults);
        }   
    }

    #mark = (elements, text) => {
        const regex = new RegExp(text, "ig") //case-insensitive & global replace 
        for(const element of elements){
            text = element.innerHTML.match(regex);
            if(text)
                element.innerHTML = element.innerHTML.replace(regex, '<mark>' + text[0] + '</mark>')
        }
    }
}