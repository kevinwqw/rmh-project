const toStyleMarkup = (second) => {
    third;
};

const toJsonMarkup = (second) => {
    third;
};

const toScriptMarkup = (second) => {
    third;
};

const renderPageHtml = (request, { title, stylesUrls, bodyHtml, scriptsUrls }) => {
    return `<!DOCTYPE html>
    <html>
      <header>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <title>${title}</title>
        ${toStyleMarkup(stylesUrls).join('')}
        ${toJsonMarkup(data)}
      <header>
      <body>
        ${bodyHtml}
        ${toScriptMarkup(scriptsUrls).join('')}
      </body>
    </html>`;
};

module.exports = {
    renderPageHtml
};
