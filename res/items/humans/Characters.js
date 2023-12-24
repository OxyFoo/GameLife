import Male_01 from './male/skin_01';
import Female_01 from './female/skin_01';

import animDefaultMale from '../animations/default_male.json';
import animDefaultFemale from '../animations/default_female.json';
import animIdle from '../animations/idle.json';
import animMuscles from '../animations/muscles.json';

/**
 * @typedef {'skin_01'} CharactersName
 * @typedef {'defaultMale'|'defaultFemale'|'idle'|'muscles'} AnimationsName
 *
 * @typedef {'left_ear'|'left_eye'|'left_eyebrow'|'right_ear'|'right_eye'|'right_eyebrow'|'nose'|'mouth'} PartsFace
 * @typedef {'bust'|'head'|'left_arm'|'left_forearm'|'left_hand'|'right_arm'|'right_forearm'|'right_hand'|'left_thigh'|'left_leg'|'left_foot'|'right_thigh'|'right_leg'|'right_foot'} PartsBody
 * @typedef {PartsFace|PartsBody} PartsName
 * 
 * @typedef {'MALE'|'FEMALE'} Sexes
 */

const CHARACTERS = {
    MALE: {
        skin_01: Male_01
    },
    FEMALE: {
        skin_01: Female_01
    }
};

const ANIMATIONS = {
    defaultMale: animDefaultMale,
    defaultFemale: animDefaultFemale,
    idle: animIdle,
    muscles: animMuscles
};

const COLORS = [
    '#f3e4d1',
    '#f2d2bb',
    '#d5a283',
    '#bc9665',
    '#b5956f',
    '#6b3d1c'
];

export { CHARACTERS, ANIMATIONS, COLORS };
