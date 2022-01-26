import { Platform } from "react-native";
import SoundPlayer from "react-native-sound-player";

import user from "../Managers/UserManager";

function PlayStartSound() {
    // TODO - IOS
    if (Platform.OS === "android") {
        try {
            SoundPlayer.playSoundFile('appli', 'mp3');
        } catch (e) {
            user.interface.console.AddLog('warn', 'Start sound: Cannot play the sound file');
        }
    }
}

export { PlayStartSound };