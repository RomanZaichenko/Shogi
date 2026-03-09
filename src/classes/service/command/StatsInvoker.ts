import StorageCommand from "./StorageCommand.ts";

class StatsInvoker {
  private statsCommand!: StorageCommand;

  setCommand(command: StorageCommand): void {
    this.statsCommand = command;
  }

  executeStorageOperation(): void {
    this.statsCommand.execute();
  }
}

export default StatsInvoker;