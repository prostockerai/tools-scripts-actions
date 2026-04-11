// Function to get the design object from the "Design" layer and center it over each selected object
function main() {
    var doc = app.activeDocument; // Get the active document

    // Check if any object is selected
    if (doc.selection.length === 0) {
        alert("Please select at least one object.");
        return;
    }

    // Try to get the "Design" layer
    var designLayer;
    try {
        designLayer = doc.layers.getByName("Design");
    } catch (e) {
        alert("Design layer not found.");
        return;
    }

    // Check if there are objects in the "Design" layer
    if (designLayer.pageItems.length === 0) {
        alert("No design objects found in the 'Design' layer.");
        return;
    }

    // Select the first object from the "Design" layer as the design to be copied
    var designObject = designLayer.pageItems[0];

    // Create an array to hold the duplicated design objects
    var duplicatedDesigns = [];

    // Iterate over each selected object
    for (var i = 0; i < doc.selection.length; i++) {
        var selectedObject = doc.selection[i];

        // Calculate the center position of the selected object
        var selectedBounds = selectedObject.geometricBounds;
        var centerX = (selectedBounds[0] + selectedBounds[2]) / 2; // Center X of the selected object
        var centerY = (selectedBounds[1] + selectedBounds[3]) / 2; // Center Y of the selected object

        // Duplicate the design object and position it over the selected object
        var duplicatedDesign = designObject.duplicate(); // Duplicate the design object
        var designBounds = duplicatedDesign.geometricBounds;

        // Calculate the position to center the duplicated design over the selected object
        var designWidth = designBounds[2] - designBounds[0]; // Width of the design
        var designHeight = designBounds[1] - designBounds[3]; // Height of the design

        // Set the position of the duplicated design
        duplicatedDesign.position = [
            centerX - designWidth / 2, // X position
            centerY + designHeight / 2  // Y position
        ];

        // Add the duplicated design to the array
        duplicatedDesigns.push(duplicatedDesign);
    }

    // Deselect all currently selected objects
    doc.selection = null;

    // Select the newly created design objects
    for (var j = 0; j < duplicatedDesigns.length; j++) {
        duplicatedDesigns[j].selected = true; // Select each duplicated design
    }
}

// Run the main function
main();
