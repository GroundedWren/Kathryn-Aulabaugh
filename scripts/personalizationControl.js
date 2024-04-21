function registerNamespace(path, nsFunc)
{
  var ancestors = path.split(".");
  
  var ns = window;
  for(var i = 0; i < ancestors.length; i++)
  {
    ns[ancestors[i]] = ns[ancestors[i]] || {};
    ns = ns[ancestors[i]];
  }
  nsFunc(ns);
}

registerNamespace("GW.Controls", function(ns)
{
  ns.PersonalizationEl = class PersonalizationEl extends HTMLElement
  {
    //#region staticProperties
    static observedAttributes = [];
    static instanceCount = 0;
    static instanceMap = {};
    //#endregion
    
    //#region instance properties
    instanceId;
    identifier;
    scopeEl;
    
    currentTheme = "theme-light";
    currentFontSize = "font-normal";
    currentFontFamily = "font-segoe-ui";
    
    //#region element properties
    lightThemeBtn;
    darkThemeBtn;
    fontSizeSel;
    fontFamilySel;
    //#endregion
    //#endregion
    
    constructor()
    {
      super();
      this.instanceId = PersonalizationEl.instanceCount++;
    }
    
    //#region HTMLElement implementation
    connectedCallback()
    {
      this.scopeEl = this.hasAttribute("scope")
        ? document.getElementById(this.getAttribute("scope"))
        : document.documentElement;
        
      this.identifier = this.getAttribute("identifier");
      PersonalizationEl.instanceMap[this.identifier] = PersonalizationEl.instanceMap[this.identifier] || [];
      PersonalizationEl.instanceMap[this.identifier].push(this);
      
      this.themeKey = `gw-theme-${this.getAttribute("identifier") || ""}`;
      this.fontSizeKey = `gw-fontSize-${this.getAttribute("identifier") || ""}`;
      this.fontFamilyKey = `gw-fontFamily-${this.getAttribute("identifier") || ""}`;
      
      this.renderContent();
      
      this.setTheme(localStorage.getItem(this.themeKey));
      this.setFontSize(localStorage.getItem(this.fontSizeKey));
      this.setFontFamily(localStorage.getItem(this.fontFamilyKey));
      
      this.registerHandlers();
    }
    
    disconnectedCallback()
    {
    }
    
    adoptedCallback()
    {
    }
    
    attributeChangedCallback(name, oldValue, newValue)
    {
    }
    //#endregion
    
    setTheme(thName)
    {
      this.scopeEl.classList.remove(this.currentTheme);
      this.currentTheme = thName || this.currentTheme;
      this.scopeEl.classList.add(this.currentTheme);
      localStorage.setItem(this.themeKey, this.currentTheme);
      
      this.lightThemeBtn.setAttribute("aria-pressed", this.currentTheme === "theme-light");
      this.darkThemeBtn.setAttribute("aria-pressed", this.currentTheme === "theme-dark");
    }
    
    setFontSize(fontSize)
    {
      this.scopeEl.classList.remove(this.currentFontSize);
      this.currentFontSize = fontSize || this.currentFontSize;
      this.scopeEl.classList.add(this.currentFontSize);
      localStorage.setItem(this.fontSizeKey, this.currentFontSize);
      
      this.fontSizeSel.value = this.currentFontSize;
    }
    
    setFontFamily(fontFamily)
    {
      this.scopeEl.classList.remove(this.currentFontFamily);
      this.currentFontFamily = fontFamily || this.currentFontFamily;
      this.scopeEl.classList.add(this.currentFontFamily);
      localStorage.setItem(this.fontFamilyKey, this.currentFontFamily);
      
      this.fontFamilySel.value = this.currentFontFamily;
    }
    
    renderContent()
    {
      const shadow = this.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <style>
          article {
            display: flex;
            flex-direction: column;
            gap: 2px;
            width: fit-content;
          }
          
          #sChangeWarn-${this.instanceId} {
            font-size: 0.8em;
            font-style: italic;
            text-align: center;
          }
          
          #fieldsetContainer-${this.instanceId} {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }
          
          article fieldset {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
          }
          
          .input-vertical-line {
            display: flex;
            flex-direction: column;
            width: 100%;
            justify-content: flex-start;
            align-items: flex-start;
            margin-bottom: 6px;
          }
          
          button, select
          {
            background-color: var(--button-face-color, #DEDEDE);
            color: var(--button-text-color, #000000);
            border: 1px solid var(--link-color, #0000EE);
            cursor: pointer;
            min-width: 30px;
            min-height: 30px;
          }
          
          button[aria-expanded="true"], button[aria-pressed="true"] {
            background-color: var(--selected-color, #90CBDB);
            font-weight: bold;
            font-style: italic;
          }
          
          :focus-visible, *[tabindex="-1"]:focus {
            outline-width: 4px;
            outline-color: var(--focus-color, #FF0701);
            outline-style: solid;
            outline-offset: 1px;
            position: relative;
            z-index: 100;
          }
        </style>
        
        <article
          id="personalizationControl-${this.instanceId}"
          class="personalization-control"
          aria-label="personalization"
          aria-describedby="sChangeWarn-${this.instanceId}"
          role="region"
        >
          <span id="sChangeWarn-${this.instanceId}">Changes apply immediately</span>
          <div id="fieldsetContainer-${this.instanceId}">
            <fieldset id="fontFieldset-${this.instanceId}">
              <legend id="fontLegend-${this.instanceId}">Font</legend>
              <div class="input-vertical-line">
                <label for="selFontSizeSetting-${this.instanceId}">Size</label>
                <select id="selFontSizeSetting-${this.instanceId}">
                  <option value="font-small" selected>Small</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-large">Large</option>
                </select>
              </div>
              <div class="input-vertical-line">
                <label for="selFontFamilySetting-${this.instanceId}">Family</label>
                <select id="selFontFamilySetting-${this.instanceId}">
                  <option value="font-segoe-ui" selected>Segoe UI</option>
                  <option value="font-arial">Arial</option>
                  <option value="font-verdana">Verdana</option>
                  <option value="font-tahoma">Tahoma</option>
                  <option value="font-trebuchet-ms">Trebuchet MS</option>
                  <option value="font-times-new-roman">Times New Roman</option>
                  <option value="font-georgia">Georgia</option>
                  <option value="font-garamond">Garamond</option>
                  <option value="font-courier-new">Courier New</option>
                  <option value="font-brush-script-mt">Brush Script MT</option>
                </select>
              </div>
            </fieldset>
            <fieldset id="themeFieldset-${this.instanceId}">
              <legend>Theme</legend>
              <button id="lightThemeSettingButton-${this.instanceId}" aria-pressed="false">Light</button>
              <button id="darkThemeSettingButton${this.instanceId}" aria-pressed="false">Dark</button>
            </fieldset>
          </div>
        </article>
      `;
      
      this.lightThemeBtn = shadow.getElementById(`lightThemeSettingButton-${this.instanceId}`);
      this.darkThemeBtn = shadow.getElementById(`darkThemeSettingButton${this.instanceId}`);
      this.fontSizeSel = shadow.getElementById(`selFontSizeSetting-${this.instanceId}`);
      this.fontFamilySel = shadow.getElementById(`selFontFamilySetting-${this.instanceId}`);
    }
    
    //#region Handlers
    registerHandlers()
    {
      this.lightThemeBtn.addEventListener("click", this.onLightThemePressed);
      this.darkThemeBtn.addEventListener("click", this.onDarkThemePressed);
      this.fontSizeSel.addEventListener("change", this.onFontSizeChange);
      this.fontFamilySel.addEventListener("change", this.onFontFamilyChange);
    }
    
    onLightThemePressed = (event) =>
    {
      PersonalizationEl.instanceMap[this.identifier].forEach(instance => instance.setTheme("theme-light"));
    };
    onDarkThemePressed = (event) =>
    {
      PersonalizationEl.instanceMap[this.identifier].forEach(instance => instance.setTheme("theme-dark"));
    };
    onFontSizeChange = (event) =>
    {
      PersonalizationEl.instanceMap[this.identifier].forEach(instance => instance.setFontSize(this.fontSizeSel.value));
    };
    onFontFamilyChange = (event) =>
    {
      PersonalizationEl.instanceMap[this.identifier].forEach(instance => instance.setFontFamily(this.fontFamilySel.value));
    };
    //#endregion
  };
  customElements.define("gw-personalization", ns.PersonalizationEl);
});