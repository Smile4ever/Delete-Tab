1.2.0 (2024-08-27)
==================
* Use browser.runtime.getURL instead of browser.extension.getURL
* Use async/await instead of Promises
* Update options layout to make the horizontal scrollbar disappear
* If any div with role=checkbox has aria-checked true, do nothing. This is to prevent the Gmail tab from closing when the user tries to delete an e-mail

1.1.0 (2024-08-26)
==================
* Upgrade to Manifest V3, make sure that Delete Tab has the necessary permissions to access to the webpages you browse
* Add compatibility for Chrome
* Use build script from Translate Now with slight adaptations

1.0.0 (2019-01-02)
==================
* Port to WebExtensions
* Add blacklist feature
* Add notify feature
