/**
 * 计算指定分页的正文水平位移。
 * 直接位移正文可绕过 scrollLeft 最大值钳制，确保奇数栏末页不重复前一栏。
 */
export function calculateSpreadOffset(spread: number, spreadStep: number): number {
    if (spread <= 0) return 0
    return -Math.max(0, spread) * Math.max(1, spreadStep)
}
