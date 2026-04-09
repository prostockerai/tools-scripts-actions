// Illustrator Multi-format Save Script
// This script creates a new document, resizes a design, and saves it in multiple formats.

#target illustrator

// Global variable to store the last used save path.
// This is a simple fallback and does not persist across sessions.
var lastSavePath = null;

// Main function to start the script
function runScript() {
    // Check if any document is open. If not, alert the user and stop.
    if (app.documents.length === 0) {
        alert("Please open a document with your design.");
        return;
    }

    var doc = app.activeDocument;
    var selection = doc.selection;

    // Check if any design is selected. If not, alert the user and stop.
    if (selection.length === 0) {
        alert("Please select the design you want to process.");
        return;
    }

    // Call the GUI function to show save options
    showSaveDialog(doc, selection);
}

// GUI function to display the options dialog
function showSaveDialog(doc, selection) {
    // Create the main dialog window
    var win = new Window("dialog", "Multi-format Save");
    win.orientation = "column";
    win.alignChildren = "fill";

    // Format selection panel
    var formatPanel = win.add("panel", undefined, "Select Format(s)");
    formatPanel.orientation = "row"; // Horizontally aligned
    var chk_jpg = formatPanel.add("checkbox", undefined, "JPG");
    var chk_png = formatPanel.add("checkbox", undefined, "PNG");
    var chk_ai = formatPanel.add("checkbox", undefined, "AI");
    var chk_eps = formatPanel.add("checkbox", undefined, "EPS 10");
    
    // Set default selections
    chk_jpg.value = true;
    chk_eps.value = true;

    // Measurement panel
    var measurementPanel = win.add("panel", undefined, "Dimensions (in px)");
    measurementPanel.orientation = "column";
    
    var docGroup = measurementPanel.add("group");
    docGroup.add("statictext", undefined, "Document H & W:");
    var docWidth = docGroup.add("edittext", undefined, "5000");
    docWidth.characters = 5;
    var docHeight = docGroup.add("edittext", undefined, "5000");
    docHeight.characters = 5;
    
    var designGroup = measurementPanel.add("group");
    designGroup.add("statictext", undefined, "Design H & W:");
    var designWidth = designGroup.add("edittext", undefined, "4200");
    designWidth.characters = 5;
    var designHeight = designGroup.add("edittext", undefined, "4200");
    designHeight.characters = 5;

    // File name group
    var nameGroup = win.add("group");
    nameGroup.add("statictext", undefined, "File Name:");
    var baseName = doc.name.replace(/\.[^\.]+$/, '');
    var fileNameInput = nameGroup.add("edittext", undefined, baseName);
    fileNameInput.characters = 20;

    // Save location group
    var saveGroup = win.add("group");
    var savePathBtn = saveGroup.add("button", undefined, "Select Save Folder");
    var savePathText = saveGroup.add("statictext", undefined, "No folder selected");
    savePathText.preferredSize = [200, 20];

    // Restore last used path if available
    var saveFolder = lastSavePath;
    if (saveFolder) {
        savePathText.text = decodeURI(saveFolder.fsName);
    }
    
    // Button to select a new save folder
    savePathBtn.onClick = function() {
        var tempFolder = Folder.selectDialog("Select a folder to save your files");
        if (tempFolder) {
            saveFolder = tempFolder;
            lastSavePath = tempFolder; // Save the new path for next time in this session
            savePathText.text = decodeURI(saveFolder.fsName);
        } else {
            savePathText.text = "No folder selected";
        }
    };

    // Button group for Save and Cancel
    var btnGroup = win.add("group");
    btnGroup.alignment = "center"; // Center the buttons
    var saveBtn = btnGroup.add("button", undefined, "Save");
    var cancelBtn = btnGroup.add("button", undefined, "Cancel");
    
    // Save button click handler
    saveBtn.onClick = function() {
        // If no folder is selected, create a default folder on the desktop
        if (!saveFolder) {
            var desktop = Folder.desktop;
            saveFolder = new Folder(desktop + "/AI_Exports");
            if (!saveFolder.exists) {
                saveFolder.create();
            }
        }
        
        var saveFormats = {
            jpg: chk_jpg.value,
            png: chk_png.value,
            ai: chk_ai.value,
            eps: chk_eps.value
        };
        
        var finalName = fileNameInput.text || baseName;
        
        // Get dimensions from the input fields
        var finalDocWidth = parseFloat(docWidth.text);
        var finalDocHeight = parseFloat(docHeight.text);
        var finalDesignWidth = parseFloat(designWidth.text);
        var finalDesignHeight = parseFloat(designHeight.text);

        if (isNaN(finalDocWidth) || isNaN(finalDocHeight) || isNaN(finalDesignWidth) || isNaN(finalDesignHeight)) {
            alert("Please enter valid numeric values for dimensions.");
            return;
        }

        // Copy the selected design
        app.copy();
        
        // Process and save the design in the selected formats
        processAndSave(saveFormats, saveFolder, finalName, finalDocWidth, finalDocHeight, finalDesignWidth, finalDesignHeight);
        win.close();
    };

    // Cancel button click handler
    cancelBtn.onClick = function() {
        win.close();
    };

    // Copyright and author info panel
    var authorPanel = win.add("panel", undefined, "");
    authorPanel.orientation = "column";
    authorPanel.alignChildren = "center";
    authorPanel.margins = [10, 5, 10, 5];
    authorPanel.add("statictext", undefined, "Developed By: Mostafizar Rahman");

    // Center and show the window
    win.center();
    win.show();
}

// Function to handle the design processing and saving
function processAndSave(formats, saveFolder, finalName, docWidth, docHeight, designWidth, designHeight) {
    // Create a new document with user-defined dimensions
    var newDoc = app.documents.add(DocumentColorSpace.RGB, docWidth, docHeight);

    // Paste the copied design
    app.paste();
    var newDocSelection = newDoc.selection;
    
    if (newDocSelection.length > 0) {
        // Group all pasted items for easier manipulation
        var group = newDoc.groupItems.add();
        for (var i = 0; i < newDocSelection.length; i++) {
            newDocSelection[i].move(group, ElementPlacement.PLACEATEND);
        }

        // Scale the design to user-defined dimensions
        var scaleFactorW = (designWidth / group.width) * 100;
        var scaleFactorH = (designHeight / group.height) * 100;
        var scaleFactor = Math.min(scaleFactorW, scaleFactorH);
        
        group.resize(scaleFactor, scaleFactor, true, true, true, true, scaleFactor);

        // Center the design on the artboard
        var artboardRect = newDoc.artboards[0].artboardRect;
        var artboardCenter = [(artboardRect[2] + artboardRect[0]) / 2, (artboardRect[1] + artboardRect[3]) / 2];
        var groupCenter = [group.geometricBounds[0] + group.width / 2, group.geometricBounds[1] - group.height / 2];
        group.translate(artboardCenter[0] - groupCenter[0], artboardCenter[1] - groupCenter[1]);
    }
    
    // Create a temporary white background layer for JPG export
    var backgroundLayer = newDoc.layers.add();
    backgroundLayer.name = "Background";
    var bgRect = backgroundLayer.pathItems.rectangle(docHeight, 0, docWidth, docHeight);
    bgRect.filled = true;
    bgRect.stroked = false;
    bgRect.fillColor = new RGBColor();
    bgRect.fillColor.red = 255;
    bgRect.fillColor.green = 255;
    bgRect.fillColor.blue = 255;
    backgroundLayer.zOrder(ZOrderMethod.SENDTOBACK);

    // Get the save path
    var filePath = new File(saveFolder + "/" + finalName);

    // Save as AI
    if (formats.ai) {
        newDoc.saveAs(new File(filePath.fsName + ".ai"), new IllustratorSaveOptions());
    }
    
    // Save as EPS (EPS 10)
    if (formats.eps) {
        var epsOptions = new EPSSaveOptions();
        epsOptions.compatibility = Compatibility.ILLUSTRATOR10;
        newDoc.saveAs(new File(filePath.fsName + ".eps"), epsOptions);
    }

    // Save as JPG
    if (formats.jpg) {
        var jpgOptions = new ExportOptionsJPEG();
        jpgOptions.quality = 100; // Maximum quality
        jpgOptions.artBoardClipping = true;
        jpgOptions.horizontalScale = 100; // Set scale to 100%
        jpgOptions.verticalScale = 100; // Set scale to 100%
        newDoc.exportFile(new File(filePath.fsName + ".jpg"), ExportType.JPEG, jpgOptions);
    }

    // Save as PNG
    if (formats.png) {
        // Temporarily hide the background layer for transparent PNG export
        backgroundLayer.visible = false;
        var pngOptions = new ExportOptionsPNG24();
        pngOptions.transparency = true;
        pngOptions.artBoardClipping = true;
        pngOptions.horizontalScale = 100; // Set scale to 100%
        pngOptions.verticalScale = 100; // Set scale to 100%
        newDoc.exportFile(new File(filePath.fsName + ".png"), ExportType.PNG24, pngOptions);
        backgroundLayer.visible = true; // Make background visible again
    }


    // Close the new document without saving additional changes
    newDoc.close(SaveOptions.DONOTSAVECHANGES);

    alert("Task completed successfully!\nFiles have been saved to: " + saveFolder.fsName);
}

// Start the script
runScript();
