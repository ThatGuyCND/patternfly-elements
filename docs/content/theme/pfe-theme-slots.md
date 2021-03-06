+++
title = "Theming Slots"
description = ""
weight = 5
draft = false
bref = ""
toc = true
menu = "theme"
tags = [ "theme" ]
+++





## Slot basics

**Vocab tip:** Elements that can be inserted into slots are known as _slotable_; when an element has been inserted in a slot, it is said to be _slotted_.

At first glace, there seem to be lots of "gotchas" related to web components, and a *lot* of [documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots). Here’s a simplified guide with some basic code examples.


1. **Slots are places to pass content or markup into specific regions within your web component template.**


    ```
     // pfe-card.html:
     <slot name="pfe-card--header"></slot>
     <slot></slot>
     <slot name="pfe-card--footer"></slot>
    ```


2. **If you put content within a web component tag without a slot name, it will place that markup into the unnamed slot, if there is one.**

    ```
    <pfe-card>
       This would appear in the unnamed slot
    </pfe-card>
    ```

  * If there is no unnamed slot in the component, it will not render that content. For this reason, it’s perhaps a good idea to leave one unnamed slot if general markup is allowed.

  * For example, the reason we are able to style links within the CTA component is because the `<a>` tag is being passed into the only unnamed slot in the CTA component. The link tag doesn’t need an explicit attribute like `slot="link"` because if a web component has one unnamed `<slot></slot>` then anything you put inside that custom component tag will be in that slot by default. 

    ```
    <pfe-cta priority="primary">
    <a href="#">Primary</a>   <!-- this element is slotted by default -->
    </pfe-cta>
    ```


3. **The slot attribute must be applied to direct descendant of the custom tag.**

    ```
    // my-web-page.html:
    <pfe-card>
     <div>
       <h1 slot="pfe-card--header">This content will not render in the header slot of the card</h1>
     </div>
    </pfe-card>
    ```
  
    Once you nest an element inside another element in a custom tag, it can no longer be slotted. This is true of named slots and the default unnamed slot.
  
    For example, if the `pfe-cta` web component has some basic styles on all slots like this: `::slotted()  { color: red; }` Then both the div and link tag would be styled red:
  
    ```
    <pfe-cta pfe-priority="primary">
        <div>styled!</div>
        <a href="#">styled!</a>
    </pfe-cta>
    ```
    
    However, if the link tag is nested inside the div, then it would not receive styles because it’s not a direct child of the pfe-cta component anymore.
    
    ```
     <pfe-cta pfe-priority="primary">
       <div>
         <a href="#">cannot receive styles, because it’s not a direct descendant of the slot. The div is.</a>
       </div>
     </pfe-cta>
    ```

    In the template, slots cannot have the same name, however you can put multiple elements inside a slot by assigning that slot multiple times in your light DOM code.

    ```
    <pfe-demo>
        <h1 slot="foo">Bar</h1>
        <p slot="foo">Testing slots</p>
    </pfe-demo>
    ```

    Both the h1 and p tag in this example will render inside the "foo" slot of the component's template.

4. **Whenever you add the attribute `slot="foo"` in your web component template, you are prescribing *where* elements will appear in the shadow DOM template.**

    Using the pfe-card template example above, let's explore what would happen if we called the slots out of order: 

    ```
    // my-web-page.html template
    <pfe-card>
        <div slot="pfe-card--footer">World</div>
        <div slot="pfe-card--header">Hello</div>
    </pfe-card>
    ```


    will render the content like this:

    <div style="background:#eee;padding:30px;width: 250px;">
        <div>Hello</div>
        <div>World</div>
    </div>



## Styling Slots

The lines blur between shadow DOM & light DOM when slots are involved. Basically if you add the attribute `slot=" "` to a regular HTML element inside a web component, you are opening a window to allow styles from the web component to style that thing. It only applies directly to the item with the slot name on it though, nothing nested inside it. 

    ```
    <!--example-page.html-->
    <pfe-card>
        <h1 slot="pfe-card--header">
          <a>Yes!</a>
        </h1>
        <h1>
          <a slot="pfe-card--header">Nope.</a>
        </h1>
    </pfe-card>
    ```


1.   Style any slot. Probably way too general.
    
    ```
    /* my-component.scss */
    ::slotted()  {
      color: red;
    }
    ```


2.   Style any link in any slot. Still too general.

    ```
    /* my-component.scss */
    ::slotted(a)  {
      color: red;
    }
    ```


3.   Apply styles to any HTML element with attribute `slot="headline"`. Styles will cascade to nested children, but the specificity will *not* override anything inside the slot. 

    For example, this CSS: 

    ```   
    /* my-component.scss */
    [name="headline"]::slotted(*)  {
      color: red;
      text-decoration: none;
    }
    ```

    will style the markup inside the web component accordingly:



    ```
    <!--example-page.html-->
    <my-component>
      <header slot="headline">
        I will be red!
        <a href="#">I will be red too, but will keep the underline provided by the browser styles.</h2>
      </header>
      <a slot="pfe-card--header">I shall have no underline.</a>
    </my-component>
    ```


4.   Add further specificity, styling only `<h1>` tags with the attribute `slot="headline"`

    ```
    /* my-component.scss */
    [name="headline"]::slotted(h1)  {
      color: red;
    }
    ```
    
    ```
    <!--example-page.html-->
    <my-component>
      <h1 slot="headline">
        I will be red!
      </h1>
      <h2 slot="headline">
        I will not.
      </h2>
    </my-component>
    ```


5.  Nothing may follow the `::slotted()` selector, so these <span style="text-decoration:underline;">won’t</span> work

    ```
    /* my-component.scss */
    ::slotted() iframe[name="video"] {}
    ::slotted() h2 {}
    ::slotted() [name="headline"] {}
    ::slotted() .headline {}
    ```


[More examples in JSFiddle](https://jsfiddle.net/kendalltotten/qdz0tkcm/)




## Web component style specificity



*   Note that anything in the light DOM can be styled by regular classes loaded on the page (in the document head or inline) and they will *win* the specificity battle. For example, this style:

    ```
    <head>
    <style>
      iframe {
        border: 2px solid red;
      }
    </style>
  </head>
    ```



    Will beat any slotted styles coming from the web component CSS, such as:


    ```
    [name="video"]::slotted(iframe)  {
        border: 2px solid blue;
    }
    ```



    However, you can move an element into the Shadow DOM, where document styles will not apply. 


    ```
    connectedCallback() {
      super.connectedCallback();

      const iframe = this.querySelector("iframe");
      this.shadowRoot.appendChild(iframe);
    }

    ```


## Writing web component styles

### Theme variables & related functions  

Theme variables exist so that when a user changes a system property such as color or font-size, they see the effects of that trickle through the system to nearly every component. 

Several functions exist in the `pfe-sass` component to make it easier to theme individual components you are building!
    
1. **Color**:  Rather than using only Sass variables `$red` or hexidecimal colors like `#c00`, please use the `pfe-color()` function along with a theme variable, i.e. `pfe-color(ui-link)`. Occasionally you may have to wrap interpolation syntax `#{ }` around the function to allow Sass to compile, i.e. `#{pfe-color(ui-link)}`. 
    

    * This function does some heavy-lifting by looking up the `$pfe-colors: ()` map and returning namespaced CSS variables for the [broadcasted color](#broadcasted) (should it be passed down from a dark container), the theme color, and then a fallback color in that order: 


    ```
    :host {
       color: pfe-color(ui-link);
    }
    ```   

     returns:

     ```css
     :host {
         color: var(--pfe-broadcasted--color--ui-link, var(--pfe-theme--color--ui-link, #06c));
     }
     ```
  
   *   Component color properties should almost always use [theme colors](https://static.redhat.com/libs/redhat/redhat-theme/2.0.0/advanced-theme.css) as values.  (Sidenote, there is no "light" or "dark" color, only "lighter"/ "darker", it's all relative to the base color, it can only get lighter or darker from there.
      *   Lightest
      *   Lighter
      *   Base
      *   Darker
      *   Darkest
      *   Accent
      *   Complement
       
2. **Other Properties**:   Similarly, the `pfe-var` function does the same work of looking up values from the `$pfe-vars: ()` map, and returning the variable name and the fallback value:
      
    ```sass
    :host {
        font-size:   pfe-var(font-size);
    }
    ```
    
    returns:
    
    ```
    :host {
        font-size: var(--pfe-theme--font-size, 16px);
    }
    ```    

### Local variables & related functions     

2. It is recommended to create "local" variables for properties that developers are likely to override, such as color and sizing. You may use these functions that refer to theme variables to set the values of these local vars. Here's an example of some local variables you would find in the `pfe-cta.scss` file:
     
    ```
    :host {
         --pfe-cta--BorderRadius: 0;
         --pfe-cta--Color:  pfe-color(ui-link);
    }
    ```
       
    * When utilizing local variables, you can use the `pfe-local()` function to refer to them by the shorthand property name:
  
    ```
    ::slotted(*) {
       color: pfe-local(Color--hover);
    }
    ```
       
    * If you are using the function to set multiple values, you will need to add the interpolation syntax:
       
    ```
    :host([pfe-priority]) {
       padding: #{pfe-var(container-padding)} calc( #{pfe-var(container-padding) } * 2)} 
    }
    ``` 

  * Naming conventions.. BEM.. @TODO 

3. Avoid use of !Important if possible
    *   ShadyCSS adds !important to styles, which means we generally should not add !important to our stylesheets. 
    *   @TODO is this still the case? pfe-cta uses important

    
4. Suggested easiest approach to theming: 
    1. Add properties with normal values first, `color: #c00`.
    2. Then go back and add / replace with local variables, `color: var(--pfe-cta--Color)` or use the local var function `pfe-local(Color)`.
        * _It's worth noting that very time we surface something as a variable, we offer an opportunity to lean away from the design system. There's no need to create a local variable for all properties._
    3. Replace the values of local variables with functions that refer to the theme, `color: pfe-color(accent)` and `pfe-vars(padding)`
    4.  Add additional attributes to a component, to allow users to switch between variants without CSS overrides, i.e.  `<pfe card color="darkest">`
        * Any component that can change background colors MUST provide colors for the broadcast variables. The `pfe-theme` mixin is useful to loop through system colors:  

            ```
            pfe-card { 
               @include pfe-theme; 
            }
            ```
        
        * Use CSS property, such as `color:` once. If value needs to change based on variant, reset the value of the CSS variable rather than calling the property again.


    #### Example of a Component Sass file


    ```
    // 1. Create local variable. Set value using color
    // function to look up theme variables.
    :host {
      --pfe-local--Color: pfe-color(ui-link);
    }
  
  
    // 2. Use color property once, map to local var value
    :host {
      ::slotted(a) {
         color: pfe-local(Color);
      }
    }
  
    // 3. Reset value of local variable for variants. 
    // Continue to use theme functions.
    :host([priority])
      --pfe-local--Color: pfe-var(accent);   
    }
  
    // 4. Override broadcasted last
    [on="dark"] {
      --pfe-local--Color: pfe-var(ui-link--on-dark);
    }
    [color="accent"] {
      --pfe-local--Color: pfe-var(accent--ui-link);
    }
    ```

    compiled css:
       
    ```
    :host(:not([priority]) {
        ::slotted(a) {
            //NOTE: the compiled CSS will print color twice for IE11 
            // which sometimes trips over CSS variables.
            //color: blue; 
            color: var(--pfe-local--Color, blue) !important;
        }
    }
    ```

----

<a name="broadcasted"></a>
# Containers + broadcast variables

If the container allows changes to background colors, then it should also influence the children by setting values of broadcast colors.


## Notes on using broadcast colors in pfe-components  

1. Only define CSS color <span style="text-decoration:underline;">property</span> once per element 
2. Set the value equal to local variable:   \
  `color: var(pfe-local--Color);`
3. In the pfe-component, do not set <span style="text-decoration:underline;">value</span> of the broadcasted variables, instead set local variable values equal to the value of broadcasted, then with fallback colors
    1. Content components should never set the value of broadcasted vars, otherwise container components won't be able to pass them that information
4. Reset local variable values as needed for color attribute overrides.



### Should I use on=dark or color=darkest on my container? What's the difference?


*   The attribute `on=dark` is being deprecated. Instead, custom classes already on the page should set broadcast values.
*   The original goal for `on=dark` was all about context. But instead of having to provide another attribute somewhere, the card or a band or another container will inform any nested components that the text color needs to change through the set of broadcast variables. Existing broadcast vars (defined in $BROADCAST-VARS)  include: text, ui-link, ui-link--hover, ui-link--visited, ui-link--focus.
*   If your page has a custom background color for a band or card, you should set the background and also set the broadcast colors.


```
.custom-dark-band {
  background: black;
  --pfe-broadcasted--color--text:             var(--pfe-theme--color--text--on-dark, #fff);
  --pfe-broadcasted--color--ui-link:          var(--pfe-theme--color--ui-link--on-dark, #73bcf7);
  --pfe-broadcasted--color--ui-link--hover:   var(--pfe-theme--color--ui-link--on-dark--hover, pink);
  --pfe-broadcasted--color--ui-link--visited: var(--pfe-theme--color--ui-link--on-dark--visited, pink);
  --pfe-broadcasted--color--ui-link--focus:   var(--pfe-theme--color--ui-link--on-dark--focus, pink);
}
```


In themes (like the [advanced-theme.css](https://static.redhat.com/libs/redhat/redhat-theme/2.0.0/advanced-theme.css) file from the [Red Hat Theme](https://gitlab.corp.redhat.com/uxdd/redhat-theme) ) we apply broadcast variables to plain links, because they are light DOM and also have default colors applied by the browser. This CSS file not only includes variables but also styles for headlines and links on the page. It sets the colors for these elements using a CSS variable, which web components can change the value of.

For example, [advanced-theme.css](https://static.redhat.com/libs/redhat/redhat-theme/2.0.0/advanced-theme.css) includes


```
.PFElement a {
  color: var(--pfe-broadcasted--color--ui-link);
}
```


We choose not to apply broadcast colors to text elements like paragraphs because it still would not be high enough specificity to override anything coming from pre-existing stylesheets, and paragraphs will inherit color from parents. 

#### Use case

```
// this would not really be helpful to add to cp-theme or redhat-theme
h1, h2, h3, h4, h5, h6, p { 
  color: var(--pfe-broadcasted--color--text);
}
// if there was some class like this in the theme, It would override it anyway. 
body.editorial .body1.generic1 {
    color: #646464;
}
```

Instead, in the host of components, use:

```
:host {
  color: var(--pfe-broadcasted--color--text);
}
```

Then call theme mixin to flip colors of the on=dark on=light attributes. Default tags will use these colors. If devs implementing the component have more specific styles on their page, they will have to handle it.

```
:host([on="dark"]) {
  @include pfe-theme($theme: "dark");
}
:host([on="light"]) {
  @include pfe-theme($theme: "light");
}
```




## Troubleshooting web component style issues

#### Problem: I expect that the pfe-cta should have a red background, but it does not. 

1. **Inspect the element & look for the style property**
    1. Check the light DOM
    2. In the styles tab of web inspector, look for the CSS property `background`. Is the property present? Remember styles can be applied to `:host` as opposed to the actual component name, such as `pfe-cta`.

        <img src="/theme__code_block_1.png" width="450px">

    3. What is the value of the property? Try changing the value to a funny color. If there's no change then…

2. **Check the shadow DOM**
    1. Check to see if the property you expect is actually being applied elsewhere, like some other element in the shadow root: 

        <img src="/theme__code_block_2.png" width="450px">


    2. What is the value of the property? Try changing the value to a funny color. If there's no change then…
2. **Check to see if the property is overridden**
    1. If the styles are being applied to the light DOM, and if it's still the wrong color, it means something other style from elsewhere on the page is winning the specificity war. [Learn more about detecting overrides.](https://developers.google.com/web/tools/chrome-devtools/css/overrides)
    
        <img src="/theme__code_block_3.png" width="450px">

    2. Options:
        1. Remove the styles that are more specific than your styles (may not be a viable option)
        2. Adjust the web component so that the styles are targeting the component itself, rather than it's children. Use `:host { }`
        3. Move the styles to target an element in the Shadow DOM
        4. If the styles are on a child of the web component (like a link tag inside the pfe-cta tag) you might need to hook into [broadcast variables.](https://docs.google.com/document/d/1P6ohcr13y0DTca_aow6Lm5qSnUcIdM56wu8Fc4SwE00/edit#heading=h.l0fiuwszzxzg)
        5. If this still doesn't work then...
3. **Check to see if the value of the property set to a CSS variable**
    1. Sometimes CSS variables map to other CSS variables which have similar names, which can be confusing. Copy the exact name you are looking for and paste it into the [web inspector filter](https://developers.google.com/web/tools/chrome-devtools/css/reference#fiilter). Look for a plain hex value or RGBa value. For example:

    ```
    --pfe-cta--background: var(--pfe-theme--color--surface--accent, #fe460d);
    --pfe-theme--color--surface--accent: #ee0000;
    ```

    2. And every time you hit a variable as the value, [change it to a funny color](http://www.giphy.com/gifs/hu1kdgZ1ObIGPcENJ0), so you can verify that is indeed the property you are looking for. 

