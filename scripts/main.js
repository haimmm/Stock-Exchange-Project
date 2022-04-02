import * as util from "./utility.js"
import Search from "./Search.js"
import SearchResult from "./SearchResult.js"
import Marquee from "./Marquee.js"

const [ searchInput, resultsList, marqueeContainer ] = util.getElements("searchInput", "resultsList", "marqueeContainer");

const urlParams = new URLSearchParams(window.location.search);

const marquee = new Marquee(marqueeContainer);
marquee.load();

const searchForm = new Search(searchInput);
const results = new SearchResult(resultsList);
searchForm.onSearch((profiles,userInput) => {
    results.renderResults(profiles, userInput);
});


