import * as util from "./utility.js"

export default class Search{
    constructor(container){
        this.container     = container;
        this.urlParams     = new URLSearchParams(window.location.search);
        this.profiles      = [];
        this.renderResults = undefined //initialized with onSearch()

        this.container.onkeydown = util.debounce(() => this.#search(this.container.value), 500);
    }

    onSearch = (renderResults) => {
        this.renderResults = renderResults;

        if(this.urlParams.has('query')){
            this.container.value = this.urlParams.get('query');
            this.#search(this.container.value);
        }
    }

    #search = async userInput => {
        if(userInput){
            const loadingInterval = this.#setLoadingMode(true);
            const profiles = await this.#getCompanies(userInput);
            this.#setLoadingMode(false, loadingInterval);
            this.renderResults(profiles, userInput);
            this.urlParams.set('query', userInput);
            window.history.replaceState( null, "", `?${this.urlParams}`);
        }else{
            this.renderResults(); // just to clear previous search results
            window.history.replaceState( null, "", window.location.pathname); //removes queries from url
        }
    }

    #getCompanies = userInput => {
        const companyProfileUrl = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/";
        return new Promise(async (resolve,reject) => {
            const searchResults = await util.getData(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`);
            if(searchResults){
                const symbols = searchResults.map(company => company.symbol);
                const profilePromiseList = [];
                for(let i = 0; i < symbols.length; i+=3){
                    profilePromiseList.push(util.getData(companyProfileUrl + symbols.slice(i,i+3).join()))
                }
                this.profiles = await Promise.all(profilePromiseList);
                this.profiles = this.profiles.map(resultsObj => resultsObj.companyProfiles ? resultsObj.companyProfiles:resultsObj).flat();
            }
            resolve(this.profiles);
        })
    }

    #setLoadingMode = (state, interval) => {
        if(state){
            return setInterval(() => {
                const color = searchInput.style.borderBottomColor;
                searchInput.style.borderBottomColor = (color === "grey") ? "green" : "grey"; 
            }, 100);
        }
        clearInterval(interval);
        searchInput.style.borderBottomColor = null;
    }
}