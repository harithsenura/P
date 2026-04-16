const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// A function to wrap all specific :hover rules.
// Because parsing CSS with regex can be tricky (e.g. nested rules), 
// we'll just replace the specific strings we know we want to wrap, or use a basic regex.
const hoverRegex = /([^{}]*?:hover[^{]*?)\{([^{}]*)\}/g;

css = css.replace(hoverRegex, (match, selector, body) => {
    // some selectors might have multiple, like `.fil-btn.active, .fil-btn:hover`
    // We just wrap the whole matched block in a media query
    return `@media (hover: hover) {
  ${selector.trim()} {${body}}
}`;
});

fs.writeFileSync('src/app/globals.css', css);
console.log("Hover rules wrapped!");
