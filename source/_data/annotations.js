var comments = {
  "comments": [
    {
      "el": ".profile-login-control",
      "title" : "populating the login control with linked text (ProfileLoginControl behaviour)",
      "comment": "<p>The links when logged in, and with JavaScript enabled, are derived from data attributes on the pattern's root element. The following are always specified: <ul><li>Displayed name is defined by the value of <code>data-display-name</code></li><li>The link to profile home page is defined by the value of <code>data-profile-home-uri</code></li></ul></p><p>Each additional link is specified by two data attributes: <code>[root]-uri</code> and <code>[root]-text</code>, defining the uri and the text of the link respectively where <code>[root]</code> is common between the <code>-text</code> and <code>-uri</code> data attributes describing the same link.</p><p>Each <code>[root]</code> is defined as part of the value of the data attribute <code>data-link-field-roots</code>, which is a comma-delimited string, with the commas separating the <code>[root]</code>s<p>This is much simpler than it sounds and is best illustrated by example:</p><p>For example to display two additional links: a link to <code>/my-favourites</code> with the text \"Favourites\", and a link to <code>/my-bugbears</code> with the text \"Bugbears\"  would need a root pattern element with the following data attributes:</p><code>&lt;div data-link-field-roots=\"my-faves, my-bugbears\"<br>&nbsp;&nbsp;&nbsp;&nbsp; data-my-faves-uri=\"/my-favourites\" data-my-faves-text=\"Favourites\"<br>&nbsp;&nbsp;&nbsp;&nbsp; data-my-bugbears-uri=\"/my-bugbears\" data-my-bugbears-text=\"Bugbears\" ... &gt;<br>&nbsp;&nbsp;...<br>&lt;/div&gt;</code>"
    },
    {
      "el": ".paragraph",
      "title": "Useage",
      "comment": "<p>To be used in implementations where a stand alone paragraph is needed</p> <p>It is not necessary to use this pattern as a partial within higher level patterns.</p>"
    }
  ]
};
