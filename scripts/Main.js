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
						
						#${this.getId("psnlz")} {
							display: contents;
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
							<summary>Personalization</summary>
							<gw-personalization id="${this.getId("psnlz")}"></gw-personalization>
						</details>
					</div>
				</header>
				`;
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