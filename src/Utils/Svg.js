/**
 * Generates a smooth SVG path with rounded corners (like border-radius)
 * The curve stays within the bounds defined by the points - no overshoot
 * @param {{ x: number, y: number }[]} points - Array of points
 * @param {number} smoothness - Corner radius factor (0 = sharp corners, higher = more rounded)
 * @returns {string} SVG path string
 */
function generateSmoothPath(points, smoothness) {
    if (points.length < 2) return '';
    if (points.length === 2) {
        return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;
    }

    // Start at first point
    let path = `M${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Calculate distances to previous and next points
        const distPrev = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
        const distNext = Math.sqrt((next.x - curr.x) ** 2 + (next.y - curr.y) ** 2);

        // Radius is limited by half the distance to neighbors
        const maxRadius = Math.min(distPrev, distNext) * 0.5;
        const radius = maxRadius * Math.min(smoothness, 1);

        // Direction vectors (normalized)
        const dirPrevX = (curr.x - prev.x) / distPrev;
        const dirPrevY = (curr.y - prev.y) / distPrev;
        const dirNextX = (next.x - curr.x) / distNext;
        const dirNextY = (next.y - curr.y) / distNext;

        // Points where the rounding starts and ends
        const startX = curr.x - dirPrevX * radius;
        const startY = curr.y - dirPrevY * radius;
        const endX = curr.x + dirNextX * radius;
        const endY = curr.y + dirNextY * radius;

        // Line to the start of the curve, then quadratic bezier to round the corner
        path += ` L${startX},${startY}`;
        path += ` Q${curr.x},${curr.y} ${endX},${endY}`;
    }

    // Line to the last point
    const last = points[points.length - 1];
    path += ` L${last.x},${last.y}`;

    return path;
}

export { generateSmoothPath };
