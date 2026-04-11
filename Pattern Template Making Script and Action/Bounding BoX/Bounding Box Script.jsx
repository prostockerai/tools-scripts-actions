// Create a red color swatch
var redColor = new RGBColor();
redColor.red = 255; // Set red component to maximum (255)
redColor.green = 0; // No green component
redColor.blue = 0; // No blue component

var redSwatch = app.activeDocument.swatches.add();
redSwatch.color = redColor;
redSwatch.name = "Red";

// Create a green color swatch
var greenColor = new RGBColor();
greenColor.red = 0; // No red component
greenColor.green = 88; // Set green component to maximum (255)
greenColor.blue = 50; // No blue component

var greenSwatch = app.activeDocument.swatches.add();
greenSwatch.color = greenColor;
greenSwatch.name = "Green";

// Function to create a red-colored bounding box around the selected object and display custom text aligned with the bottom edge of the selected object
function createBoundingBoxWithCustomText() {
    var doc = app.activeDocument;
    var selection = doc.selection;

    // Check if an object is selected
    if (selection.length > 0) {
        var selectedObject = selection[0]; // Assuming only one object is selected
        var bounds = selectedObject.visibleBounds;
        var width = Math.abs(bounds[2] - bounds[0]); // Calculate the width of the selected object
        var height = Math.abs(bounds[1] - bounds[3]); // Calculate the height of the selected object
        var x = bounds[0]; // X-coordinate of the top-left corner of the bounding box
        var y = bounds[1]; // Y-coordinate of the top-left corner of the bounding box

        // Create a red-colored bounding box around the selected object
        var rect = doc.pathItems.rectangle(y, x, width, height);
        rect.stroked = true;
        rect.filled = false; // Set fill color to None
        rect.strokeColor = doc.swatches.getByName("Red").color; // Set stroke color to red
        rect.strokeWidth = 1; // Set stroke width

        // Prompt the user to input custom text
        var customText = prompt("Enter custom text:", "5.00");

        // Create text for the custom text aligned with the bottom edge of the selected object
        var text = doc.textFrames.add();
        text.contents = "W=" + customText + " cm"; // Format the custom text
        text.textRange.characterAttributes.size = 45; // Set text size to 45 pt
        text.textRange.characterAttributes.fillColor = doc.swatches.getByName("Red").color; // Set text color to red
        text.textRange.characterAttributes.bold = true; // Set text to bold

        // Position the text exactly at the bottom edge of the selected object
        var textWidth = text.width;
        var textHeight = text.height;
        var textX = (bounds[0] + bounds[2]) / 2 - (textWidth / 2); // Center horizontally
        var textY = bounds[3]; // Align exactly with the bottom edge

        text.left = textX;
        text.top = textY;
    } else {
        alert("Please select an object in the document.");
    }
}

// Main function to run the script
function main() {
    createBoundingBoxWithCustomText();
}

// Run the main function
main();
