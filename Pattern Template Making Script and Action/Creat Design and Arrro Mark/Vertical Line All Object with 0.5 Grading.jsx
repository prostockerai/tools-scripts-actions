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

// Function to display options dialog
function showOptionsDialog() {
    var dialog = new Window("dialog", "Select Line Length Options");

    // Input for specific line length
    dialog.add("statictext", undefined, "Enter line length in cm:");
    var lengthInput = dialog.add("edittext", undefined, "5"); // Default value
    lengthInput.preferredSize.width = 100;

    // Checkbox for using increments
    var incrementCheckbox = dialog.add("checkbox", undefined, "Use increments of 0.5 cm");
    incrementCheckbox.value = false; // Default unchecked

    // OK and Cancel buttons
    var okButton = dialog.add("button", undefined, "OK", {name: "ok"});
    var cancelButton = dialog.add("button", undefined, "Cancel", {name: "cancel"});

    // Show dialog and wait for user input
    if (dialog.show() === 1) {
        return {
            lengthInCm: parseFloat(lengthInput.text), // Get the entered length
            useIncrement: incrementCheckbox.value // Get checkbox value
        };
    }
    return null; // User pressed Cancel
}

// Function to position the text above the vertical line
function positionTextAboveLine(text, lineStartX, lineStartY, lineEndY) {
    // Calculate the midpoint of the line vertically
    var lineMidY = (lineStartY + lineEndY) / 2; 

    // Get the width of the text frame
    var textWidth = text.width;  

    // Set the text's horizontal position so it is centered above the line
    text.left = lineStartX - (textWidth / 2);  

    // Set the text's vertical position, adjusting it above the center of the line
    text.top = lineMidY + (text.height / 4);  
}

// Function to create vertical lines above selected objects
function createVerticalLinesAboveSelectedObjects(lengthInCm, useIncrement) {
    var doc = app.activeDocument;

    // Ensure at least one object is selected
    if (doc.selection.length === 0) {
        return; // Exit if nothing is selected
    }

    // Convert centimeters to points (1 cm = 28.3465 points)
    var lengthInPoints = lengthInCm * 28.3465;

    // Create arrays to hold the new vertical lines and text labels
    var newLines = [];

    // Iterate over each selected object in reverse order
    for (var i = doc.selection.length - 1; i >= 0; i--) {
        var selectedObject = doc.selection[i];
        var objectBounds = selectedObject.geometricBounds;
        var objectTop = objectBounds[1];  // Top edge of the object

        // Calculate the center of the selected object
        var objectCenterX = (objectBounds[0] + objectBounds[2]) / 2;

        // Draw the vertical line
        var line = doc.pathItems.add();
        line.setEntirePath([[objectCenterX, objectTop], [objectCenterX, objectTop + lengthInPoints]]);
        line.stroked = true;
        line.filled = false;
        line.strokeWidth = 1;
        line.strokeColor = doc.swatches.getByName("Red").color;  // Set line color to red
        newLines.push({ line: line, length: lengthInCm }); // Store the created line and its length

        // Increment the length if the increment option is selected
        if (useIncrement) {
            lengthInCm += 0.5; // Increment the length by 0.5 cm
            lengthInPoints = lengthInCm * 28.3465; // Convert to points
        }
    }

    // Deselect all previously selected objects
    doc.selection = null;

    // Create the vertical lines in reverse order and position text
    for (var j = 0; j < newLines.length; j++) {
        var lineData = newLines[j];
        var line = lineData.line;
        var text = doc.textFrames.add();
        
        // Add text showing the length in centimeters
        text.contents = lineData.length + " cm";  // The "cm" is always on the right side
        text.textRange.characterAttributes.size = 110;  // Set text size to 110 pt
        text.textRange.characterAttributes.fillColor = doc.swatches.getByName("Green").color;  // Set text color to green
        text.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");  // Set bold font

        // Get line's geometric bounds for position calculation
        var lineStartX = line.geometricBounds[0];  // X position of the vertical line's start
        var lineStartY = line.geometricBounds[1];  // Y position of the vertical line's start
        var lineEndY = line.geometricBounds[3];    // Y position of the vertical line's end

        // Position the text above the line
        positionTextAboveLine(text, lineStartX, lineStartY, lineEndY);

        line.selected = true; // Select each newly created line
    }
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

    // Show options dialog and get user input
    var userInput = showOptionsDialog();
    if (!userInput) return; // Exit if user canceled the dialog

    // Create vertical lines above selected objects based on user input
    createVerticalLinesAboveSelectedObjects(userInput.lengthInCm, userInput.useIncrement);
}

// Run the main function
main();
