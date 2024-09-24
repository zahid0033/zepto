class PredictiveSearch extends HTMLElement {
	constructor() {
		super();
		this.cachedResults = {};
		this.search_term = "";
		this.isOpen = false;
		this.abortController = new AbortController();
		this.all_predictive_search_results = this.querySelectorAll("predictive-search");
		this.predictive_search_results = this.querySelector("[data-predictive-search]");
		this.targetDiv = document.querySelector("#search-Modal_results");
		this.search_input = this.querySelector('input[type="search"]');
		this.reset_button = this.querySelector('button[type="reset"]');

		if (this.search_input) {
			this.search_input.addEventListener("reset", this.onFormReset.bind(this));
			this.search_input.addEventListener("input", this.onChange.bind(this));
		}
		this.setupEventListeners();
	}

	setupEventListeners() {}

	onFormReset(event) {
		event.preventDefault();
		this.search_input.value = "";
		this.search_input.dispatchEvent(new Event("input", { bubbles: true }));
	}

	onChange(event) {
		this.search_term = event.target.value;
		const new_search_term = this.getQuery();
		if (!this.search_term || new_search_term.startsWith(this.search_term)) {
			this.querySelector("#predictive-search-results_container")?.remove();
		}
		this.search_term = new_search_term;
		this.getSearchResults(this.search_term);
	}

	getQuery() {
		return this.search_input.value.trim();
	}

	async getSearchResults(search_term) {
		const queryKey = search_term.replace(" ", "-").toLowerCase();

		if (this.cachedResults[queryKey]) {
			this.displaySearchResults(this.cachedResults[queryKey]);
			return;
		}

		await fetch(`/search/suggest?q=${search_term}&section_id=predictive-search`, {
			signal: this.abortController.signal,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.text();
			})

			.then((text) => {
				const result_markup = new DOMParser().parseFromString(text, "text/html");
				const result_div = result_markup.querySelector("#predictive-search-results_container");
				console.log(result_div);
				if (result_div && result_div != null) {
					this.cachedResults[queryKey] = result_div;
					this.displaySearchResults(result_div);
				} else {
					this.cachedResults[queryKey] = null;
					this.targetDiv.querySelector("#predictive-search-results_container")?.remove();
				}
			});
	}

	displaySearchResults(result_div) {
		this.targetDiv.querySelector("#predictive-search-results_container")?.remove();
		this.targetDiv.append(result_div);

		if (!this.isOpen) {
			this.isOpen = true;
		}

		if (this.reset_button) {
			this.reset_button.disabled = false;
		}
	}
}

customElements.define("predictive-search", PredictiveSearch);
