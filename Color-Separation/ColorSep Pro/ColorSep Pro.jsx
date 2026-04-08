/*
 * ============================================
 * ColorSep Pro - Color Separation Tool
 * For Adobe Illustrator
 * ============================================
 * Purpose: Separates artwork into color layers
 * with tolerance-based color merging
 */

(function () {

    // ============================================
    // VALIDATION
    // ============================================
    
    if (app.documents.length === 0) {
        alert("No document open");
        return;
    }

    var doc = app.activeDocument;

    if (doc.selection.length === 0) {
        alert("Select artwork first");
        return;
    }

    // ============================================
    // UI SETUP
    // ============================================
    
    var win = new Window("dialog", "ColorSep Pro");
    win.orientation = "column";
    win.alignChildren = "center";
    win.spacing = 8;
    win.margins = 10;
    win.preferredSize.width = 260;

    // --- TOLERANCE SECTION ---
    var tolPanel = win.add("panel", undefined, "Color Setting Tolerance");
    tolPanel.alignChildren = "center";

    var slider = tolPanel.add("slider", undefined, 0, 0, 50);
    slider.preferredSize.width = 180;

    var tolRow = tolPanel.add("group");
    tolRow.orientation = "row";
    tolRow.alignment = "center";
    tolRow.alignChildren = ["center", "center"];
    tolRow.spacing = 5;

    var valueInput = tolRow.add("edittext", undefined, "0");
    valueInput.characters = 3;
    valueInput.justify = "center";
    valueInput.preferredSize.width = 40;

    var behaviourText = tolRow.add("statictext", undefined, "Exact");
    behaviourText.justify = "center";
    behaviourText.preferredSize.width = 60;

    // --- OPTIONS SECTION ---
    var optPanel = win.add("panel", undefined, "Options");
    optPanel.orientation = "column";
    optPanel.alignChildren = "left";

    var mergeCheck = optPanel.add("checkbox", undefined, "Merge Similar Colors");
    mergeCheck.value = true;

    var gradientCheck = optPanel.add("checkbox", undefined, "Keep Gradient Color");
    gradientCheck.value = true;

    var swatchCheck = optPanel.add("checkbox", undefined, "Create Swatch Group");
    swatchCheck.value = true;

    var sortCheck = optPanel.add("checkbox", undefined, "Sort Light to Dark");
    sortCheck.value = true;

    // --- BUTTON SECTION ---
    var btnGroup = win.add("group");
    var runBtn = btnGroup.add("button", undefined, "Run");
    var previewBtn = btnGroup.add("button", undefined, "Preview");
    var cancelBtn = btnGroup.add("button", undefined, "Cancel");

    var footer = win.add("statictext", undefined, "\u00A9 Mostafizar");
    footer.graphics.font = ScriptUI.newFont("Arial", "ITALIC", 10);
    footer.justify = "center";

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Updates the tolerance UI elements
     * @param {number} v - Tolerance value (0-50)
     */
    function updateToleranceUI(v) {
        v = Math.max(0, Math.min(50, Math.round(v)));
        slider.value = v;
        valueInput.text = v;

        if (v <= 3) behaviourText.text = "Exact";
        else if (v <= 8) behaviourText.text = "Normal";
        else if (v <= 15) behaviourText.text = "Medium";
        else if (v <= 25) behaviourText.text = "Strong";
        else behaviourText.text = "Aggressive";
    }

    /**
     * Extracts color data from Illustrator color object
     * Returns RGB values and unique key
     */
    function getColorData(c) {
        // RGB Color
        if (c.typename === "RGBColor") {
            return {
                r: c.red,
                g: c.green,
                b: c.blue,
                key: c.red.toFixed(2) + "_" + c.green.toFixed(2) + "_" + c.blue.toFixed(2)
            };
        }

        // CMYK Color
        if (c.typename === "CMYKColor") {
            var key = c.cyan.toFixed(2) + "_" + c.magenta.toFixed(2) + "_" + 
                      c.yellow.toFixed(2) + "_" + c.black.toFixed(2);
            var r = 255 * (1 - c.cyan / 100) * (1 - c.black / 100);
            var g = 255 * (1 - c.magenta / 100) * (1 - c.black / 100);
            var b = 255 * (1 - c.yellow / 100) * (1 - c.black / 100);
            return { r: r, g: g, b: b, key: key };
        }

        // Grayscale Color
        if (c.typename === "GrayColor") {
            var gray = c.gray / 100 * 255;
            return {
                r: gray,
                g: gray,
                b: gray,
                key: gray.toFixed(2) + "_" + gray.toFixed(2) + "_" + gray.toFixed(2)
            };
        }

        // Spot Color
        if (c.typename === "SpotColor") {
            return getColorData(c.spot.color);
        }

        // Default: Black
        return { r: 0, g: 0, b: 0, key: "0_0_0" };
    }

    /**
     * Calculates Euclidean distance between two colors
     */
    function distance(a, b) {
        return Math.sqrt(
            Math.pow(a.r - b.r, 2) +
            Math.pow(a.g - b.g, 2) +
            Math.pow(a.b - b.b, 2)
        );
    }

    /**
     * Calculates brightness (luminance) of a color
     */
    function brightness(c) {
        return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    }

    /**
     * Checks if swatch already exists
     */
    function swatchExists(doc, color) {
        for (var i = 0; i < doc.swatches.length; i++) {
            var sc = doc.swatches[i].color;
            if (sc.typename === "RGBColor" &&
                Math.round(sc.red) === Math.round(color.r) &&
                Math.round(sc.green) === Math.round(color.g) &&
                Math.round(sc.blue) === Math.round(color.b)) {
                return true;
            }
        }
        return false;
    }

    // ============================================
    // CORE ENGINE FUNCTIONS
    // ============================================

    /**
     * Finds matching color group within tolerance
     */
    function findGroup(color, groups, tolerance) {
        if (!mergeCheck.value) return null;

        for (var i = 0; i < groups.length; i++) {
            var refColor = groups[i].dominantColor || groups[i].baseColor;
            if (distance(color, refColor) <= tolerance) {
                return groups[i];
            }
        }
        return null;
    }

    /**
     * Finds dominant color in a group by count
     */
    function getDominantColor(group) {
        var max = 0;
        var dominant = group.color;

        for (var key in group.colorMap) {
            if (group.colorMap[key].count > max) {
                max = group.colorMap[key].count;
                dominant = group.colorMap[key].color;
            }
        }
        return dominant;
    }

    /**
     * Gets color from compound path (uses largest area)
     */
    function getCompoundPathColor(compoundItem) {
        var biggestArea = 0;
        var rgb = null;
        var key = null;

        for (var i = 0; i < compoundItem.pathItems.length; i++) {
            var p = compoundItem.pathItems[i];
            if (!p.filled) continue;

            // Skip gradients if keeping them
            if (p.fillColor.typename === "GradientColor" && gradientCheck.value) {
                return null;
            }

            var a = 0;
            try { a = Math.abs(p.area); } catch(e) { a = 1; }

            if (a > biggestArea) {
                biggestArea = a;
                var data = getColorData(p.fillColor);
                rgb = { r: data.r, g: data.g, b: data.b };
                key = data.key;
            }
        }

        return rgb ? { rgb: rgb, key: key, area: biggestArea } : null;
    }

    /**
     * Extracts dominant color from gradient
     */
    function getGradientDominantColor(gradient) {
        var stops = gradient.gradient.gradientStops;
        if (!stops || stops.length === 0) return null;

        var dominant = null;
        var maxVal = 0;

        for (var i = 0; i < stops.length; i++) {
            var data = getColorData(stops[i].color);
            var c = { r: data.r, g: data.g, b: data.b };
            var val = c.r + c.g + c.b;

            if (val > maxVal) {
                maxVal = val;
                dominant = c;
            }
        }

        return dominant;
    }

    // ============================================
    // PREVIEW FUNCTION
    // ============================================

    function analyzePreview() {
        var tol = Number(valueInput.text);
        var realTol = tol === 0 ? 0 : Math.pow(tol, 1.05);
        var groups = [];

        function processForPreview(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    processForPreview(item.pageItems[i]);
                }
                return;
            }

            if (!item.filled) return;

            var data = getColorData(item.fillColor);
            var rgb = { r: data.r, g: data.g, b: data.b };
            var g = findGroup(rgb, groups, realTol);
            var key = data.key;

            if (g) {
                if (!g.colorMap[key]) {
                    g.colorMap[key] = { count: 0, color: rgb };
                }
                g.colorMap[key].count++;
            } else {
                var newGroup = {
                    color: rgb,
                    baseColor: rgb,
                    dominantColor: rgb,
                    colorMap: {}
                };
                newGroup.colorMap[key] = { count: 1, color: rgb };
                groups.push(newGroup);
            }
        }

        // Count unique colors
        var uniqueMap = {};
        var uniqueCount = 0;

        function countUnique(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    countUnique(item.pageItems[i]);
                }
                return;
            }
            if (!item.filled) return;

            var data = getColorData(item.fillColor);
            if (!uniqueMap[data.key]) {
                uniqueMap[data.key] = true;
                uniqueCount++;
            }
        }

        // Process
        for (var i = 0; i < doc.selection.length; i++) {
            processForPreview(doc.selection[i]);
            countUnique(doc.selection[i]);
        }

        return {
            objects: doc.selection.length,
            merged: groups.length,
            unique: uniqueCount
        };
    }

    // ============================================
    // MAIN PROCESSING FUNCTION
    // ============================================

    function processSelectedItems() {
        var tol = Number(valueInput.text);
        var realTol = tol === 0 ? 0 : Math.pow(tol, 1.05);
        var groups = [];
        var gradientItems = [];

        /**
         * Main item processor - handles all item types
         */
        function processItem(item) {
            // Handle groups recursively
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    processItem(item.pageItems[i]);
                }
                return;
            }

            // Handle gradient fills
            if (item.filled && item.fillColor.typename === "GradientColor") {
                if (gradientCheck.value) {
                    gradientItems.push(item);
                    return;
                }
                // If not keeping gradients, extract dominant color
            }

            // Handle compound paths
            if (item.typename === "CompoundPathItem") {
                var colorData = getCompoundPathColor(item);
                if (!colorData) return;

                var rgb = colorData.rgb;
                var key = colorData.key;
                var group = findGroup(rgb, groups, realTol);

                if (group) {
                    group.items.push(item);
                    if (!group.colorMap[key]) {
                        group.colorMap[key] = { count: 0, area: 0, color: rgb };
                    }
                    group.colorMap[key].count++;
                    var a = 0;
                    try { a = Math.abs(item.area); } catch(e) { a = 1; }
                    group.colorMap[key].area += a;
                    if (a > group.maxArea) {
                        group.maxArea = a;
                        group.dominantColor = rgb;
                    }
                } else {
                    var newGroup = {
                        baseColor: rgb,
                        color: rgb,
                        dominantColor: rgb,
                        maxArea: colorData.area,
                        items: [item],
                        colorMap: {}
                    };
                    newGroup.colorMap[key] = { count: 1, area: colorData.area, color: rgb };
                    groups.push(newGroup);
                }
                return;
            }

            // Skip unfilled items
            if (!item.filled) return;

            var fill = item.fillColor;

            // Handle regular gradients (non-compound)
            if (fill.typename === "GradientColor") {
                if (gradientCheck.value) {
                    gradientItems.push(item);
                    return;
                }

                var dominant = getGradientDominantColor(fill);
                if (!dominant) return;

                var group = findGroup(dominant, groups, realTol);
                var key = dominant.r.toFixed(2) + "_" + dominant.g.toFixed(2) + "_" + dominant.b.toFixed(2);

                if (group) {
                    group.items.push(item);
                    if (!group.colorMap[key]) {
                        group.colorMap[key] = { count: 0, area: 0, color: dominant };
                    }
                    group.colorMap[key].count++;
                    var a = 0;
                    try { a = Math.abs(item.area); } catch(e) { a = 1; }
                    group.colorMap[key].area += a;
                    if (a > group.maxArea) {
                        group.maxArea = a;
                        group.dominantColor = dominant;
                    }
                } else {
                    var newGroup = {
                        baseColor: dominant,
                        color: dominant,
                        dominantColor: dominant,
                        maxArea: Math.abs(item.area || 1),
                        items: [item],
                        colorMap: {}
                    };
                    newGroup.colorMap[key] = { 
                        count: 1, 
                        area: Math.abs(item.area || 1), 
                        color: dominant 
                    };
                    groups.push(newGroup);
                }
                return;
            }

            // Handle solid colors
            var data = getColorData(fill);
            var rgb = { r: data.r, g: data.g, b: data.b };
            var key = data.key;
            var group = findGroup(rgb, groups, realTol);

            if (group) {
                group.items.push(item);
                if (!group.colorMap[key]) {
                    group.colorMap[key] = { count: 0, area: 0, color: rgb };
                }
                group.colorMap[key].count++;
                var a = 0;
                try { a = Math.abs(item.area); } catch(e) { a = 1; }
                group.colorMap[key].area += a;
                if (a > group.maxArea) {
                    group.maxArea = a;
                    group.dominantColor = rgb;
                }
            } else {
                var newGroup = {
                    baseColor: rgb,
                    color: rgb,
                    dominantColor: rgb,
                    maxArea: Math.abs(item.area || 1),
                    items: [item],
                    colorMap: {}
                };
                newGroup.colorMap[key] = { 
                    count: 1, 
                    area: Math.abs(item.area || 1), 
                    color: rgb 
                };
                groups.push(newGroup);
            }
        }

        // Process all selected items
        for (var i = 0; i < doc.selection.length; i++) {
            processItem(doc.selection[i]);
        }

        if (groups.length === 0) {
            alert("No colors detected");
            return;
        }

        // ============================================
        // FINALIZE COLOR SELECTION
        // ============================================

        // Select color by area (largest area in group)
        for (var i = 0; i < groups.length; i++) {
            var maxArea = 0;
            var finalColor = null;

            for (var key in groups[i].colorMap) {
                var c = groups[i].colorMap[key];
                if (c.area > maxArea) {
                    maxArea = c.area;
                    finalColor = c.color;
                }
            }

            if (!finalColor) finalColor = groups[i].dominantColor;
            groups[i].color = finalColor;
        }

        // Sort by brightness if enabled
        if (sortCheck.value) {
            groups.sort(function (a, b) {
                return brightness(a.color) - brightness(b.color);
            });
        }

        // ============================================
        // CREATE SWATCHES
        // ============================================

        if (swatchCheck.value) {
            var sg = doc.swatchGroups.add();
            sg.name = "ACSE Colors";

            for (var s = 0; s < groups.length; s++) {
                var c = new RGBColor();
                c.red = groups[s].color.r;
                c.green = groups[s].color.g;
                c.blue = groups[s].color.b;

                if (!swatchExists(doc, groups[s].color)) {
                    var sw = doc.swatches.add();
                    sw.color = c;
                    sg.addSwatch(sw);
                }
            }
        }

        // ============================================
        // CREATE GRADIENT LAYER
        // ============================================

        if (gradientItems.length > 0) {
            var gLayer = doc.layers.add();
            gLayer.name = "Gradient Layer";

            for (var g = 0; g < gradientItems.length; g++) {
                gradientItems[g].duplicate(gLayer);
            }
        }

        // ============================================
        // CREATE COLOR LAYERS
        // ============================================

        for (var k = groups.length - 1; k >= 0; k--) {
            var layer = doc.layers.add();
            var col = groups[k].color;
            layer.name = "Color " + (groups.length - k);

            for (var m = 0; m < groups[k].items.length; m++) {
                groups[k].items[m].duplicate(layer);
            }
        }

        alert("> Done!\nColors: " + groups.length + "\n\n\u00A9 Mostafizar");
        win.close();
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    slider.onChanging = function () {
        updateToleranceUI(slider.value);
    };

    valueInput.onChanging = function () {
        var v = Number(valueInput.text);
        if (!isNaN(v)) updateToleranceUI(v);
    };

    cancelBtn.onClick = function () {
        win.close();
    };

    previewBtn.onClick = function () {
        var result = analyzePreview();
        alert(
            "Preview Result\n\n" +
            "Objects: " + result.objects + "\n" +
            "Unique Colors: " + result.unique + "\n" +
            "Merged Colors (Layers): " + result.merged + "\n" +
            "Reduction: " + (result.unique - result.merged) + "\n" +
            "Tolerance: " + valueInput.text
        );
    };

    runBtn.onClick = function () {
        processSelectedItems();
    };

    updateToleranceUI(0);
    win.show();

})();