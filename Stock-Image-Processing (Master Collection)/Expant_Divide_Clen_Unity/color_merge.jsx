#target illustrator

function uniteByColor() {
    var doc = app.activeDocument;

    function pathfinderUnite() {
        app.executeMenuCommand("group");
        app.executeMenuCommand("Live Pathfinder Add");
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
                var key = getColorKey(c);
                if (key) {
                    if (!colors[key]) colors[key] = [];
                    colors[key].push(p);
                }
            } catch (e) {}
        }
    }

    var mergedCount = 0;

    for (var col in colors) {
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

function getColorKey(c) {
    if (c.typename === "RGBColor") {
        return "RGB_" + Math.round(c.red) + "_" + Math.round(c.green) + "_" + Math.round(c.blue);
    } else if (c.typename === "CMYKColor") {
        return "CMYK_" + Math.round(c.cyan) + "_" + Math.round(c.magenta) + "_" + Math.round(c.yellow) + "_" + Math.round(c.black);
    } else if (c.typename === "SpotColor") {
        return "SPOT_" + c.spot.name;
    }
    return null;
}

// run مباشرة
if (app.documents.length > 0) {
    uniteByColor();
} else {
    alert("No document open.");
}