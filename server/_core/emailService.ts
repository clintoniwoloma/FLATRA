/**
 * Email Notification Service
 * Sends email notifications for escrow and transaction events
 */

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

/**
 * Send email notification
 * In production, integrate with SendGrid, Resend, or similar service
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // In production, use a real email service like SendGrid, Resend, or AWS SES
    // For now, we'll log the email and return success
    console.log(`📧 Email sent to ${options.to}:`, {
      subject: options.subject,
      template: options.template,
      data: options.data,
    });

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}

/**
 * Send escrow created notification
 */
export async function sendEscrowCreatedEmail(
  buyerEmail: string,
  sellerEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
  }
): Promise<void> {
  // Send to seller
  await sendEmail({
    to: sellerEmail,
    subject: `New Escrow Created: ${escrowData.title}`,
    template: 'escrow_created',
    data: {
      sellerName: escrowData.sellerName,
      buyerName: escrowData.buyerName,
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send escrow funded notification
 */
export async function sendEscrowFundedEmail(
  sellerEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
  }
): Promise<void> {
  await sendEmail({
    to: sellerEmail,
    subject: `Escrow Funded: ${escrowData.title}`,
    template: 'escrow_funded',
    data: {
      sellerName: escrowData.sellerName,
      buyerName: escrowData.buyerName,
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send escrow accepted notification
 */
export async function sendEscrowAcceptedEmail(
  buyerEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
  }
): Promise<void> {
  await sendEmail({
    to: buyerEmail,
    subject: `Escrow Accepted: ${escrowData.title}`,
    template: 'escrow_accepted',
    data: {
      buyerName: escrowData.buyerName,
      sellerName: escrowData.sellerName,
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send escrow delivered notification
 */
export async function sendEscrowDeliveredEmail(
  buyerEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
  }
): Promise<void> {
  await sendEmail({
    to: buyerEmail,
    subject: `Delivery Confirmed: ${escrowData.title}`,
    template: 'escrow_delivered',
    data: {
      buyerName: escrowData.buyerName,
      sellerName: escrowData.sellerName,
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send escrow released notification
 */
export async function sendEscrowReleasedEmail(
  sellerEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
  }
): Promise<void> {
  await sendEmail({
    to: sellerEmail,
    subject: `Funds Released: ${escrowData.title}`,
    template: 'escrow_released',
    data: {
      sellerName: escrowData.sellerName,
      buyerName: escrowData.buyerName,
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send dispute opened notification
 */
export async function sendDisputeOpenedEmail(
  recipientEmail: string,
  escrowData: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    buyerName: string;
    sellerName: string;
    reason: string;
  }
): Promise<void> {
  await sendEmail({
    to: recipientEmail,
    subject: `Dispute Opened: ${escrowData.title}`,
    template: 'dispute_opened',
    data: {
      title: escrowData.title,
      amount: escrowData.amount,
      currency: escrowData.currency,
      buyerName: escrowData.buyerName,
      sellerName: escrowData.sellerName,
      reason: escrowData.reason,
      escrowId: escrowData.id,
      actionUrl: `https://flatra.app/escrow/${escrowData.id}`,
    },
  });
}

/**
 * Send transaction notification
 */
export async function sendTransactionEmail(
  recipientEmail: string,
  transactionData: {
    type: 'send' | 'receive';
    amount: string;
    currency: string;
    counterparty: string;
    description?: string;
  }
): Promise<void> {
  const subject =
    transactionData.type === 'send'
      ? `Payment Sent: ${transactionData.amount} ${transactionData.currency}`
      : `Payment Received: ${transactionData.amount} ${transactionData.currency}`;

  await sendEmail({
    to: recipientEmail,
    subject,
    template: `transaction_${transactionData.type}`,
    data: {
      type: transactionData.type,
      amount: transactionData.amount,
      currency: transactionData.currency,
      counterparty: transactionData.counterparty,
      description: transactionData.description,
    },
  });
}
