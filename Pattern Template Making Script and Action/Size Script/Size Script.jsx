// Define the available sizes in reverse order
var sizes = ["3XL", "XXL", "XL", "L", "M", "S", "XS", "XXS"];

// Access the active Illustrator document
var doc = app.activeDocument;

// Get selected objects
var selectedObjects = doc.selection;

// Ensure there are selected objects
if (selectedObjects.length === 0) {
    alert("Please select objects to label.");
    exit();
}

// Loop through each selected object
for (var i = 0; i < selectedObjects.length; i++) {
    var obj = selectedObjects[i];
    
    // Create a new text frame for each object
    var textFrame = doc.textFrames.add();
    
    // Ensure we do not go out of range of the sizes array
    var sizeIndex = i % sizes.length;  // This allows for cycling through sizes if more objects are selected than sizes
    textFrame.contents = "Size : " + sizes[sizeIndex];
    
    // Style the text (Bold, black, size 150 pt)
    textFrame.textRange.size = 150;
    textFrame.textRange.fillColor = new RGBColor();
    textFrame.textRange.fillColor.red = 0;
    textFrame.textRange.fillColor.green = 0;
    textFrame.textRange.fillColor.blue = 0;
    textFrame.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");

    // Get the geometric bounds of the object
    var objBounds = obj.geometricBounds;
    var objCenterX = (objBounds[0] + objBounds[2]) / 2;  // X-coordinate of the middle
    var objTopY = objBounds[3];  // Y-coordinate of the top of the object

    // Adjust the position of the text frame to be outside the top of the object with 200pt padding
    var textBounds = textFrame.geometricBounds;
    var textWidth = textBounds[2] - textBounds[0];
    var textHeight = textBounds[1] - textBounds[3];

    // Position the text 250pt above the top of the object
    var offset = 200;  // Padding of 200 points
    textFrame.position = [objCenterX - textWidth / 2, objTopY + offset];
}
