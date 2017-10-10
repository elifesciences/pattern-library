var comments = {
  "comments": [
    {
      "el": ".profile-login-control",
      "title" : "populating the login control with linked text (ProfileLoginControl behaviour)",
      "comment": "<p>With the exception of the name link, text, and ancillary text, each other link in the profile login control is each defined by two data attributes: one ending in <code>uri</code>, and one ending in <code>-text</code>, respectively describing the link and the text of the link. The list of data attribute roots, one per link, to be processed into links by the JavaScript, must be supplied in the <code>linkFields</code> mustache string field.</p><p>For example to display a link to <code>/my-favourites</code> with the text \"Favourites\" would need a root pattern element with the following data attributes:</p><code>&lt;div data-link-fields=\"faves\" data-faves-uri=\"/my-favourites\" data-faves-text=\"Favourites\"<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class='profile-login-control' data-behaviour=\"ProfileLoginControl\" &gt;<br>&nbsp;&nbsp;...<br>&lt;/div&gt;</code>"
    }
  ]
};
