if (app.documents.length > 0) {
    var doc = app.activeDocument;
    if (doc.documentColorSpace !== DocumentColorSpace.RGB) {
        app.executeMenuCommand("doc-color-rgb");
    }
}


// Function to create the template
function createTemplate(buyer, style) {
    var doc = app.activeDocument;
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var abBounds = artboard.artboardRect;

    var abWidth = abBounds[2] - abBounds[0];
    var abHeight = abBounds[1] - abBounds[3];

    // Calculate the margin
    var topMargin = 4 * 28.3465; // 4 cm to points
    var sideMargin = 2 * 28.3465; // 2 cm to points

    // Create a black outline box outside the artboard
    var blackOutlineBox = doc.pathItems.rectangle(
        abBounds[1] + topMargin, 
        abBounds[0] - sideMargin, 
        abWidth + 2 * sideMargin, 
        abHeight + topMargin + sideMargin
    );
    blackOutlineBox.stroked = true;
    blackOutlineBox.strokeColor = new RGBColor();
    blackOutlineBox.strokeColor.red = 0;
    blackOutlineBox.strokeColor.green = 0;
    blackOutlineBox.strokeColor.blue = 0;
    blackOutlineBox.strokeWidth = 8;
    blackOutlineBox.filled = false;

    // Get the current date in "DD.MM.YYYY" format
    var today = new Date();
    var day = ("0" + today.getDate()).slice(-2); // Add leading zero if needed
    var month = ("0" + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    var year = today.getFullYear();
    var dateStr = day + "." + month + "." + year;

    // Create the black box at the top outside the artboard
    var boxHeight = 6 * 28.3465; // 6 cm to points
    var blackBox = doc.pathItems.rectangle(
        abBounds[1] + topMargin + boxHeight, 
        abBounds[0] - sideMargin, 
        abWidth + 2 * sideMargin, 
        boxHeight
    );
    blackBox.filled = true;
    blackBox.fillColor = new RGBColor();
    blackBox.fillColor.red = 0;
    blackBox.fillColor.green = 0;
    blackBox.fillColor.blue = 0;
    blackBox.stroked = true;
    blackBox.strokeWidth = 8;
    blackBox.strokeColor = new RGBColor();
    blackBox.strokeColor.red = 0;
    blackBox.strokeColor.green = 0;
    blackBox.strokeColor.blue = 0;

    // Add bold Arial text inside the black box
    var textSize = 155; // Set the text size to 155pt
    var textMargin = 10; // Margin inside the box for text positioning

    // Left text
    var buyerText = doc.textFrames.add();
    buyerText.contents = "BUYER: " + buyer;
    buyerText.textRange.characterAttributes.size = textSize;
    buyerText.textRange.characterAttributes.fillColor = new RGBColor();
    buyerText.textRange.characterAttributes.fillColor.red = 255;
    buyerText.textRange.characterAttributes.fillColor.green = 255;
    buyerText.textRange.characterAttributes.fillColor.blue = 255;
    buyerText.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");
    buyerText.top = blackBox.top - textMargin;
    buyerText.left = blackBox.left + textMargin;

    // Center text
    var styleText = doc.textFrames.add();
    styleText.contents = "STYLE: " + style;
    styleText.textRange.characterAttributes.size = textSize;
    styleText.textRange.characterAttributes.fillColor = new RGBColor();
    styleText.textRange.characterAttributes.fillColor.red = 255;
    styleText.textRange.characterAttributes.fillColor.green = 255;
    styleText.textRange.characterAttributes.fillColor.blue = 255;
    styleText.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");
    styleText.top = blackBox.top - textMargin;
    styleText.left = blackBox.left + (blackBox.width / 2) - (styleText.width / 2);

    // Right text (Date)
    var dateText = doc.textFrames.add();
    dateText.contents = "DATE: " + dateStr;
    dateText.textRange.characterAttributes.size = textSize;
    dateText.textRange.characterAttributes.fillColor = new RGBColor();
    dateText.textRange.characterAttributes.fillColor.red = 255;
    dateText.textRange.characterAttributes.fillColor.green = 255;
    dateText.textRange.characterAttributes.fillColor.blue = 255;
    dateText.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-BoldMT");
    dateText.top = blackBox.top - textMargin;
    dateText.left = blackBox.left + blackBox.width - dateText.width - textMargin;

    // Create another box outside the entire template with 2 cm gap on sides and 6 cm on top
    var outerBox = doc.pathItems.rectangle(
        blackOutlineBox.top + 2 * topMargin, 
        blackOutlineBox.left - sideMargin, 
        blackOutlineBox.width + 2 * sideMargin, 
        blackOutlineBox.height + 2 * topMargin + sideMargin
    );
    outerBox.stroked = false;
    outerBox.filled = false;

    // Add footer text at the bottom right corner
    var footerText = doc.textFrames.add();
    footerText.contents = "Created by \u00A9 JM Fabrics Ltd. Based on the original design by Gymshark";
    footerText.textRange.characterAttributes.size = 70; // Set the text size to 70pt
    footerText.textRange.characterAttributes.fillColor = new RGBColor();
    footerText.textRange.characterAttributes.fillColor.red = 0;
    footerText.textRange.characterAttributes.fillColor.green = 0;
    footerText.textRange.characterAttributes.fillColor.blue = 0;
    footerText.textRange.characterAttributes.textFont = app.textFonts.getByName("Arial-ItalicMT");
    footerText.left = blackOutlineBox.left + blackOutlineBox.width - footerText.width - 10; // 10pt padding from the right
    footerText.top = blackOutlineBox.top - blackOutlineBox.height - 20; // Adjust to position at bottom right

    // Create a group for all elements except the black box
    var itemsToGroup = [buyerText, styleText, dateText, outerBox, footerText];
    var group = doc.groupItems.add();

    for (var i = 0; i < itemsToGroup.length; i++) {
        itemsToGroup[i].move(group, ElementPlacement.PLACEATEND);
    }

    // Bring the group to the front
    group.zOrder(ZOrderMethod.BRINGTOFRONT);

    // Ensure the black box is always behind the group
    blackBox.zOrder(ZOrderMethod.SENDTOBACK);
}

// Prompt for user input
var buyer = prompt("Enter BUYER:", "GYMSHARK");
var style = prompt("Enter STYLE:", "0000");

// Run the template creation function with user inputs
createTemplate(buyer, style);
