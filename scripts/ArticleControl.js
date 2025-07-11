/**
 * @file A custom element to format an article
 * @author Vera Konigin vera@groundedwren.com
 */
 
window.GW = window.GW || {};
(function Controls(ns) {
	ns.ArticleEl = class ArticleEl extends HTMLElement {
		static InstanceCount = 0; // Global count of instances created
		static InstanceMap = {}; // Dynamic map of IDs to instances of the element currently attached

		//Element name
		static Name = "gw-article";
		// Element CSS rules
		static Style = `${ArticleEl.Name} {
			display: block;
			container-type: inline-size;

			* {
				box-sizing: border-box;
			}

			> div {
				display: grid;
				grid-template-columns: minmax(200px, 300px) minmax(600px, 1fr);
				align-items: start;

				@container (max-width: 800px) {
					grid-template-columns: 100%;
					grid-template-rows: auto auto;
				}

				> *:first-child {
					position: sticky;
					top: 5px;
					padding-inline: 5px;
					margin-block-start: 5px;
					background-color: var(--background-color, #FFFFFF);
					margin-inline: 5px;

					@container (min-width: 800px) {
						max-height: calc(100vh - 5px);
						overflow-y: auto;
					}

					@container (max-width: 800px) {
						position: static;
						max-width: 350px;
						width: 100%;
						margin-inline: auto;
					}

					div:has(h1, h2, h3, h4, h5, h6 ){
						background-color: var(--accent-color, #d5b3d9);
						margin-inline: -5px;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: baseline;
						gap: 4px;

						h1, h2, h3, h4, h5, h6 {
							margin-block: 0;
							text-align: center;
						}
						svg {
							width: 16px;
							height: 16px;
							fill: var(--icon-color);
						}
					}

					ol {
						padding-inline-start: 20px;
					}

					li {
						margin-block: 15px;
					}

					.item-container {
						display: grid;
						grid-template-columns: minmax(auto, max-content) 0fr 0fr;

						.icon {
							display: none;
							width: 1ch;
							height: 1lh;
							padding-inline: 12px;
							cursor: pointer;

							svg {
								width: inherit;
								height: inherit;
								fill: var(--icon-color, ##000000);
							}
						}

						&:has([aria-expanded="true"]) {
							.icon.minus {
								display: inline-block;
							}
						}
						&:has([aria-expanded="false"]) {
							.icon.plus {
								display: inline-block;
							}
							+ [role="group"] {
								display: none;
							}
						}
					}
				}

				> *:nth-child(2) {
					container-type: inline-size;
					
					display: flex;
					flex-direction: column;
					gap: 5px;

					width: 100%;
					max-width: 1100px;
					margin-inline: auto;

					h1, h2, h3, h4, h5, h6 {
						background-color: var(--accent-color, #d5b3d9);
						margin: 0;
						padding-inline: 3px;
					}
					h3 {
						margin-inline-start: 1ch;
					}
					h4 {
						background-color: color-mix(in hsl, var(--accent-color, #d5b3d9), transparent 25%);
						margin-inline-start: 2ch;
					}
					h5 {
						background-color: color-mix(in hsl, var(--accent-color, #d5b3d9), transparent 40%);
						margin-inline-start: 3ch;
					}
					h6 {
						background-color: transparent;
						margin-inline-start: 5ch;
					}

					article {
						position: relative;
						z-index: 1;
						width: 100%;

						background-color: var(--background-color);

						&.scroll-anchor {
							position: absolute;
							top: 0px;
						}

						+ article, article:first-of-type {
							&::before {
								content: "";
								display: block;
								height: 15px;
							}
							
							&.scroll-anchor {
								top: 15px;
							}
						}
						+ article::before {
							background-color: var(--background-color, #FFFFFF);
						}

						&:has(> article + *:not(article)) {
							> article {
								position: relative;
								margin-inline-start: 4px;

								&::after {
									content: "";
									position: absolute;
									top: 15px;
									left: -4px;
									height: calc(100% - 15px);
									border-inline-start: 4px solid var(--accent-color, #d5b3d9);
								}
							}
						}

						.content {
							padding-inline: 4px;
							width: 100%;
							overflow-x: auto;

							&:first-of-type > p:first-of-type {
								margin-block-start: 0;
							}
							> p:last-of-type {
								margin-block-end: 0;
							}
							&:last-of-type {
								> *:last-child {
									margin-block-end: 0 !important;
								}
							}
						}

						> hgroup {
							display: flex;
							flex-direction: row;
							gap: 5px;

							min-height: 2.5em;
							margin-inline-start: 1px;

							position: sticky;
							top: 0;
							z-index: 1;

							h1, h2, h3, h4, h5, h6, p {
								display: flex;
								align-items: center;
								margin-block: 0;
							}

							&::before, &::after {
								content: "";
								background-color: var(--background-color, #FFFFFF);
								display: block;
								height: 100%;
								width: 100%;
								position: absolute;
								z-index: -2;
							}
							&::before {
								background-color: var(--background-color, #FFFFFF);
								z-index: -2;
							}
							&::after {
								background: linear-gradient(to right, color-mix(in hsl, var(--accent-color, #d5b3d9), transparent 70%), transparent);
								z-index: -1;
							}

							p:is(.h-link, .nav-links) {
								opacity: 0;

								a svg path {
									fill: var(--link-color, #0000EE);
								}
							}
							p.h-link {
								a {
									display: flex;

									background-color: var(--link-background-color, #BDE0F2);
									border-radius: 20px;
									padding: 4px;
									svg {
										height: 24px;
										width: 24px;
									}
									@container (max-width: 500px) {
										padding: 2px;
									}
								}
							}
							p.nav-links {
								flex-grow: 1;
								gap: 4px;
								justify-content: flex-end;
								a {
									background-color: var(--link-background-color, #BDE0F2);
									border-radius: 20px;
									padding: 4px;

									[role="img"] {
										display: flex;
										flex-direction: column;
										
										svg {
											width: 16px;
											height: 16px;

											+ svg {
												margin-block-start: -10px;
											}
										}
									}
								}
								
								@container (max-width: 500px) {
									gap: 2px;
									a:is([aria-labelledby$="spnPrevLnkLbl"], [aria-labelledby$="spnNextLnkLbl"]) {
										display: none;
									}
								}
							}
							p:not(.h-link, .nav-links) {
								font-style: italic;
							}
						}
						&:hover {
							&:not(:has(article:hover)) {
								> hgroup p:is(.h-link, .nav-links) {
									opacity: 1;
								}
							}
						}
						&:focus-within {
							&:not(:has(article:focus-within)) {
								> hgroup p:is(.h-link, .nav-links) {
									opacity: 1;
								}
							}
						}
					}
				}
			}
		}
		@media(hover: none) {
			${ArticleEl.Name} {
				p:is(.h-link, .nav-links) {
					opacity: 1 !important;
				}
			}
		}`;

		static PlusSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>`;
		static MinusSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>`;
		static LinkSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>`;
		static UpSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>`;
		static DownSvgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`;

		static UpOneIconMakrup = `<span role="img">${ArticleEl.UpSvgMarkup}</span>`;
		static UpAllIconMakrup = `<span role="img">${ArticleEl.UpSvgMarkup}${ArticleEl.UpSvgMarkup}</span>`;
		static DownOneIconMakrup = `<span role="img">${ArticleEl.DownSvgMarkup}</span>`;
		static DownAllIconMakrup = `<span role="img">${ArticleEl.DownSvgMarkup}${ArticleEl.DownSvgMarkup}</span>`;

		InstanceId; // Identifier for this instance of the element
		IsInitialized; // Whether the element has rendered its content
		ArticleIter = 0;

		LayoutEl; //Layout element
		NavEl; //Navigation element
		ContentEl; //Container of article content

		//Type-ahead
		KeyMap = {};
		CurKeySequence = [];
		LastKeyTimestamp = new Date(-8640000000000000); //Earliest representable date

		/** Creates an instance */
		constructor() {
			super();
			if(!this.getId) {
				// We're not initialized correctly. Attempting to fix:
				Object.setPrototypeOf(this, customElements.get(ArticleEl.Name).prototype);
			}
			this.InstanceId = ArticleEl.InstanceCount++;
		}

		/** Shortcut for the root node of the element */
		get Root() {
			return this.getRootNode();
		}
		/** Looks up the <head> element (or a fascimile thereof in the shadow DOM) for the element's root */
		get Head() {
			if(this.Root.head) {
				return this.Root.head;
			}
			if(this.Root.getElementById("gw-head")) {
				return this.Root.getElementById("gw-head");
			}
			const head = document.createElement("div");
			head.setAttribute("id", "gw-head");
			this.Root.prepend(head);
			return head;
		}

		/**
		 * Generates a globally unique ID for a key unique to the custom element instance
		 * @param {String} key Unique key within the custom element
		 * @returns A globally unique ID
		 */
		getId(key) {
			return `${ArticleEl.Name}-${this.InstanceId}-${key}`;
		}
		/**
		 * Finds an element within the custom element created with an ID from getId
		 * @param {String} key Unique key within the custom element
		 * @param {HTMLElement | undefined} elem Element from which to query
		 * @returns The element associated with the key
		 */
		getRef(key, elem) {
			return (elem || this).querySelector(`#${CSS.escape(this.getId(key))}`);
		}

		/** Handler invoked when the element is attached to the page */
		connectedCallback() {
			this.onAttached();
		}
		/** Handler invoked when the element is moved to a new document via adoptNode() */
		adoptedCallback() {
			this.onAttached();
		}
		/** Handler invoked when the element is disconnected from the document */
		disconnectedCallback() {
			delete ArticleEl.InstanceMap[this.InstanceId];
		}

		/** Performs setup when the element has been sited */
		onAttached() {
			if(!this.Root.querySelector(`style.${ArticleEl.Name}`)) {
				this.Head.insertAdjacentHTML(
					"beforeend",
					`<style class=${ArticleEl.Name}>${ArticleEl.Style}</style>`
				);
			}

			ArticleEl.InstanceMap[this.InstanceId] = this;
			if(!this.IsInitialized) {
				if(document.readyState === "loading") {
					document.addEventListener("DOMContentLoaded", this.renderContent);
				}
				else {
					this.renderContent();
				}
			}
		}

		/** Handler invoked when the element ready to render */
		renderContent = () => {
			this.LayoutEl = this.#createElement("div");

			this.ContentEl = this.firstElementChild;
			this.ContentEl.id = this.ContentEl.id || this.getId("content");

			const articleStack = this.#getArticleEntries(this.ContentEl);
			const navHTag = articleStack[0].Heading.nodeName.toLowerCase();
			this.LayoutEl.insertAdjacentHTML("afterbegin",
				`<nav id="${this.getId("nav")}" aria-labelledby="${this.getId("hContents")}">
					<span id="${this.getId("spnHLnkLbl")}" style="display: none;">page heading</span>
					<span id="${this.getId("spnPrevLnkLbl")}" style="display: none;">previous heading</span>
					<span id="${this.getId("spnFirstLnkLbl")}" style="display: none;">first heading</span>
					<span id="${this.getId("spnNextLnkLbl")}" style="display: none;">next heading</span>
					<span id="${this.getId("spnLastLnkLbl")}" style="display: none;">last heading</span>
					<div>
						<${navHTag} id="${this.getId("hContents")}">Contents</${navHTag}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
							<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
							<title>Tree View</title>
							<path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v96V384c0 35.3 28.7 64 64 64H256V384H64V160H256V96H64V32zM288 192c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V192zm0 288c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V480z"/>
						</svg>
					</div>
				</nav>`
			);
			this.NavEl = this.LayoutEl.querySelector("nav");

			const treeRoot = this.#createElement("ol", {
				"role": "tree",
				"aria-orientation": "vertical",
				"aria-multiselectable": "false",
				"aria-labelledby": this.getId("hContents"),
			});
			treeRoot.addEventListener("keydown", this.onTreeKeydown);

			this.KeyMap = {};
			
			let currentLevel = 0;
			let currentParent = treeRoot;
			let currentNode = null;
			let articleEntry = null;
			let prevArticleEntry = null;
			const firstArticleEntry = articleStack[0];
			while(articleStack.length) {
				prevArticleEntry = articleEntry;
				articleEntry = articleStack.shift();
				currentLevel = currentLevel || articleEntry.Level;

				articleEntry.Heading.id = articleEntry.Heading.id || this.#createIdForElem(articleEntry.Heading);
				articleEntry.Heading.setAttribute("tabindex", "-1");
				articleEntry.Element.setAttribute("aria-labelledby", articleEntry.Heading.id);

				if(prevArticleEntry) {
					prevArticleEntry.Element.querySelector(`.nav-links`).insertAdjacentHTML("afterbegin", `
						<a
							aria-labelledby="${this.getId("spnNextLnkLbl")}"
							href="#${articleEntry.Heading.id}"
						>${ArticleEl.DownOneIconMakrup}
						</a>
					`);
				}

				//hGroup
				const hParent = articleEntry.Heading.parentElement;
				let hGroup = null;
				if(articleEntry.Heading.parentElement.nodeName !== "HGROUP") {
					hGroup = this.#createElement("hgroup")
					hGroup.append(articleEntry.Heading);
					hParent.prepend(hGroup);
				}
				else {
					hGroup = hParent;
				}

				//scroll-anchor
				articleEntry.Element.insertAdjacentHTML("afterbegin", `<span class="scroll-anchor"></span>`);
				articleEntry.Heading.addEventListener("focusin", this.#createDelegate(this, (articleEntry) => {
					articleEntry.Element.querySelector(`:scope > .scroll-anchor`).scrollIntoView(true);
				}, [articleEntry]));

				//h-link
				const linkKey = `a-${articleEntry.Heading.id}`;
				articleEntry.Heading.insertAdjacentHTML("afterend",
					`<p class="h-link">
						<a id=${this.getId(linkKey)}
							href="#${articleEntry.Heading.id}"
							aria-labelledby="${articleEntry.Heading.id} ${this.getId("spnHLnkLbl")}"
						>
							${ArticleEl.LinkSvgMarkup}
						</a>
					</p>`
				);
				this.getRef(linkKey).addEventListener("click", this.#createDelegate(this, (articleEntry) => {
					navigator.clipboard.writeText(
						`${window.location.origin}${window.location.pathname}#${articleEntry.Heading.id}`
					);
					GW.Controls.Toaster?.showToast("Copied to clipboard");
				}, [articleEntry]));
				
				//nav-links
				hGroup.insertAdjacentHTML("beforeend",
					`<p class="nav-links">
						${prevArticleEntry
							? `
								<a
									aria-labelledby="${this.getId("spnPrevLnkLbl")}"
									href="#${prevArticleEntry.Heading.id}"
								>${ArticleEl.UpOneIconMakrup}
								</a>
								<a
									aria-labelledby="${this.getId("spnFirstLnkLbl")}"
									href="#${firstArticleEntry.Heading.id}"
								>${ArticleEl.UpAllIconMakrup}
								</a>`
							: ""
						}
					</p>`
				);

				//Treenav
				const node = this.#createElement("li", {"role": "none"});
				node.insertAdjacentHTML("afterbegin",
					`<span class="item-container">
						<a id="${this.getId(`a-${articleEntry.Heading.id}`)}"
							href="#${articleEntry.Heading.id}"
							role="treeitem"
							tabindex="${currentNode ? "-1": "0"}"
						>
							${articleEntry.Heading.innerText}
						</a>
					</span>`
				);

				this.#addToKeyMap(
					articleEntry.Heading.innerText.trim().toLowerCase(),
					node.querySelector(`[role="treeitem"]`)
				);

				if (currentLevel > articleEntry.Level) {
					for(let i = 0; i < (currentLevel - articleEntry.Level); i++) {
						currentParent = currentParent.parentElement.parentElement;
					}
				}
				else if (currentLevel < articleEntry.Level){
					currentParent = this.#createElement("ol", {
						"role": "group",
						"aria-labelledby": this.getId(`a-${prevArticleEntry.Heading.id}`)
					});
					currentNode.append(currentParent);

					const plusIcon = this.#createElement("span", {
						"aria-hidden": "true",
						"class": "icon plus",
					});
					plusIcon.addEventListener("click", this.onIconClick);
					plusIcon.innerHTML = ArticleEl.PlusSvgMarkup;
					const minusIcon = this.#createElement("span", {
						"aria-hidden": "true",
						"class": "icon minus",
					});
					minusIcon.innerHTML = ArticleEl.MinusSvgMarkup;
					minusIcon.addEventListener("click", this.onIconClick);

					const treeItem = currentNode.querySelector(`[role="treeitem"]`);
					treeItem.parentElement.append(plusIcon, minusIcon);
					treeItem.setAttribute("aria-expanded", "false");
				}
				currentLevel = articleEntry.Level;
				currentNode = node;
				currentParent.append(currentNode);
				articleStack.unshift(...this.#getArticleEntries(articleEntry.Element));

				//Article formatting
				let contentElement = null;
				let lastElement = null;
				[...articleEntry.Element.children].forEach(childElement => {
					if(!childElement.matches(`hgroup, article, .scroll-anchor`)) {
						if(!contentElement) {
							contentElement = this.#createElement("div", {"class": "content"});
							if(lastElement) {
								lastElement.insertAdjacentElement("afterend", contentElement);
							}
							else {
								articleEntry.Element.append(contentElement);
							}
							lastElement = contentElement;
						}
						contentElement.append(childElement);
					}
					else {
						if(lastElement) {
							lastElement.insertAdjacentElement("afterend", childElement);
						}
						else {
							articleEntry.Element.append(childElement);
						}
						lastElement = childElement;
						contentElement = null;
					}
				});
			}
			const allNavs = Array.from(this.ContentEl.querySelectorAll(`.nav-links`));
			allNavs.pop();
			allNavs.forEach(nav => {
				nav.insertAdjacentHTML("afterbegin", `
					<a
						aria-labelledby="${this.getId("spnLastLnkLbl")}"
						href="#${articleEntry.Heading.id}"
					>${ArticleEl.DownAllIconMakrup}
					</a>
				`);
			});
			
			this.NavEl.append(treeRoot);

			this.LayoutEl.append(this.NavEl, this.ContentEl);
			this.append(this.LayoutEl);
			this.IsInitialized = true;
		};

		#getArticleEntries(parentEl) {
			const articles = [...parentEl.querySelectorAll(
				`#${CSS.escape(parentEl.id)} > article:has(h1, h2, h3, h4, h5, h6)`
			)];
			return articles.map(articleEl => {
				articleEl.id = articleEl.id || this.getId(`article-${this.ArticleIter++}`);
				const headingEl = articleEl.querySelector(`h1, h2, h3, h4, h5, h6`);
				return {
					Element: articleEl,
					Heading: headingEl,
					Level: parseInt(headingEl.nodeName[1])
				};
			});
		}

		#createElement(tag, attrs) {
			const elem = document.createElement(tag);
			Object.entries(attrs || {}).forEach(
				([attribute, value]) => elem.setAttribute(attribute, value)
			);
			return elem;
		}

		#createIdForElem(elem) {
			let textId = elem.innerText.replaceAll(" ", "_");

			let uniqIter = "";
			while(document.getElementById(`${textId}${uniqIter}`)) {
				uniqIter = (uniqIter || 0) + 1;
			}
			return `${textId}${uniqIter}`;
		}

		#addToKeyMap(text, treeItem) {
			let currentLevel = this.KeyMap;
			text.split("").forEach(character => {
				currentLevel[character] = currentLevel[character] || {};
				currentLevel = currentLevel[character];
				(currentLevel.ItemAry = currentLevel.ItemAry || []).push(treeItem);
			});
		}

		/** Handles tree navigation */
		onTreeKeydown = (event) => {
			if(event.target.getAttribute("role") !== "treeitem") {
				return;
			}
			const treeItem = event.target;
			const homeLi = event.target.parentElement.parentElement;

			let newTreeItem = null;
			switch(event.key) {
				case "ArrowUp":
					newTreeItem = this.#getPrevTreeItem(homeLi);
					break;
				case "ArrowDown":
					if(treeItem.getAttribute("aria-expanded") === "true") {
						newTreeItem = homeLi.querySelector(`[role="group"]`).querySelector(`[role="treeitem"]`);
					}
					else {
						newTreeItem = this.#getNextTreeItem(homeLi);
					}
					break;
				case "ArrowLeft":
					if(treeItem.getAttribute("aria-expanded") === "true") {
						treeItem.setAttribute("aria-expanded", "false");
					}
					else {
						const grandparentLi = homeLi.parentElement?.parentElement;
						if(grandparentLi && grandparentLi.nodeName === "LI") {
							newTreeItem = grandparentLi.querySelector(`[role="treeitem"]`);
						}
					}
					break;
				case "ArrowRight":
					if(treeItem.getAttribute("aria-expanded") === "true") {
						newTreeItem = homeLi.querySelector(`[role="group"]`).querySelector(`[role="treeitem"]`);
					}
					else if(treeItem.hasAttribute("aria-expanded")) {
						treeItem.setAttribute("aria-expanded", "true");
					}
					break;
				case "Home":
					newTreeItem = this.#getFirstTreeItem(this.NavEl);
					break;
				case "End":
					newTreeItem = this.#getLastTreeItem(this.NavEl);
					break;
				default:
					newTreeItem = this.#getFirstMatch(event.key.toLowerCase());
					break;
			}
			if(!newTreeItem) { return; }

			document.querySelectorAll(`li:has(#${CSS.escape(newTreeItem.id)})`).forEach(li => {
				const treeItem = li.querySelector(`[role="treeitem"]`);
				if(treeItem !== newTreeItem && treeItem.getAttribute("aria-expanded") === "false") {
					treeItem.setAttribute("aria-expanded", "true");
				}
			});

			treeItem.setAttribute("tabindex", "-1");
			newTreeItem.setAttribute("tabindex", "0");
			newTreeItem.focus();
			event.preventDefault();
		};

		#getNextTreeItem(liElement) {
			const siblingLi = liElement.nextElementSibling;
			if(siblingLi) {
				return siblingLi.querySelector(`[role="treeitem"]`);
			}
			else {
				const parentLi = liElement.parentElement.parentElement;
				if(parentLi) {
					return this.#getNextTreeItem(parentLi);
				}
			}
			return null;
		}
		#getPrevTreeItem(liElement) {
			const siblingLi = liElement.previousElementSibling;
			if(siblingLi) {
				return this.#getLastTreeItem(siblingLi);
			}
			else {
				const parentLi = liElement.parentElement.parentElement;
				if(parentLi) {
					return parentLi.querySelector(`[role="treeitem"]`);
				}
			}
			return null;
		}

		#getFirstTreeItem(parentElement) {
			return [...parentElement.querySelectorAll(`[role="treeitem"]`)].filter(
				treeItem => treeItem.checkVisibility()
			).shift();
		}
		#getLastTreeItem(parentElement) {
			return [...parentElement.querySelectorAll(`[role="treeitem"]`)].filter(
				treeItem => treeItem.checkVisibility()
			).pop();
		}

		#getFirstMatch(key) {
			const keyTimestamp = new Date();
			if(keyTimestamp - this.LastKeyTimestamp > ArticleEl.ResetMs) {
				this.CurKeySequence = [];
			}
			this.LastKeyTimestamp = keyTimestamp;

			this.CurKeySequence.push(key);

			let sequenceObj = this.KeyMap;
			this.CurKeySequence.forEach(key => sequenceObj = sequenceObj[key] || {});

			if(!sequenceObj.ItemAry) {
				if(this.KeyMap[key]?.ItemAry) {
					this.CurKeySequence = [key];
					sequenceObj = this.KeyMap[key];
				}
				else {
					this.CurKeySequence = [];
					return null;
				}
			}

			return sequenceObj.ItemAry[0];
		}

		onIconClick = (event) => {
			event.stopPropagation();
			const treeItem = event.currentTarget.parentElement.querySelector(`[role="treeitem"]`);

			treeItem.setAttribute(
				"aria-expanded",
				treeItem.getAttribute("aria-expanded") === "true" ? "false" : "true"
			);
		};

		#createDelegate = function(context, method, args) {
			return function generatedFunction() {
				return method.apply(context, (args || []).concat(...arguments));
			}
		}
	}
	if(!customElements.get(ns.ArticleEl.Name)) {
		customElements.define(ns.ArticleEl.Name, ns.ArticleEl);
	}
}) (window.GW.Controls = window.GW.Controls || {});
GW?.Controls?.Veil?.clearDefer("GW.Controls.ArticleEl");