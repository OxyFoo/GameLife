/**
 * @typedef {{ date: string, value: number }} ChartDataPoint
 */

/**
 * LTTB (Largest Triangle Three Buckets) downsampling algorithm
 * Preserves visual shape while reducing number of points
 * @param {ChartDataPoint[]} data - Original data points
 * @param {number} threshold - Target number of points
 * @returns {ChartDataPoint[]} - Downsampled data
 */
function lttbDownsample(data, threshold) {
    if (data.length <= threshold || threshold <= 2) {
        return data;
    }

    const sampled = [];
    const bucketSize = (data.length - 2) / (threshold - 2);

    // Always keep first point
    sampled.push(data[0]);

    let a = 0; // Initially a is the first point in the triangle

    for (let i = 0; i < threshold - 2; i++) {
        // Calculate point average for next bucket (for triangle's area)
        let avgX = 0;
        let avgY = 0;

        const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
        const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, data.length);
        const avgRangeLength = avgRangeEnd - avgRangeStart;

        for (let j = avgRangeStart; j < avgRangeEnd; j++) {
            avgX += j;
            avgY += data[j].value;
        }
        avgX /= avgRangeLength;
        avgY /= avgRangeLength;

        // Get the range for this bucket
        const rangeOffs = Math.floor(i * bucketSize) + 1;
        const rangeTo = Math.floor((i + 1) * bucketSize) + 1;

        // Point a (previous selected point)
        const pointAX = a;
        const pointAY = data[a].value;

        let maxArea = -1;
        let maxAreaPoint = rangeOffs;

        // Find point in bucket with largest triangle area
        for (let j = rangeOffs; j < rangeTo; j++) {
            // Calculate triangle area over three buckets
            const area =
                Math.abs((pointAX - avgX) * (data[j].value - pointAY) - (pointAX - j) * (avgY - pointAY)) * 0.5;

            if (area > maxArea) {
                maxArea = area;
                maxAreaPoint = j;
            }
        }

        sampled.push(data[maxAreaPoint]);
        a = maxAreaPoint; // This point is the next a
    }

    // Always keep last point
    sampled.push(data[data.length - 1]);

    return sampled;
}

export { lttbDownsample };
