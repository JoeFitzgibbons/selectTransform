# selectTransform


selectTransform is a jquery plugin that allows you to turn a select field into different interfaces all together. Perhaps you have a certain design implementation in mind and the best way to store the data is using a select field. Select fields are not flexible in they way they can be rendered. This plugin allows you to interface with a select field using buttons which you can style yourself. Perhaps you want checkboxes instead. This is al possible.

## Methods

### toButtons

toButtons will turn your select field into a list of elements that are bound to your select field. This gives you the freedom to style you buttons any way you want.

Example:

$('#example').selectTransform('toButtons');

#### Options

- insertMarkup: allows you to include markup inside you button so that it can take on many forms.
- selectType: "regular"(default) || "multi"
- wrapElement: You can define markup that will wrap the text of the element created

### toCheckboxes

Turn a select field into a list of checkboxes

#### options

- label: true(default) || false : whether to include labels


## Global Options

- listWrap: gives you the option to change the container that the elements will be generated in.
- liClass: insert a list of classes into the list elements that contain each element.
- initSelected: true(default) || false : whether to initialize the elements to the value of the select field they are bound to. 