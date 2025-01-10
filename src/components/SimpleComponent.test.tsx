import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SimpleComponent from "./SimpleComponent";

test("renders the simple component", () => {
  render(<SimpleComponent />);
  expect(screen.getByText("Hello from Simple Component")).toBeInTheDocument();
});
