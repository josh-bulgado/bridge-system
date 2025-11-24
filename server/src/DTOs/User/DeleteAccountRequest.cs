using System.ComponentModel.DataAnnotations;

namespace server.DTOs.User
{
    public class DeleteAccountRequest
    {
        /// <summary>
        /// Password for local users (required for non-Google users)
        /// </summary>
        public string? Password { get; set; }

        /// <summary>
        /// Email confirmation - user must type their email to confirm
        /// </summary>
        [Required(ErrorMessage = "Email confirmation is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string EmailConfirmation { get; set; }

        /// <summary>
        /// Confirmation text - user must type "DELETE" to confirm
        /// </summary>
        [Required(ErrorMessage = "Confirmation text is required")]
        public required string ConfirmationText { get; set; }
    }
}
