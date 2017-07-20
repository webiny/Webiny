const glob = require('glob');
const fs = require('fs-extra');

glob(__dirname + '/Js/**/*.js*', {absolute: true}, (err, files) => {
    files.forEach(file => {
        let content = fs.readFileSync(file).toString();
        const newImports = [];

        if ((content.includes('React.') || content.includes('</') || content.includes('/>')) && !content.includes('import React ')) {
            // import react
            newImports.push("import React from 'react';");
        }

        if (content.includes('ReactDOM.') && !content.includes('import ReactDOM ')) {
            // import react-dom
            newImports.push("import ReactDOM from 'react-dom';");
        }

        if (content.includes('_.') && !content.includes('import _ ')) {
            // import lodash
            newImports.push("import _ from 'lodash';");
        }

        if ((content.includes('$.') || content.includes('$(')) && !content.includes('import $ ')) {
            // import jquery
            newImports.push("import $ from 'jquery';");
        }

        if (newImports.length > 0) {
            // Inject new imports
            let br = "\n";
            if (content.startsWith('class')) {
                br = "\n\n";
            }
            content = newImports.join("\n") + br + content;
            fs.writeFileSync(file, content);
        }
    });
});