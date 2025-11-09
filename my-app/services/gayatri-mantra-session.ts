import { AudioActivity } from "./audio-activity";

const GAYATRI_REPETITIONS = 11;

export class GayatriMantraSession {
  private audioActivity: AudioActivity;

  constructor() {
    const audioUri = require("@/assets/images/gayatri-mantra.mp3");
    this.audioActivity = new AudioActivity(audioUri);
  }

  /**
   * Plays the Gayatri mantra 11 times
   */
  public async runSession() {
    for (let i = 0; i < GAYATRI_REPETITIONS; i++) {
      console.log(`Playing Gayatri mantra ${i + 1}/${GAYATRI_REPETITIONS}`);
      await this.audioActivity.play();
    }
  }

  /**
   * Initializes the audio (loads it) so we can get accurate duration
   */
  public async initialize(): Promise<void> {
    await this.audioActivity.initialize();
  }

  /**
   * Gets the total duration of the session by measuring one play of the audio
   * and multiplying by 11 (unconfigurable)
   */
  public async getTotalDuration(): Promise<number> {
    // Make sure audio is loaded
    await this.initialize();
    // Now get the actual duration
    const singleDuration = await this.audioActivity.getDuration();
    console.log(`Gayatri single duration: ${singleDuration} seconds`);
    const totalDuration = singleDuration * GAYATRI_REPETITIONS;
    console.log(`Gayatri total duration (11x): ${totalDuration} seconds`);
    return totalDuration;
  }

  public async cancel() {
    await this.audioActivity.cancel();
  }

  public async cleanup() {
    await this.audioActivity.cleanup();
  }
}
