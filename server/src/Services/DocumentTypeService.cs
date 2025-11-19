using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class DocumentTypeService
    {
        private readonly IMongoCollection<DocumentType> _documentTypes;

        public DocumentTypeService(MongoDBContext context)
        {
            _documentTypes = context.GetCollection<DocumentType>("documentTypes");
        }

        // Get all document types
        public async Task<List<DocumentType>> GetAllAsync() =>
            await _documentTypes.Find(_ => true)
                .SortBy(dt => dt.Name)
                .ToListAsync();

        // Get active document types only
        public async Task<List<DocumentType>> GetActiveAsync() =>
            await _documentTypes.Find(dt => dt.IsActive)
                .SortBy(dt => dt.Name)
                .ToListAsync();

        // Get document type by ID
        public async Task<DocumentType?> GetByIdAsync(string id) =>
            await _documentTypes.Find(dt => dt.Id == id).FirstOrDefaultAsync();

        // Get document type by code
        public async Task<DocumentType?> GetByCodeAsync(string code) =>
            await _documentTypes.Find(dt => dt.Code == code).FirstOrDefaultAsync();

        // Get document types by category
        public async Task<List<DocumentType>> GetByCategoryAsync(string category) =>
            await _documentTypes.Find(dt => dt.Category == category && dt.IsActive)
                .SortBy(dt => dt.Name)
                .ToListAsync();

        // Create new document type
        public async Task<DocumentType> CreateAsync(DocumentType documentType)
        {
            documentType.CreatedAt = DateTime.UtcNow;
            documentType.UpdatedAt = DateTime.UtcNow;
            await _documentTypes.InsertOneAsync(documentType);
            return documentType;
        }

        // Update document type
        public async Task<DocumentType?> UpdateAsync(string id, DocumentType documentType)
        {
            documentType.UpdatedAt = DateTime.UtcNow;
            await _documentTypes.ReplaceOneAsync(dt => dt.Id == id, documentType);
            return documentType;
        }

        // Delete document type
        public async Task DeleteAsync(string id) =>
            await _documentTypes.DeleteOneAsync(dt => dt.Id == id);

        // Deactivate document type (soft delete)
        public async Task<DocumentType?> DeactivateAsync(string id)
        {
            var documentType = await GetByIdAsync(id);
            if (documentType == null) return null;

            documentType.IsActive = false;
            documentType.UpdatedAt = DateTime.UtcNow;
            await _documentTypes.ReplaceOneAsync(dt => dt.Id == id, documentType);
            return documentType;
        }

        // Activate document type
        public async Task<DocumentType?> ActivateAsync(string id)
        {
            var documentType = await GetByIdAsync(id);
            if (documentType == null) return null;

            documentType.IsActive = true;
            documentType.UpdatedAt = DateTime.UtcNow;
            await _documentTypes.ReplaceOneAsync(dt => dt.Id == id, documentType);
            return documentType;
        }

        // Initialize default document types
        public async Task InitializeDefaultTypesAsync()
        {
            var existingTypes = await GetAllAsync();
            if (existingTypes.Any()) return; // Already initialized

            var defaultTypes = new List<DocumentType>
            {
                new DocumentType
                {
                    Name = "Barangay Clearance",
                    Description = "Certificate of clearance from the barangay",
                    Code = "BC",
                    Category = "Clearance",
                    BasePrice = 50.00m,
                    ProcessingTime = 3,
                    RequiredDocuments = new List<string> { "Valid ID", "Proof of Residency" },
                    RequiresVerification = true,
                    IsActive = true
                },
                new DocumentType
                {
                    Name = "Certificate of Residency",
                    Description = "Proof of residency in the barangay",
                    Code = "CR",
                    Category = "Certificate",
                    BasePrice = 30.00m,
                    ProcessingTime = 2,
                    RequiredDocuments = new List<string> { "Valid ID" },
                    RequiresVerification = true,
                    IsActive = true
                },
                new DocumentType
                {
                    Name = "Certificate of Indigency",
                    Description = "Certificate for low-income residents",
                    Code = "CI",
                    Category = "Certificate",
                    BasePrice = 0.00m,
                    ProcessingTime = 3,
                    RequiredDocuments = new List<string> { "Valid ID", "Proof of Income" },
                    RequiresVerification = true,
                    IsActive = true
                },
                new DocumentType
                {
                    Name = "Business Permit",
                    Description = "Permit to operate a business in the barangay",
                    Code = "BP",
                    Category = "Permit",
                    BasePrice = 500.00m,
                    ProcessingTime = 7,
                    RequiredDocuments = new List<string> { "Valid ID", "Business Documents", "Location Map" },
                    RequiresVerification = true,
                    IsActive = true
                },
                new DocumentType
                {
                    Name = "Barangay ID",
                    Description = "Official barangay identification card",
                    Code = "BID",
                    Category = "ID",
                    BasePrice = 100.00m,
                    ProcessingTime = 5,
                    RequiredDocuments = new List<string> { "Valid ID", "1x1 Photo", "Proof of Residency" },
                    RequiresVerification = true,
                    IsActive = true
                },
                new DocumentType
                {
                    Name = "Certificate of Good Moral",
                    Description = "Certificate of good moral character",
                    Code = "CGM",
                    Category = "Certificate",
                    BasePrice = 30.00m,
                    ProcessingTime = 3,
                    RequiredDocuments = new List<string> { "Valid ID" },
                    RequiresVerification = true,
                    IsActive = true
                }
            };

            await _documentTypes.InsertManyAsync(defaultTypes);
        }
    }
}
