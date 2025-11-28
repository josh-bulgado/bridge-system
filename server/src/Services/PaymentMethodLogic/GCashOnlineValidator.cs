namespace server.Services.PaymentMethodLogic;

/// <summary>
/// Payment method validator for GCash/online payments
/// 
/// Workflow:
/// 1. Submit request with payment proof → "pending"
/// 2. Verify payment → "payment_verified"
/// 3. Approve documents → "payment_verified" (status stays same)
/// 4. Generate document → "processing"
/// 
/// Key Design:
/// - Payment must be verified BEFORE documents can be reviewed
/// - Status changes to "payment_verified" and remains there after document approval
/// - Document approval is tracked via ReviewedAt field
/// - Generate button appears only after BOTH payment verified AND documents approved
/// </summary>
public class GCashOnlineValidator : IPaymentMethodValidator
{
    public bool CanHandle(string paymentMethod, decimal amount)
    {
        return paymentMethod == "online" && amount > 0;
    }

    public bool CanGenerateDocument(string status, bool isPaymentVerified, bool isDocumentReviewed)
    {
        // GCash/online requires:
        // - Status is "payment_verified" (payment verified, possibly docs approved too)
        // - Documents are reviewed (ReviewedAt is set)
        return (status == "payment_verified" && isDocumentReviewed) || status == "processing";
    }

    public string GetStatusAfterPaymentVerification(string currentStatus)
    {
        // GCash/online payment always changes to "payment_verified"
        return "payment_verified";
    }

    public string GetPaymentVerificationStatusHistoryName(string currentStatus)
    {
        // Always use "payment_verified" for GCash
        return "payment_verified";
    }

    public string GetCannotGenerateErrorMessage()
    {
        return "Online payment requests must be in 'payment_verified' or 'processing' status to generate document. Please verify payment first.";
    }
}
