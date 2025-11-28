namespace server.Services.PaymentMethodLogic;

/// <summary>
/// Interface for payment method-specific validation logic
/// </summary>
public interface IPaymentMethodValidator
{
    /// <summary>
    /// Check if this validator handles the given payment method
    /// </summary>
    bool CanHandle(string paymentMethod, decimal amount);
    
    /// <summary>
    /// Validate if document can be generated
    /// </summary>
    bool CanGenerateDocument(string status, bool isPaymentVerified, bool isDocumentReviewed);
    
    /// <summary>
    /// Get the new status after payment verification
    /// </summary>
    string GetStatusAfterPaymentVerification(string currentStatus);
    
    /// <summary>
    /// Get the status history entry name for payment verification
    /// </summary>
    string GetPaymentVerificationStatusHistoryName(string currentStatus);
    
    /// <summary>
    /// Get error message when document cannot be generated
    /// </summary>
    string GetCannotGenerateErrorMessage();
}
