import { Platform } from "react-native";
import SoundPlayer from "react-native-sound-player";

function PlayStartSound() {
    // TODO - IOS
    if (Platform.OS === "android") {
        try {
            SoundPlayer.playSoundFile('appli', 'mp3');
        } catch (e) {
            console.warn('Cannot play the sound file');
        }
    }
}

export { PlayStartSound };