namespace server.Services.PaymentMethodLogic;

/// <summary>
/// Payment method validator for cash on pickup (walk-in) payments
/// 
/// Workflow:
/// 1. Submit request → "pending"
/// 2. Approve documents → "approved"
/// 3. Resident arrives, verify payment → "approved" (status stays same)
/// 4. Generate document → "processing"
/// 
/// Key Design:
/// - Status remains "approved" after both document approval and payment verification
/// - Payment verification is tracked via PaymentVerifiedAt field, not status change
/// - Generate button appears only after BOTH documents approved AND payment verified
/// </summary>
public class CashOnPickupValidator : IPaymentMethodValidator
{
    public bool CanHandle(string paymentMethod, decimal amount)
    {
        return paymentMethod == "walkin" && amount > 0;
    }

    public bool CanGenerateDocument(string status, bool isPaymentVerified, bool isDocumentReviewed)
    {
        // Cash on pickup requires:
        // - Status is "approved" (documents approved)
        // - Payment is verified (PaymentVerifiedAt is set)
        return (status == "approved" && isPaymentVerified) || status == "processing";
    }

    public string GetStatusAfterPaymentVerification(string currentStatus)
    {
        // For cash on pickup with status "approved": Keep status as "approved"
        // This allows the generate condition to work correctly
        if (currentStatus == "approved")
        {
            return "approved";
        }
        
        // For pending status (edge case): Change to payment_verified
        return "payment_verified";
    }

    public string GetPaymentVerificationStatusHistoryName(string currentStatus)
    {
        // Use "payment_received" to distinguish from GCash "payment_verified"
        return currentStatus == "approved" ? "payment_received" : "payment_verified";
    }

    public string GetCannotGenerateErrorMessage()
    {
        return "Cash on pickup requests require documents to be approved and payment to be verified before generating document";
    }
}
