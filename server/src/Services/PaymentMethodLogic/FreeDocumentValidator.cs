namespace server.Services.PaymentMethodLogic;

/// <summary>
/// Payment method validator for free documents (amount = 0)
/// 
/// Workflow:
/// 1. Submit request → "pending"
/// 2. Approve documents → "approved"
/// 3. Generate document → "processing"
/// </summary>
public class FreeDocumentValidator : IPaymentMethodValidator
{
    public bool CanHandle(string paymentMethod, decimal amount)
    {
        return amount == 0;
    }

    public bool CanGenerateDocument(string status, bool isPaymentVerified, bool isDocumentReviewed)
    {
        // Free documents can be generated when status is "approved" or "processing"
        return status == "approved" || status == "processing";
    }

    public string GetStatusAfterPaymentVerification(string currentStatus)
    {
        // Free documents don't have payment verification
        return currentStatus;
    }

    public string GetPaymentVerificationStatusHistoryName(string currentStatus)
    {
        // Not applicable for free documents
        return "payment_not_applicable";
    }

    public string GetCannotGenerateErrorMessage()
    {
        return "Free document requests must be in 'approved' or 'processing' status to generate document";
    }
}
