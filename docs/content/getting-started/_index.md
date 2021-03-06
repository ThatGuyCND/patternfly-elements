+++
title = "Getting Started"
description = "Use a PatternFly Element in your web site or web app."
weight = 1
draft = false
bref = ""
toc = true
menu = "start"
tags = [ "start" ]
+++

## Getting Started

Check out the demo files within each component for examples of the attributes and possible variable overrides.  The readme.md files within each component should have descriptions about the supported attributes & variables.

The list below is the recommended approach to using web components and overriding style properties, in order.


## 1. Install PatternFly Elements


Use [NPM](https://www.npmjs.com/) (Node Package Manager) to install individual PatternFly Elements.

```bash
npm install --save @patternfly/pfe-card
npm install --save @patternfly/pfe-cta
```


## 2. Include PatternFly Elements JavaScript

There are a few options:

1. Load JavaScript modules via script tag: `script type="module"`
	1.  Downloads all of the dependencies on its own.
	2.  [Only supported in modern browsers](https://caniuse.com/#search=module).
2. Include the PatternFly Element and its dependencies on the page(s) or within the app.

	```html
	import '@patternfly/pfe-card/dist/pfe-card.js';
	import '@patternfly/pfe-cta/dist/pfe-cta.js';
	```

3. Use [require.js](https://requirejs.org/) JavaScript file and module loader.
	- Learn more about [Polyfills](/getting-started/polyfills)
3. Load individual PatternFly Element scripts, but bundle the polyfills with the base `pfelement.js` file.
	1.  All elements are based off of `pfelement.js` so including the polyfills with this one file would mean you only need to include the `pfelement.js` file before you include anything else.
4. Bundle all of the scripts together into one rollup, and include that.



## 3. Use PatternFly Elements markup

Different components have different intended uses. We tend to think of them in 3 distinct groups:

- Content, such as a call-to-action: `pfe-cta`
- Containers, such as a card: `pfe-card`
- Combos, such as the pattern which captures sets of content and renders it as an accordion or tab set: `pfe-content-set`


### Content Components

The beauty of web components is that they have much of the styling built-into the tag itself. Start with the tags first.

```
<body>
    <pfe-cta>
        <a href="#">Learn more</a>
    </pfe-cta>
</body>
```



### Container components (see also container notes below)

```
<body>
    <pfe-card pfe-color="darkest">
        <p>Hello world.</p>
    </pfe-card>
</body>
```


You can use PatternFly Elements alongside other standard HTML markup in your app or page. Here's a React app example:

```html
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '@patternfly/pfe-card/dist/pfe-card.js';
import '@patternfly/pfe-cta/dist/pfe-cta.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="body">
          <pfe-card>
            <h2 slot="pfe-card--header">Default card</h2>
            <p>This is the default pfe-card and <a href="#">a link</a>.</p>
            <p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.</p>
            <p>Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
            <div slot="pfe-card--footer">
            	<pfe-cta pfe-priority="secondary"><a href="#">Learn more</a></pfe-cta>
            </div>
          </pfe-card>
        </div>
      </div>
    );
  }
}

```


## 4. Add attributes 

You may choose to add attributes such as `pfe-variant`, `pfe-priority` or `pfe-color` as needed to adjust usage of general theme, palette color, or priority. Check the readme file of a component to see what attributes are supported. Or check out the [Storybook](https://patternfly.github.io/patternfly-elements/demo) to preview how the attributes work.

#### General

  "Priority" & "variant" attributes will change various styles throughout the component, as a set:

  ```
  <pfe-cta pfe-priority="primary">...</pfe-cta>
  <pfe-tabs pfe-variant="earth">...</pfe-tabs>
  ```

  **Full list:**

  *   `pfe-priority`
  *   `pfe-variant`


#### Specific

"Color" and "align" attributes change those specific properties respectively, but do not alter the overall look & feel.

```
<pfe-cta pfe-color="accent">...</pfe-cta>
```


#### **Full list:**

*   `pfe-align`
*   `pfe-color`
*   `vertical`
*   `horizontal`


## 5. Use CSS variables to provide hooks for customization or as a means of updating internal styles

CSS variables are subject to the normal cascade, so consider where you want these overrides to propogate.


#### Page-level CSS, [theme](https://static.redhat.com/libs/redhat/redhat-theme/2/advanced-theme.css) variables

Theme variables will impact all components on the page where this CSS is loaded.


```
// your-page.css
:root {
    --pfe-theme--color--ui-accent: green;
    --pfe-theme--color--surface--darker: navy;
}
```


_Note_: overriding local variables (i.e., --pfe-cta--foo) will not work at this level.  Those overrides can only be done on the component via tag name, class, or ID.


#### Page-level CSS, component variables


```
/* your-page.css */
pfe-cta {
    --pfe-cta--BackgroundColor: green;
}
pfe-band {
    --pfe-band--Padding--vertical: 34px;
}
```



### Component-level inline CSS

As a last resort, you may choose to override variables with inline styles. This could be desirable if you only need one component to deviate from the design system. Note that this incurs some level of risk, especially related to colors, as you are opting out of the color combinations in the system.


```
<pfe-cta style="--pfe-cta--BackgroundColor:pink">
```


## 6. Victory!

Be sure to browser test within your own site or application. If you run into any trouble, please file an issue in the [issue queue](https://github.com/patternfly/patternfly-elements/issues).

<hr/>


## FAQ

### Should I use on=dark or color=darkest on my container? What's the difference?

*   `on=dark` is being deprecated. Instead, custom classes already on the page should set broadcast values.
*   The original goal for `on=dark` was all about context, but instead of having to provide another attribute somewhere, the card or a band or another container will inform any nested components that the text color needs to change through the set of broadcast variables. Existing broadcast vars (defined in `$BROADCAST-VARS`)  include: `text`, `ui-link`, `ui-link--hover`, `ui-link--visited`, `ui-link--focus`.
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

In themes (like the advanced-theme.css file from the Red Hat Theme ) we apply broadcast variables to plain links, because they are light DOM and also have default colors applied by the browser. This CSS file not only includes variables but also styles for headlines and links on the page. It sets the colors for these elements using a CSS variable, which web components can change the value of.

For example, advanced-theme.css includes:

```
.PFElement a {
color: var(--pfe-broadcasted--color--ui-link);
}
```

We choose not to apply broadcast colors to text elements like paragraphs because it still would not be high enough specificity to override anything coming from pre-existing stylesheets, and paragraphs will inherit color from parents. 


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
