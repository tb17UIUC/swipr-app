const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

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

async function identifySkinTone(
    imagePath,
    cropX,
    cropY,
    cropWidth,
    cropHeight
) {
    const canvas = createCanvas();
    const context = canvas.getContext('2d');
    const image = await loadImage(imagePath);
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    context.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    );
    const imageData = context.getImageData(0, 0, cropWidth, cropHeight);
    const data = imageData.data;

    let totalH = 0;
    let totalS = 0;
    let totalV = 0;
    let skinPixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
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

    const avgH = totalH / skinPixelCount;
    const avgS = totalS / skinPixelCount;
    const avgV = totalV / skinPixelCount;

    return [avgH, avgS, avgV];
}

function colorDistance(hsv1, hsv2) {
    const dh = Math.abs(hsv1.h - hsv2.h);
    const ds = Math.abs(hsv1.s - hsv2.s);
    const dv = Math.abs(hsv1.v - hsv2.v);
    return Math.sqrt(dh * dh + ds * ds + dv * dv);
}

function readClothingColorsFromCSV(csvFilePath) {
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
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

// function matchClothingColors(skinToneHSV, clothingColors) {
//     let matches = [];
//     for (const color of clothingColors) {
//         const distance = colorDistance(skinToneHSV, color);
//         matches.push({ color: color.name, distance: distance });
//     }
//     matches.sort((a, b) => a.distance - b.distance);
//     matches = matches.slice(0, 10);
//     return matches;
// }

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

    return selectedMatches;
}

const imagePath =
    '/Users/pranav/Desktop/swipr/sp24-cs411-team092-AliExpressNoAlawiniExpress/server/Helpers/fag.jpeg';
const cropX = 100;
const cropY = 100;
const cropWidth = 200;
const cropHeight = 200;

const csvFilePath = './colors.csv';
const clothingColors = readClothingColorsFromCSV(csvFilePath);

identifySkinTone(imagePath, cropX, cropY, cropWidth, cropHeight)
    .then((skinToneHSV) => {
        console.log('Average HSV for skin tone:', skinToneHSV);
        const matches = matchClothingColors(
            { h: skinToneHSV[0], s: skinToneHSV[1], v: skinToneHSV[2] },
            clothingColors
        );
        console.log('Clothing colors that match your skin tone:');
        matches.forEach((match, index) => {
            console.log(
                `${index + 1}. ${match.color} - Distance: ${match.distance}`
            );
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

module.exports = identifySkinTone;
