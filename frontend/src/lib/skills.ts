/**
 * Skill utilities for Tibia/OTS
 */

export const SKILLS = [
  { name: 'fist', label: 'Fist Fighting', icon: '👊' },
  { name: 'club', label: 'Club Fighting', icon: '🔨' },
  { name: 'sword', label: 'Sword Fighting', icon: '⚔️' },
  { name: 'axe', label: 'Axe Fighting', icon: '🪓' },
  { name: 'dist', label: 'Distance Fighting', icon: '🏹' },
  { name: 'shielding', label: 'Shielding', icon: '🛡️' },
  { name: 'fishing', label: 'Fishing', icon: '🎣' },
]

export function getSkillName(skillId: string): string {
  const skill = SKILLS.find((s) => s.name === skillId)
  return skill?.label || 'Unknown'
}

export function getSkillIcon(skillId: string): string {
  const skill = SKILLS.find((s) => s.name === skillId)
  return skill?.icon || '❓'
}
