export const resizeCanvas = (canvas, multiplier) => {
    multiplier = multiplier || 1;
    let width = canvas.clientWidth * multiplier | 0;
    let height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}