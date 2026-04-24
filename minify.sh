#!/bin/bash
echo "Minifying CSS and JS files..."
npx -y terser script.js -c -m -o script.min.js
npx -y clean-css-cli styles.css -o styles.min.css
echo "Minification complete!"
