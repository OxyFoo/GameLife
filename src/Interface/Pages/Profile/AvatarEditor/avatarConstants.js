/**
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/avatar-factory').AvatarCharacterProps} AvatarCharacterProps
 * @typedef {import('./back').SlotType} SlotType
 */

/** Available avatar body types */
/** @type {AvatarName[]} */
export const AVATAR_BODIES = ['human_00', 'human_01'];

// TODO: Available body colors should come from backend / user profile / db ?
/** Available body colors */
export const BODY_COLORS = ['#FFF5E1', '#FFDAB9', '#E8B89A', '#D1A684', '#B5866B', '#8D5524', '#5C4033', '#3B2414'];

/**
 * Avatar position and scale configuration for each slot type
 * @type {{ [key in SlotType]: { pos: AvatarCharacterProps['position'], scale: AvatarCharacterProps['scale'] } }}
 */
export const AVATAR_POSITION_CONFIG = {
    avatar: {
        pos: { x: 0, y: -0.7 },
        scale: 2
    },
    bodyColor: {
        pos: { x: 0, y: 0 },
        scale: 1
    },
    hair: {
        pos: { x: 0, y: -3.5 },
        scale: 5
    },
    top: {
        pos: { x: 0, y: -1 },
        scale: 3
    },
    bottom: {
        pos: { x: 0, y: 0.5 },
        scale: 2
    },
    shoes: {
        pos: { x: 0, y: 1.6 },
        scale: 2.5
    }
};
