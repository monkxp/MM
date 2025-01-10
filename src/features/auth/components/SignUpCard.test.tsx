import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpCard from "./SignUpCard";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignUpCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders the component correctly", () => {
    render(<SignUpCard setFlow={jest.fn()} signUp={jest.fn()} />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button").textContent).toBe("Sign Up");
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  it("updates email, password, and confirm password state on input change", () => {
    render(<SignUpCard setFlow={jest.fn()} signUp={jest.fn()} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("displays an error message when passwords do not match", async () => {
    render(<SignUpCard setFlow={jest.fn()} signUp={jest.fn()} />);

    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("calls signUp and redirects on successful sign up", async () => {
    const mockSignUp = jest
      .fn()
      .mockResolvedValueOnce({ user: {}, session: {} });
    render(<SignUpCard setFlow={jest.fn()} signUp={mockSignUp} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);

    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockSignUp).toHaveBeenCalledWith("test@example.com", "password123");

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error message on failed sign up", async () => {
    const mockSignUp = jest
      .fn()
      .mockRejectedValueOnce(new Error("Sign up failed"));
    render(<SignUpCard setFlow={jest.fn()} signUp={mockSignUp} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to sign up: Error: Sign up failed")
      ).toBeInTheDocument();
    });
  });

  it("disables the button while loading", async () => {
    const mockSignUp = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(<SignUpCard setFlow={jest.fn()} signUp={mockSignUp} />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);

    expect(signUpButton).toBeDisabled();
    await waitFor(() => {
      expect(signUpButton).not.toBeDisabled();
    });
  });
  it("calls setFlow with signin when the sign in link is clicked", () => {
    const mockSetFlow = jest.fn();
    render(<SignUpCard setFlow={mockSetFlow} signUp={jest.fn()} />);

    const signInLink = screen.getByText("Sign in");
    fireEvent.click(signInLink);

    expect(mockSetFlow).toHaveBeenCalledTimes(1);
    expect(mockSetFlow).toHaveBeenCalledWith({ flow: "signin" });
  });
});
