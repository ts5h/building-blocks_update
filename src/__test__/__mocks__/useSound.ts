jest.mock("../../../store/global/Sound", () => ({
  useSound: jest.fn(() => ({
    startPlaying: jest.fn(),
    stopPlaying: jest.fn(),
  })),
}));
