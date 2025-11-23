namespace server.DTOs.Documents
{
    public class DocumentResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public List<string> Requirements { get; set; } = new List<string>();
        public required string Status { get; set; }
        public required string ProcessingTime { get; set; }
        public int TotalRequests { get; set; }
        public required string LastModified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
