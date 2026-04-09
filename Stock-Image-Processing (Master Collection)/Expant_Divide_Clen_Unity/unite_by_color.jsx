/**
 * Unite Paths By Color (Fixed Version)
 * Developed By: Mostafizar Rahman
 */

function uniteByColor() {
    if (app.documents.length === 0) {
        alert("No document open.");
        return;
    }

    var doc = app.activeDocument;

    function pathfinderUnite() {
        app.executeMenuCommand("group");
        app.executeMenuCommand("Live Pathfinder Add"); // FIXED
        app.executeMenuCommand("expandStyle");
        app.executeMenuCommand("ungroup");
    }

    var paths = doc.pathItems;
    var colors = {};

    for (var i = 0; i < paths.length; i++) {
        var p = paths[i];
        if (p.filled) {
            try {
                var c = p.fillColor;
                if (c.typename === "RGBColor") {
                    var key = c.red + "," + c.green + "," + c.blue;
                    if (!colors[key]) colors[key] = [];
                    colors[key].push(p);
                }
            } catch (e) {}
        }
    }

    var mergedCount = 0;

    for (var col in colors) {
        if (!colors.hasOwnProperty(col)) continue;

        doc.selection = null;
        for (var j = 0; j < colors[col].length; j++) {
            try {
                colors[col][j].selected = true;
            } catch (e) {}
        }

        if (doc.selection.length > 1) {
            pathfinderUnite();
            mergedCount++;
        }
    }

    doc.selection = null;
    alert("✅ " + mergedCount + " colors merged!");
}

uniteByColor();
