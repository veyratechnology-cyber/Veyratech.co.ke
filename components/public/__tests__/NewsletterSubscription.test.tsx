/**
 * Newsletter Subscription Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterSubscription from '../NewsletterSubscription';

// Mock fetch
global.fetch = jest.fn();

describe('NewsletterSubscription Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render subscription form', () => {
    render(<NewsletterSubscription />);
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/M-Pesa Phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe - KSH 100/i })).toBeInTheDocument();
  });

  it('should show error when form is submitted empty', async () => {
    render(<NewsletterSubscription />);
    
    const submitButton = screen.getByRole('button', { name: /Subscribe - KSH 100/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please provide both email and phone number/i)).toBeInTheDocument();
    });
  });

  it('should handle successful subscription', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        subscriptionId: 'test-123',
      }),
    });

    render(<NewsletterSubscription />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const phoneInput = screen.getByPlaceholderText(/M-Pesa Phone/i);
    const submitButton = screen.getByRole('button', { name: /Subscribe - KSH 100/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(phoneInput, '0712345678');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Check your phone/i)).toBeInTheDocument();
    });
  });

  it('should handle subscription error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Payment failed',
      }),
    });

    render(<NewsletterSubscription />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const phoneInput = screen.getByPlaceholderText(/M-Pesa Phone/i);
    const submitButton = screen.getByRole('button', { name: /Subscribe - KSH 100/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(phoneInput, '0712345678');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Payment failed/i)).toBeInTheDocument();
    });
  });

  it('should display info cards', () => {
    render(<NewsletterSubscription />);
    
    expect(screen.getByText('What You Get')).toBeInTheDocument();
    expect(screen.getByText('Payment Info')).toBeInTheDocument();
    expect(screen.getByText(/Weekly expert insights/i)).toBeInTheDocument();
    expect(screen.getByText(/One-time KSH 100/i)).toBeInTheDocument();
  });
});
