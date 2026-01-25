The chat widget is a DOM payload script and it must not need any external support (html, css of the page) to run.
The chat widget must not import or expect any dependency from the host page (e.g: index.html).
The chat widget must not interact with the host page (e.g: index.html). However, it can listen for certain events from the hostpage script, but cannot run any functions that interacts with the main page.
Before making any changes to the chat widget, always re-read this file.