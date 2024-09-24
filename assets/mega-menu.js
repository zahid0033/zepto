class MegaMenu extends HTMLElement {
	constructor() {
		super();
		this.setUpEventListeners();
		this.mainMenus = document.querySelectorAll("mega-menu .nav_item");
        
        

	}

	setUpEventListeners() {
		this.mainMenus?.forEach((menu) => {
			menu.addEventListener("mouseenter", () => {
                //close the other menus that are open
                this.mainMenus.forEach((menu) => {
                    if (menu.classList.contains("active")) {
                        menu.classList.remove("active");
                    }
                });
                menu.classList.add("active");
			});
		});
	}

	connectedCallback() {
		this.setUpEventListeners();
	}
}

customElements.define("mega-menu", MegaMenu);
