const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function rgbToHsv(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        v = max;

    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s, v];
}

function isSkinPixel(r, g, b) {
    let minH = 0,
        maxH = 50;
    let minS = 0.23,
        maxS = 0.68;
    let minR = 95,
        minG = 40,
        minB = 20;

    let [h, s, v] = rgbToHsv(r, g, b);

    if (
        h >= minH &&
        h <= maxH &&
        s >= minS &&
        s <= maxS &&
        r > minR &&
        g > minG &&
        b > minB &&
        r > g &&
        r > b &&
        Math.abs(r - g) > 15
    ) {
        return true;
    } else {
        return false;
    }
}

async function identifySkinTone(base64ImageUri) {
    try {
        if (!base64ImageUri) {
            throw new Error('Base64 image URI is missing or invalid');
        }

        const base64Data = base64ImageUri.replace(
            /^data:image\/\w+;base64,/,
            ''
        );

        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Use sharp to process the image buffer and extract pixel data
        const { data, info } = await sharp(imageBuffer)
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { width, height } = info;
        const channels = info.channels || 3; // Assuming RGB image

        let totalH = 0;
        let totalS = 0;
        let totalV = 0;
        let skinPixelCount = 0;

        // Iterate over the pixel data
        for (let i = 0; i < data.length; i += channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (isSkinPixel(r, g, b)) {
                const [h, s, v] = rgbToHsv(r, g, b);
                totalH += h;
                totalS += s;
                totalV += v;
                skinPixelCount++;
            }
        }

        // Calculate average HSV values for skin pixels
        const avgH = (skinPixelCount > 0 ? totalH / skinPixelCount : 0) / 360;
        const avgS = skinPixelCount > 0 ? totalS / skinPixelCount : 0;
        const avgV = skinPixelCount > 0 ? totalV / skinPixelCount : 0;

        // console.log(avgH, avgS, avgV);

        return [avgH, avgS, avgV];
    } catch (error) {
        console.error('Error identifying skin tone:', error);
        return [0, 0, 0];
    }
}

function colorDistance(hsv1, hsv2) {
    const dh = Math.abs(hsv1.h - hsv2.h);
    const ds = Math.abs(hsv1.s - hsv2.s);
    const dv = Math.abs(hsv1.v - hsv2.v);
    return Math.sqrt(dh * dh + ds * ds + dv * dv);
}

function readClothingColorsFromCSV(csvFilePath) {
    const absolutePath = path.join(__dirname, csvFilePath);

    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    const clothingColors = [];
    lines.forEach((line, index) => {
        if (index === 0) return;
        const [name, hex, h, s, v] = line.trim().split(',');
        clothingColors.push({
            name,
            hex,
            h: parseFloat(h),
            s: parseFloat(s),
            v: parseFloat(v),
        });
    });

    return clothingColors;
}

function matchClothingColors(skinToneHSV, clothingColors) {
    let matches = [];

    for (const color of clothingColors) {
        const distance = colorDistance(skinToneHSV, color);
        matches.push({ color: color.name, distance: distance, hsv: color });
    }

    matches.sort((a, b) => a.distance - b.distance);

    let selectedMatches = [];
    let prevDistance = -1;
    for (const match of matches) {
        if (
            selectedMatches.length === 0 ||
            match.distance - prevDistance >= 0.03
        ) {
            selectedMatches.push(match);
            prevDistance = match.distance;
        }
        if (selectedMatches.length >= 100) break;
    }

    // console.log(selectedMatches);

    return selectedMatches;
}

module.exports = {
    identifySkinTone,
    readClothingColorsFromCSV,
    matchClothingColors,
};
