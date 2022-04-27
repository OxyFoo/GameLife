import Male_Test from './male_test';

import animIdle from '../animations/idle.json';
import animMuscles from '../animations/muscles.json';

/**
 * @typedef {'male_test'} CharactersName
 * @typedef {'idle'|'muscles'} AnimationsName
 *
 * @typedef {'left_ear'|'left_eye'|'left_eyebrow'|'right_ear'|'right_eye'|'right_eyebrow'|'nose'|'mouth'} PartsFace
 * @typedef {'bust'|'head'|'left_arm'|'left_forearm'|'left_hand'|'right_arm'|'right_forearm'|'right_hand'|'left_thigh'|'left_leg'|'left_foot'|'right_thigh'|'right_leg'|'right_foot'} PartsBody
 * @typedef {PartsFace|PartsBody} PartsName
 */

const CHARACTERS = {
    'male_test': Male_Test
};

const ANIMATIONS = {
    idle: animIdle,
    muscles: animMuscles
};

export { CHARACTERS, ANIMATIONS };