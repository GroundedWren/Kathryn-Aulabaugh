/**
 * @file Site-wide code
 * @author Kathryn Aulabaugh kathryn-aulabaugh@gmail.com
 * https://kathryn-aulabaugh.com
 */

window.KJA = window.KJA || {};
(function Common(ns) {
	(function Controls(ns) {
		ns.HeaderEl = class HeaderEl extends HTMLElement {
			static InstanceCount = 0;
			static InstanceMap = {};
			
			InstanceId;
			IsInitialized;
			
			constructor() {
				super();
				this.InstanceId = HeaderEl.InstanceCount++;
				
				if(this.InstanceId === 0) {
					document.head.insertAdjacentHTML("beforeend", `
					<style>
						kja-header {
							display: contents;
							
							header {
								display: grid;
								grid-template-columns: 1fr 1fr 1fr;
								align-items: center;
								text-align: center;
								gap: 10px;
								padding-block-end: 10px;
								border-block-end: 1px solid color-mix(in oklab, var(--border-color), transparent 80%);
								margin-inline: 4px;

								a[href="#mainContent"]:focus-within {
									position: absolute !important;
									top: 4px;
									left: 4px;
								}
								
								h1 {
									margin-block: 0px;
								}
								
								.left, .right {
									width: fit-content;
								}
								.left {
									justify-self: flex-start;
								}
								.right {
									justify-self: flex-end;
								}
							}
							
							nav.breadcrumb {
								display: flex;
								flex-direction: row;
								flex-wrap: wrap;
								gap: 5px;
								padding: 5px;
								border-radius: 20px;
								background-color: var(--background-color);
								
								ol {
									margin: 0;
									padding: 0;
									list-style: none;
									display: flex;
									flex-direction: row;
									flex-wrap: wrap;
									
									li {
										display: inline-block;
										
										+ li::before {
											display: inline-block;
											margin-inline: 0.25em;
											transform: rotate(15deg);
											border-inline-end: 0.1em solid var(--border-color);
											height: 0.8em;
											content: "";
										}
										
										a {
											display: inline-block;
											
											&[aria-current="page"] {
												font-weight: 700;
												text-decoration: none;
											}
										}
									}
								}
							}

							svg {
								width: 16px;
								height: 16px;
								fill: var(--icon-color);
							}
							
							gw-personalization {
								position: absolute;
								z-index: 2;
								right: 0px;
								border: 2px solid var(--border-color);
								margin-inline: 6px;
								padding: 5px;
								background-color: var(--background-color);
							}
						}
					</style>`);
					
					if(!GW.Controls?.PersonalizationEl) {
						const personalizationScript = document.createElement("script");
						personalizationScript.type = "text/javascript";
						personalizationScript.src = "https://kathryn-aulabaugh.com/scripts/PersonalizationControl.js";
						document.head.appendChild(personalizationScript);
						GW.Controls?.Veil?.addDefer("GW.Controls.PersonalizationEl");
					}

					if(!GW.Controls?.PersonalizationEl) {
						const backgroundImgScript = document.createElement("script");
						backgroundImgScript.type = "text/javascript";
						backgroundImgScript.src = "https://kathryn-aulabaugh.com/scripts/BackgroundImageControl.js";
						document.head.appendChild(backgroundImgScript);
						GW.Controls?.Veil?.addDefer("GW.Controls.BackgroundImageEl");
					}
					
					if(!GW.Controls?.SearchEl) {
						const searchScript = document.createElement("script");
						searchScript.type = "text/javascript";
						searchScript.src = "https://kathryn-aulabaugh.com/scripts/SearchControl.js";
						document.head.appendChild(searchScript);
						GW.Controls?.Veil?.addDefer("GW.Controls.Search");
					}
				}
			}
			
			getId(key) {
				return `kja-header-${this.InstanceId}-${key}`;
			}
			getRef(key) {
				return document.getElementById(this.getId(key));
			}
			
			connectedCallback() {
				if(!this.IsInitialized) {
					this.renderContent();
				}
				this.IsInitialized = true;
			}
			
			renderContent() {
				document.head.insertAdjacentHTML("beforeend", `
				<style>
					@media (max-width: ${this.getAttribute("reflowWidth") || "450px"}) {
						#${this.getId("header")} {
							grid-template-columns: 1fr;
							justify-items: center;
							
							.left, .right {
								justify-self: auto;
							}
						}
					}
				</style>
				`);
				
				this.innerHTML = `
				<header id=${this.getId("header")}>
					<div class="left">
						<a class="hide-until-focus full" href="#mainContent">Skip to content</a>
						<gw-search dataKey="Site"></gw-search>
						${this.hasAttribute("crumbs")
							? `<nav aria-label="Breadcrumb" class="breadcrumb">
									<ol>
										${this.getAttribute("crumbs").split("; ").map(crumb =>
										 `<li><a class="full" href="https://kathryn-aulabaugh.com/${crumb.split("|")[0]}">${crumb.split("|")[1]}</a></li>`
										).join("")}
										<li><a class="full" href="" aria-current="page">${this.getAttribute("curCrumbTxt")}</a></li>
									</ol>
								</nav>`
							: ""
						}
					</div>
					<div>
						<h1>${this.getAttribute("h1Text")}</h1>
						${this.hasAttribute("pHTML")
							? `<p>${this.getAttribute("pHTML")}</p>`
							: ""
						}
					</div>
					<div class="right">
						<details>
							<summary>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
									<title>Personalization</title>
									<path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
								</svg>
							</summary>
							<gw-personalization id="${this.getId("psnlz")}"></gw-personalization>
						</details>
					</div>
					<gw-background-image
						id="${this.getId("bkgImg")}"
						light="theme-light"
						dark="theme-dark"

						SRC_1="https://kathryn-aulabaugh.com/img/Cosmic_Cliffs.png"
						COLOR_1="#8a6161"
						NAME_1="theme-dark"

						SRC_2="https://kathryn-aulabaugh.com/img/Lilacs.png"
						COLOR_2="#93b1c9"
						NAME_2="theme-light"
					></gw-background-image>
				</header>
				`;

				this.getRef("psnlz").addEventListener("theme-set", () => {
					this.getRef("bkgImg").setAttribute(
						"image",
						this.getRef("psnlz").currentTheme
					);
				});
			}
		};
		customElements.define("kja-header", ns.HeaderEl);
	}) (ns.Controls = ns.Controls || {});

}) (window.KJA.Common = window.KJA.Common || {}); 

window.GW = window.GW || {};
GW.Controls = GW.Controls || {};
GW.Controls.Search = GW.Controls.Search || {};
GW.Controls.Search.Data = GW.Controls.Search.Data || {};
GW.Controls.Search.Data.Site = {
	"Home": {
		URL: "https://kathryn-aulabaugh.com/index.html",
		Category: "KJA",
		Terms: ["HOME", "INDEX"],
	},
	"Resume": {
		URL: "https://kathryn-aulabaugh.com/Resume.html",
		Category: "KJA",
		Terms: ["RESUME", "BIO", "RÉSUMÉ", "CV", "CURRICULUM", "VITAE"],
	},
	"Entity Search": {
		URL: "https://kathryn-aulabaugh.com/EntitySearchReport.html",
		Category: "KJA",
		Terms: ["ENTITY", "SEARCH", "REPORT", "PAPER", "RESEARCH", "INFORMATION", "RETRIEVAL", "IR", "NLP"],
	},
	"Cats": {
		URL: "https://kathryn-aulabaugh.com/Cats.html",
		Category: "KJA",
		Terms: ["CATS", "CAT", "PET", "PHOTO", "PHOTOS", "AVI", "AVITUS", "ECHO", "SHADOW"],
	},
}