/**
 * Vocation utilities for Tibia/OTS
 */

export const VOCATIONS: Record<number, string> = {
  0: 'None',
  1: 'Sorcerer',
  2: 'Druid',
  3: 'Paladin',
  4: 'Knight',
  5: 'Master Sorcerer',
  6: 'Elder Druid',
  7: 'Royal Paladin',
  8: 'Elite Knight',
}

export const VOCATION_COLORS: Record<number, string> = {
  0: 'text-gray-600',
  1: 'text-purple-600',
  2: 'text-green-600',
  3: 'text-yellow-600',
  4: 'text-red-600',
  5: 'text-purple-700',
  6: 'text-green-700',
  7: 'text-yellow-700',
  8: 'text-red-700',
}

export function getVocationName(vocationId: number): string {
  return VOCATIONS[vocationId] || 'Unknown'
}

export function getVocationColor(vocationId: number): string {
  return VOCATION_COLORS[vocationId] || 'text-gray-600'
}

export function isPromoted(vocationId: number): boolean {
  return vocationId >= 5 && vocationId <= 8
}

export function getBaseVocation(vocationId: number): number {
  if (vocationId >= 5 && vocationId <= 8) {
    return vocationId - 4
  }
  return vocationId
}

export function getPromotedVocation(vocationId: number): number {
  if (vocationId >= 1 && vocationId <= 4) {
    return vocationId + 4
  }
  return vocationId
}
