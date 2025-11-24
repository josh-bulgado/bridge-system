using MongoDB.Driver;
using Server.Models;

namespace server.Services
{
    public class DocumentTemplateService
    {
        private readonly IMongoCollection<DocumentTemplate> _templates;

        public DocumentTemplateService(MongoDBContext context)
        {
            _templates = context.GetCollection<DocumentTemplate>("documentTemplates");
        }

        // Get active template for a document type
        public async Task<DocumentTemplate?> GetActiveTemplateAsync(string documentType)
        {
            return await _templates
                .Find(t => t.DocumentType == documentType && t.IsActive)
                .FirstOrDefaultAsync();
        }

        // Get all templates (version history) for a document type
        public async Task<List<DocumentTemplate>> GetTemplateHistoryAsync(string documentType)
        {
            return await _templates
                .Find(t => t.DocumentType == documentType)
                .SortByDescending(t => t.Version)
                .ToListAsync();
        }

        // Create new template (deactivates old ones)
        public async Task<DocumentTemplate> CreateTemplateAsync(DocumentTemplate template, string? userId = null)
        {
            // Get current active template to determine next version
            var currentTemplate = await GetActiveTemplateAsync(template.DocumentType);

            if (currentTemplate != null)
            {
                // Deactivate old template
                currentTemplate.IsActive = false;
                await _templates.ReplaceOneAsync(t => t.Id == currentTemplate.Id, currentTemplate);

                // Set new version
                template.Version = currentTemplate.Version + 1;
            }
            else
            {
                // First template for this document type
                template.Version = 1;
            }

            template.IsActive = true;
            template.CreatedBy = userId;
            template.CreatedAt = DateTime.UtcNow;

            await _templates.InsertOneAsync(template);
            return template;
        }

        // Get template by ID
        public async Task<DocumentTemplate?> GetTemplateByIdAsync(string id)
        {
            return await _templates
                .Find(t => t.Id == id)
                .FirstOrDefaultAsync();
        }

        // Get all active templates
        public async Task<List<DocumentTemplate>> GetAllActiveTemplatesAsync()
        {
            return await _templates
                .Find(t => t.IsActive)
                .ToListAsync();
        }
    }
}
