using MongoDB.Driver;
using server.Models;
using Server.Models;

namespace server.Services
{
    public class DocumentService
    {
        private readonly IMongoCollection<Document> _documents;
        private readonly DocumentTemplateService _templateService;

        public DocumentService(MongoDBContext context, DocumentTemplateService templateService)
        {
            _documents = context.GetCollection<Document>("documents");
            _templateService = templateService;
        }

        // Get all documents
        public async Task<List<Document>> GetAllAsync() =>
            await _documents.Find(_ => true).ToListAsync();

        // Get document by ID
        public async Task<Document?> GetByIdAsync(string id) =>
            await _documents.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Create new document
        public async Task<Document> CreateAsync(Document document, string? userId = null)
        {
            document.CreatedAt = DateTime.UtcNow;
            document.UpdatedAt = DateTime.UtcNow;
            document.LastModified = DateTime.UtcNow.ToString("yyyy-MM-dd");
            document.TotalRequests = 0;

            await _documents.InsertOneAsync(document);

            // Create DocumentTemplate record
            var template = new DocumentTemplate
            {
                DocumentType = document.Name,
                TemplateName = $"{document.Name} Template",
                TemplateUrl = document.TemplateUrl,
            };

            await _templateService.CreateTemplateAsync(template, userId);

            return document;
        }

        // Update document
        public async Task<Document?> UpdateAsync(string id, Document document)
        {
            var existingDocument = await GetByIdAsync(id);
            if (existingDocument == null)
                return null;

            document.Id = id;
            document.CreatedAt = existingDocument.CreatedAt;
            document.TotalRequests = existingDocument.TotalRequests;
            document.UpdatedAt = DateTime.UtcNow;
            document.LastModified = DateTime.UtcNow.ToString("yyyy-MM-dd");

            await _documents.ReplaceOneAsync(x => x.Id == id, document);
            return document;
        }

        // Delete document
        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _documents.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }

        // Toggle document status (Activate/Deactivate)
        public async Task<Document?> ToggleStatusAsync(string id, string status)
        {
            var document = await GetByIdAsync(id);
            if (document == null)
                return null;

            var update = Builders<Document>.Update
                .Set(x => x.Status, status)
                .Set(x => x.UpdatedAt, DateTime.UtcNow)
                .Set(x => x.LastModified, DateTime.UtcNow.ToString("yyyy-MM-dd"));

            await _documents.UpdateOneAsync(x => x.Id == id, update);
            
            return await GetByIdAsync(id);
        }

        // Duplicate document
        public async Task<Document> DuplicateAsync(string id)
        {
            var originalDocument = await GetByIdAsync(id);
            if (originalDocument == null)
                throw new Exception("Document not found");

            var duplicatedDocument = new Document
            {
                Name = $"{originalDocument.Name} (Copy)",
                Price = originalDocument.Price,
                Requirements = new List<string>(originalDocument.Requirements),
                Status = originalDocument.Status,
                ProcessingTime = originalDocument.ProcessingTime,
                TemplateUrl = originalDocument.TemplateUrl,
                TotalRequests = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow.ToString("yyyy-MM-dd")
            };

            await _documents.InsertOneAsync(duplicatedDocument);
            return duplicatedDocument;
        }

        // Search documents by name
        public async Task<List<Document>> SearchByNameAsync(string searchTerm)
        {
            var filter = Builders<Document>.Filter.Regex(
                x => x.Name, 
                new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")
            );
            return await _documents.Find(filter).ToListAsync();
        }

        // Get active documents only
        public async Task<List<Document>> GetActiveDocumentsAsync()
        {
            var filter = Builders<Document>.Filter.Eq(x => x.Status, "Active");
            return await _documents.Find(filter).ToListAsync();
        }

        // Increment total requests count
        public async Task IncrementTotalRequestsAsync(string id)
        {
            var update = Builders<Document>.Update
                .Inc(x => x.TotalRequests, 1)
                .Set(x => x.UpdatedAt, DateTime.UtcNow);

            await _documents.UpdateOneAsync(x => x.Id == id, update);
        }
    }
}
