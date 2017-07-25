# js_refactoring_example

This repo is shows a two stage refactor of a very complicated and very messy jquery to handling building an 
configurable question and answer section of our tile component. (See screenshots)

The basic functionality allows the user to select a tile type and subtype from the drop down menus and have the appropriate configuration generated and rendered on the page.

In addition to being unmaintanable spaghetti code the original combined two concerns the construction of the tile and the end user behavior. 

The final refactor separates out the building from the end user interaction. It also uses proper namespacing.

Lastly, for the enduser side I stick with jquery for end user effects and dom manipulation.  For the builder side went with vanilla javascript and opted for the OLOO " inheritance" (https://gist.github.com/getify/5572383) over traditional but flawed and jury rigged but widely accepted JavaScript inheritance.
