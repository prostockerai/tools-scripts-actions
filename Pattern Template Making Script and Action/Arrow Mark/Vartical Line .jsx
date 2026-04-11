// Create and add a red color swatch
function createRedSwatch() {
    var redColor = new RGBColor();
    redColor.red = 255;  // Set maximum red component
    redColor.green = 0;  // No green component
    redColor.blue = 0;   // No blue component

    var redSwatch = app.activeDocument.swatches.add();
    redSwatch.color = redColor;
    redSwatch.name = "Red";
    return redSwatch;
}

// Create and add a green color swatch
function createGreenSwatch() {
    var greenColor = new RGBColor();
    greenColor.red = 0;   // No red component
    greenColor.green = 88;  // Set specified green component
    greenColor.blue = 50;   // Set specified blue component

    var greenSwatch = app.activeDocument.swatches.add();
    greenSwatch.color = greenColor;
    greenSwatch.name = "Green";
    return greenSwatch;
}

// Function to create a vertical red line above the selected object with no gap
function createVerticalLineAboveObject() {
    var doc = app.activeDocument;

    // Ensure an object is selected
    if (doc.selection.length === 0) {
        alert("Please select an object.");
        return;
    }

    // Get the selected object
    var selectedObject = doc.selection[0];
    var objectBounds = selectedObject.geometricBounds;
    var objectTop = objectBounds[1];  // Top edge of the object

    // Prompt the user to input the line length in centimeters
    var lengthInCm = prompt("Enter the length of the line in centimeters:", "5");
    if (lengthInCm === null || isNaN(lengthInCm)) {
        alert("Invalid input. Please enter a valid length.");
        return;
    }

    // Convert centimeters to points (1 cm = 28.3465 points)
    var lengthInPoints = lengthInCm * 28.3465;

    // Calculate the center of the selected object
    var objectCenterX = (objectBounds[0] + objectBounds[2]) / 2;

    // Calculate the coordinates of the vertical line
    var startX = objectCenterX;
    var startY = objectTop;  // Line starts exactly at the top of the object
    var endX = objectCenterX;
    var endY = startY + lengthInPoints;  // Length of the line

    // Draw the vertical line
    var line = doc.pathItems.add();
    line.setEntirePath([[startX, startY], [endX, endY]]);
    line.stroked = true;
    line.filled = false;
    line.strokeWidth = 1;
    line.strokeColor = doc.swatches.getByName("Red").color;

    // Add text showing the length in centimeters with "cm" on the right
    var text = doc.textFrames.add();
    text.contents = lengthInCm + " cm";  // The "cm" is always on the right side
    text.textRange.characterAttributes.size = 120;  // Set text size to 120 pt
    text.textRange.characterAttributes.fillColor = doc.swatches.getByName("Green").color;  // Set text color to green
    text.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");  // Set bold font

    // Align text horizontally and vertically with the center of the line
    var textWidth = text.width;  // Get the width of the text frame
    var lineMidY = (startY + endY) / 2;  // Calculate the midpoint of the line
    text.left = startX - (textWidth / 2);  // Center the text horizontally
    text.top = lineMidY + (text.height / 4);  // Center the text vertically

    // Deselect all other items
    doc.selection = null;

    // Select the newly created line
    line.selected = true;
}

// Main function to initialize the script
function main() {
    // Create swatches if they do not exist
    if (!app.activeDocument.swatches.getByName("Red")) {
        createRedSwatch();
    }
    if (!app.activeDocument.swatches.getByName("Green")) {
        createGreenSwatch();
    }

    // Create the vertical line based on the selected object
    createVerticalLineAboveObject();
}

// Run the main function
main();
