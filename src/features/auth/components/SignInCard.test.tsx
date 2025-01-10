import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignInCard from "./SignInCard";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignInCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders the component correctly", () => {
    render(
      <SignInCard
        setFlow={jest.fn()}
        signIn={jest.fn()}
        signInWithGithub={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("updates email and password state on input change", () => {
    render(
      <SignInCard
        setFlow={jest.fn()}
        signIn={jest.fn()}
        signInWithGithub={jest.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls signIn and redirects on successful sign in", async () => {
    const mockSignIn = jest
      .fn()
      .mockResolvedValueOnce({ user: {}, session: {} });
    render(
      <SignInCard
        setFlow={jest.fn()}
        signIn={mockSignIn}
        signInWithGithub={jest.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error message on failed sign in", async () => {
    const mockSignIn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Sign in failed"));
    render(
      <SignInCard
        setFlow={jest.fn()}
        signIn={mockSignIn}
        signInWithGithub={jest.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to authenticate: Error: Sign in failed")
      ).toBeInTheDocument();
    });
  });

  it("disables the button while loading", async () => {
    const mockSignIn = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
    render(
      <SignInCard
        setFlow={jest.fn()}
        signIn={mockSignIn}
        signInWithGithub={jest.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    expect(signInButton).toBeDisabled();
    await waitFor(() => {
      expect(signInButton).not.toBeDisabled();
    });
  });

  it("calls setFlow with signup when the signup link is clicked", () => {
    const mockSetFlow = jest.fn();
    render(
      <SignInCard
        setFlow={mockSetFlow}
        signIn={jest.fn()}
        signInWithGithub={jest.fn()}
      />
    );

    const signUpLink = screen.getByText("Sign up");
    fireEvent.click(signUpLink);

    expect(mockSetFlow).toHaveBeenCalledTimes(1);
    expect(mockSetFlow).toHaveBeenCalledWith({ flow: "signup" });
  });
});
