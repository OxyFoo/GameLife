import Male_Test from './male_test';

import animIdle from '../animations/muscles.json';
import animMuscles from '../animations/muscles.json';

/**
 * @typedef {'male_test'} CharactersName
 * @typedef {'idle'|'muscles'} AnimationsName
 *
 * @typedef PartsName
 * @property {{rX: Number, rY: Number, rZ: Number}} bust
 * @property {{rX: Number, rY: Number, rZ: Number}} head
 * @property {{rX: Number, rY: Number, rZ: Number}} left_arm
 * @property {{rX: Number, rY: Number, rZ: Number}} left_forearm
 * @property {{rX: Number, rY: Number, rZ: Number}} left_hand
 * @property {{rX: Number, rY: Number, rZ: Number}} right_arm
 * @property {{rX: Number, rY: Number, rZ: Number}} right_forearm
 * @property {{rX: Number, rY: Number, rZ: Number}} right_hand
 * @property {{rX: Number, rY: Number, rZ: Number}} left_thigh
 * @property {{rX: Number, rY: Number, rZ: Number}} left_leg
 * @property {{rX: Number, rY: Number, rZ: Number}} left_foot
 * @property {{rX: Number, rY: Number, rZ: Number}} right_thigh
 * @property {{rX: Number, rY: Number, rZ: Number}} right_leg
 * @property {{rX: Number, rY: Number, rZ: Number}} right_foot
 */

const CHARACTERS = {
    'male_test': Male_Test
};

const ANIMATIONS = {
    idle: animIdle,
    muscles: animMuscles
};

export { CHARACTERS, ANIMATIONS };