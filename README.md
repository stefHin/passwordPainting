This is a POC of a firefox addon for painting passwords instead of typing them

It adds an icon to pw input fields, which when clicked opens a modal window to paint on 12x12 pixels. The color information of every pixel is then hashed with sha256 and then mapped to a list of possible characters. The distribution of characters is not completely even, which is a shortcoming of the current implementation. However, considering the length of the passwords generated (32), this probably is tolerable. 

Further shortcomings include the code quality (I'm not a js developer and crafted this with my friends google and chatGPT), overall design (if you can even call it that) and the fact that it only works on relatively plain websites with simple password input fields (as an example see images below - about 3/4 of all modern websites currently don't work)

Feel free to use it, build on it, ... Have fun, use it at your own risk. As mentioned above, this is in POC state.

![sample workflow 1](screenshotsForReadme/workflow1 "sample workflow 1")
![sample workflow 2](screenshotsForReadme/workflow2 "sample workflow 2")
![sample workflow 3](screenshotsForReadme/workflow3 "sample workflow 3")


For testing it, see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension