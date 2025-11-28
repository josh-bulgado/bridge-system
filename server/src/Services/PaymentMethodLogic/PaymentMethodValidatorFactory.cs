namespace server.Services.PaymentMethodLogic;

/// <summary>
/// Factory for creating payment method validators
/// </summary>
public class PaymentMethodValidatorFactory
{
    private static readonly List<IPaymentMethodValidator> _validators = new()
    {
        new FreeDocumentValidator(),
        new CashOnPickupValidator(),
        new GCashOnlineValidator()
    };

    /// <summary>
    /// Get the appropriate validator for the given payment method and amount
    /// </summary>
    public static IPaymentMethodValidator GetValidator(string paymentMethod, decimal amount)
    {
        var validator = _validators.FirstOrDefault(v => v.CanHandle(paymentMethod, amount));
        
        if (validator == null)
        {
            throw new InvalidOperationException($"No validator found for payment method: {paymentMethod}, amount: {amount}");
        }
        
        return validator;
    }

    /// <summary>
    /// Check if document can be generated
    /// </summary>
    public static bool CanGenerateDocument(
        string paymentMethod, 
        decimal amount, 
        string status, 
        bool isPaymentVerified, 
        bool isDocumentReviewed)
    {
        var validator = GetValidator(paymentMethod, amount);
        return validator.CanGenerateDocument(status, isPaymentVerified, isDocumentReviewed);
    }

    /// <summary>
    /// Get the new status after payment verification
    /// </summary>
    public static string GetStatusAfterPaymentVerification(
        string paymentMethod, 
        decimal amount, 
        string currentStatus)
    {
        var validator = GetValidator(paymentMethod, amount);
        return validator.GetStatusAfterPaymentVerification(currentStatus);
    }

    /// <summary>
    /// Get the status history entry name for payment verification
    /// </summary>
    public static string GetPaymentVerificationStatusHistoryName(
        string paymentMethod, 
        decimal amount, 
        string currentStatus)
    {
        var validator = GetValidator(paymentMethod, amount);
        return validator.GetPaymentVerificationStatusHistoryName(currentStatus);
    }

    /// <summary>
    /// Get error message when document cannot be generated
    /// </summary>
    public static string GetCannotGenerateErrorMessage(string paymentMethod, decimal amount)
    {
        var validator = GetValidator(paymentMethod, amount);
        return validator.GetCannotGenerateErrorMessage();
    }
}
