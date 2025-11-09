import { Audio } from "expo-av";

export class AudioActivity {
  private sound: Audio.Sound;
  private isLoaded = false;

  constructor(private uri: number | string) {
    this.sound = new Audio.Sound();
  }

  /**
   * Initialize the audio by loading it (required for getting duration)
   */
  public async initialize() {
    try {
      const audioSource =
        typeof this.uri === "number" ? this.uri : { uri: this.uri };
      await this.sound.loadAsync(audioSource, { shouldPlay: false });
      this.isLoaded = true;
    } catch (err) {
      console.error("Error loading audio:", err);
      this.isLoaded = false;
    }
  }

  public async play() {
    if (!this.isLoaded) {
      try {
        // uri can be a number (from require()) or a string (from URL)
        const audioSource =
          typeof this.uri === "number" ? this.uri : { uri: this.uri };
        await this.sound.loadAsync(audioSource, { shouldPlay: false });
        this.isLoaded = true;
      } catch {
        // Audio already loaded
      }
    }
    await this.sound.setPositionAsync(0);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    console.log("app[audio]: 🔈 Starting audio");
    await this.sound.playAsync();
    return new Promise<void>((resolve) => {
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            console.log("app[audio]: ✅ Finished playing");
            resolve();
          }
        }
      });
    });
  }

  public async cancel() {
    await this.cleanup();
  }

  public async cleanup() {
    await this.sound.stopAsync();
    await this.sound.unloadAsync();
  }

  public async getDuration(): Promise<number> {
    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        return status.durationMillis / 1000; // return in seconds
      }
    } catch (err) {
      console.error("Error getting duration:", err);
    }
    return 0;
  }
}
