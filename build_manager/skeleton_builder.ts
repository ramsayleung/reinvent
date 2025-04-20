export abstract class SkeletonBuilder {
  protected configFilePath: string;
  constructor(configFilePath: string) {
    this.configFilePath = configFilePath;
  }

  build() {
    this.loadConfig();
    this.buildGraph();
    this.checkCycles();
    this.run();
  }

  abstract loadConfig();

  abstract buildGraph();

  abstract checkCycles();

  abstract run();
}
