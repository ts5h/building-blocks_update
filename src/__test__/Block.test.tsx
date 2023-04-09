import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useSound } from "../store/global/Sound";
import { Block } from "../components/Block";

jest.mock("../store/global/Sound", () => ({
  useSound: jest.fn().mockReturnValue({
    startPlaying: jest.fn(),
    stopPlaying: jest.fn(),
  }),
}));

describe("Block component", () => {
  const defaultProps = {
    id: 1,
    width: 50,
    height: 50,
    x: 100,
    y: 100,
    z: 1,
    color: "#000",
    topZ: 2,
    current: null,
    setCurrentElement: jest.fn(),
  };

  it("renders the component with props", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    expect(block).toBeInTheDocument();
    expect(block.style.width).toBe("50px");
    expect(block.style.height).toBe("50px");
    expect(block.style.left).toBe("100px");
    expect(block.style.top).toBe("100px");
    expect(block.style.zIndex).toBe("1");
    expect(block.style.backgroundColor).toBe("rgb(0, 0, 0)");
    expect(block.textContent).toBe("1");
  });

  it("sets the current element when clicked on desktop", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    fireEvent.mouseDown(block);
    expect(defaultProps.setCurrentElement).toHaveBeenCalledWith(true, block);
  });

  it("plays sound when clicked on desktop", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    const { startPlaying } = useSound();
    fireEvent.mouseDown(block);
    expect(startPlaying).toHaveBeenCalled();
  });

  it("sets the current element when touched on mobile", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    fireEvent.touchStart(block);
    expect(defaultProps.setCurrentElement).toHaveBeenCalledWith(true, block);
  });

  it("plays sound when touched on mobile", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    const { startPlaying } = useSound();
    fireEvent.touchStart(block);
    expect(startPlaying).toHaveBeenCalled();
  });

  it("stops playing sound when mouseup outside the block on desktop", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    const { stopPlaying } = useSound();
    fireEvent.mouseDown(block);
    fireEvent.mouseUp(document);
    expect(stopPlaying).toHaveBeenCalled();
  });

  it("stops playing sound when touchend outside the block on mobile", () => {
    const { getByRole } = render(<Block {...defaultProps} />);
    const block = getByRole("button");
    const { stopPlaying } = useSound();
    fireEvent.touchStart(block);
    fireEvent.touchEnd(document);
    expect(stopPlaying).toHaveBeenCalled();
  });
});
