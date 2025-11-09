import { GayatriMantraSession } from "./gayatri-mantra-session";

export class MeditationTimer {
  private gayatriSession: GayatriMantraSession;
  private meditationDuration: number; // in seconds

  constructor(meditationDuration: number) {
    this.gayatriSession = new GayatriMantraSession();
    this.meditationDuration = meditationDuration;
  }

  /**
   * Starts the meditation session by playing Gayatri mantra 11 times,
   * followed by silent meditation for the configured duration.
   */
  public async start(): Promise<void> {
    console.log(
      "app[timer]: 🔈 Starting Gayatri mantra session (11 repetitions)"
    );

    // Get the duration of the Gayatri mantra audio
    const gayatriDuration = await this.gayatriSession.getTotalDuration();
    console.log(
      `app[timer]: Gayatri audio duration: ${gayatriDuration.toFixed(
        1
      )} seconds`
    );

    // Play the mantra 11 times
    await this.gayatriSession.runSession();

    console.log("app[timer]: ✅ Gayatri mantra session completed");
    console.log(
      `app[timer]: Starting silent meditation for ${this.meditationDuration} seconds`
    );

    // Then do silent meditation for the selected duration
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), this.meditationDuration * 1000);
    });

    console.log("app[timer]: ✅ Meditation session completed");
  }

  public async cancel(): Promise<void> {
    await this.gayatriSession.cancel();
  }

  public async cleanup(): Promise<void> {
    await this.gayatriSession.cleanup();
  }

  /**
   * Gets the total session duration (Gayatri audio + meditation time)
   */
  public async getTotalDuration(): Promise<number> {
    const gayatriDuration = await this.gayatriSession.getTotalDuration();
    return gayatriDuration + this.meditationDuration;
  }

  /**
   * Gets just the Gayatri audio duration
   */
  public async getGayatriDuration(): Promise<number> {
    return await this.gayatriSession.getTotalDuration();
  }
}
