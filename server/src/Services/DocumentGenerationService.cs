using MongoDB.Driver;
using server.Models;
using System.IO;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using DocModel = server.Models.Document;
using OpenXmlDocument = DocumentFormat.OpenXml.Wordprocessing.Document;

namespace server.Services
{
    public class DocumentGenerationService
    {
        private readonly MongoDBContext _context;
        private readonly CloudinaryService _cloudinaryService;
        private readonly ILogger<DocumentGenerationService> _logger;

        public DocumentGenerationService(
            MongoDBContext context,
            CloudinaryService cloudinaryService,
            ILogger<DocumentGenerationService> logger)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _logger = logger;
        }

        /// <summary>
        /// Generate preview data for document generation
        /// </summary>
        public async Task<Dictionary<string, string>> GeneratePreviewDataAsync(
            string documentRequestId)
        {
            var documentRequestCollection = _context.GetCollection<DocumentRequest>("documentRequests");
            var documentRequest = await documentRequestCollection
                .Find(dr => dr.Id == documentRequestId)
                .FirstOrDefaultAsync();

            if (documentRequest == null)
                throw new Exception("Document request not found");

            var residentCollection = _context.GetCollection<Resident>("residents");
            var resident = await residentCollection
                .Find(r => r.Id == documentRequest.ResidentId)
                .FirstOrDefaultAsync();

            if (resident == null)
                throw new Exception("Resident not found");

            var barangayConfigCollection = _context.GetCollection<BarangayConfig>("barangay-config");
            var barangayConfig = await barangayConfigCollection
                .Find(_ => true)
                .FirstOrDefaultAsync();

            if (barangayConfig == null)
                throw new Exception("Barangay configuration not found");

            // Generate OR Number
            var orNumber = await GenerateORNumberAsync();

            // Calculate age from date of birth
            var age = CalculateAge(resident.DateOfBirth);

            // Get full address
            var fullAddress = $"{barangayConfig.Address.BarangayName}, {barangayConfig.Address.MunicipalityName}, {barangayConfig.Address.ProvinceName}";

            var previewData = new Dictionary<string, string>
            {
                { "FULL_NAME", resident.FullName },
                { "AGE", age.ToString() },
                { "CIVIL_STATUS", resident.CivilStatus ?? "" },
                { "MARITAL_STATUS", resident.CivilStatus ?? "" }, // Alias for CIVIL_STATUS
                { "PROVINCE", barangayConfig.Address.ProvinceName },
                { "MUNICIPALITY", barangayConfig.Address.MunicipalityName },
                { "BARANGAY_NAME", barangayConfig.Address.BarangayName },
                { "CAPTAIN_NAME", barangayConfig.BarangayCaptain },
                { "DATE", DateTime.Now.ToString("MMMM dd, yyyy") },
                { "DAY", DateTime.Now.Day.ToString() },
                { "MONTH", DateTime.Now.ToString("MMMM") },
                { "YEAR", DateTime.Now.Year.ToString() },
                { "OR_NO", orNumber },
                { "TRACKING_NUMBER", documentRequest.TrackingNumber },
                { "PURPOSE", documentRequest.Purpose },
                { "FULL_ADDRESS", fullAddress },
                { "LOGO", barangayConfig.LogoUrl } // Add logo URL
            };

            return previewData;
        }

        /// <summary>
        /// Generate document from template with provided data
        /// </summary>
        public async Task<string> GenerateDocumentAsync(
            string documentRequestId,
            Dictionary<string, string> data,
            string generatedBy)
        {
            var documentRequestCollection = _context.GetCollection<DocumentRequest>("documentRequests");
            var documentRequest = await documentRequestCollection
                .Find(dr => dr.Id == documentRequestId)
                .FirstOrDefaultAsync();

            if (documentRequest == null)
                throw new Exception("Document request not found");

            var documentCollection = _context.GetCollection<DocModel>("documents");
            var document = await documentCollection
                .Find(d => d.Id == documentRequest.DocumentId)
                .FirstOrDefaultAsync();

            if (document == null)
                throw new Exception("Document template not found");

            var barangayConfigCollection = _context.GetCollection<BarangayConfig>("barangay-config");
            var barangayConfig = await barangayConfigCollection
                .Find(_ => true)
                .FirstOrDefaultAsync();

            if (barangayConfig == null)
                throw new Exception("Barangay configuration not found");

            // Download template from Cloudinary
            _logger.LogInformation("Using template URL: {TemplateUrl} for document type: {DocumentType}", 
                document.TemplateUrl, document.Name);
            var templatePath = await DownloadTemplateAsync(document.TemplateUrl);

            try
            {
                // Process the document using OpenXML
                var outputPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.docx");
                File.Copy(templatePath, outputPath, true);

                using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(outputPath, true))
                {
                    var body = wordDoc.MainDocumentPart?.Document?.Body;
                    if (body != null)
                    {
                        // First, replace the <<LOGO>> placeholder with an actual image
                        await ReplaceLogoPlaceholderWithImage(wordDoc, barangayConfig.LogoUrl);

                        // Then replace other text placeholders (excluding LOGO since we already handled it)
                        foreach (var kvp in data)
                        {
                            if (kvp.Key != "LOGO") // Skip LOGO, already replaced with image
                            {
                                var placeholder = $"<<{kvp.Key}>>";
                                ReplaceText(body, placeholder, kvp.Value ?? "N/A");
                            }
                        }
                    }

                    wordDoc.MainDocumentPart?.Document.Save();
                }

                // For now, upload DOCX (PDF conversion can be added later)
                // Read file and upload
                using var fileStream = new FileStream(outputPath, FileMode.Open, FileAccess.Read);
                var formFile = new FormFile(fileStream, 0, fileStream.Length, "file", Path.GetFileName(outputPath))
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                };
                
                var uploadResult = await _cloudinaryService.UploadDocumentAsync(
                    formFile,
                    $"generated_documents/{documentRequest.TrackingNumber}_{DateTime.Now:yyyyMMdd_HHmmss}.docx"
                );

                if (!uploadResult.success || string.IsNullOrEmpty(uploadResult.url))
                {
                    throw new Exception($"Failed to upload document: {uploadResult.error}");
                }

                // Update resident civil status if provided and different
                var residentCollection = _context.GetCollection<Resident>("residents");
                var resident = await residentCollection
                    .Find(r => r.Id == documentRequest.ResidentId)
                    .FirstOrDefaultAsync();

                _logger.LogInformation("DEBUG: Resident found: {Found}, ResidentId: {ResidentId}", 
                    resident != null, documentRequest.ResidentId);
                
                if (resident != null)
                {
                    _logger.LogInformation("DEBUG: Current civil status: {Current}, Data contains CIVIL_STATUS: {Contains}", 
                        resident.CivilStatus ?? "NULL", data.ContainsKey("CIVIL_STATUS"));
                    
                    if (data.ContainsKey("CIVIL_STATUS"))
                    {
                        var newCivilStatus = data["CIVIL_STATUS"];
                        _logger.LogInformation("DEBUG: New civil status from data: {New}, Is empty: {IsEmpty}, Are different: {Different}", 
                            newCivilStatus ?? "NULL", 
                            string.IsNullOrEmpty(newCivilStatus),
                            resident.CivilStatus != newCivilStatus);
                        
                        if (!string.IsNullOrEmpty(newCivilStatus) && resident.CivilStatus != newCivilStatus)
                        {
                            var oldStatus = resident.CivilStatus;
                            resident.CivilStatus = newCivilStatus;
                            
                            var updateResult = await residentCollection.ReplaceOneAsync(
                                r => r.Id == resident.Id,
                                resident
                            );
                            
                            _logger.LogInformation("Updated resident {ResidentId} civil status from '{Old}' to '{New}'. ModifiedCount: {Count}", 
                                resident.Id, oldStatus ?? "NULL", newCivilStatus, updateResult.ModifiedCount);
                        }
                        else
                        {
                            _logger.LogInformation("Skipping civil status update - either empty or same value");
                        }
                    }
                    else
                    {
                        _logger.LogWarning("CIVIL_STATUS key not found in data dictionary");
                    }
                }
                else
                {
                    _logger.LogWarning("Resident not found for ResidentId: {ResidentId}", documentRequest.ResidentId);
                }

                // Update document request
                documentRequest.GeneratedDocumentUrl = uploadResult.url;
                documentRequest.GeneratedBy = generatedBy;
                documentRequest.GeneratedAt = DateTime.UtcNow;
                documentRequest.Status = "completed";
                documentRequest.UpdatedAt = DateTime.UtcNow;

                // Add status history
                documentRequest.StatusHistory.Add(new StatusHistory
                {
                    Status = "completed",
                    ChangedBy = generatedBy,
                    ChangedAt = DateTime.UtcNow,
                    Notes = "Document generated successfully"
                });

                await documentRequestCollection.ReplaceOneAsync(
                    dr => dr.Id == documentRequestId,
                    documentRequest
                );

                // Cleanup temp files
                CleanupTempFiles(templatePath, outputPath);

                return uploadResult.url;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating document for request {DocumentRequestId}", documentRequestId);
                CleanupTempFiles(templatePath);
                throw;
            }
        }

        private async Task<string> DownloadTemplateAsync(string cloudinaryUrl)
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(cloudinaryUrl);
            response.EnsureSuccessStatusCode();

            var tempPath = Path.Combine(Path.GetTempPath(), $"template_{Guid.NewGuid()}.docx");
            await using var fs = new FileStream(tempPath, FileMode.Create, FileAccess.Write, FileShare.None);
            await response.Content.CopyToAsync(fs);

            return tempPath;
        }

        private void ReplaceText(OpenXmlElement element, string placeholder, string value)
        {
            // First pass: simple replacement in single text nodes
            foreach (var text in element.Descendants<Text>())
            {
                if (text.Text.Contains(placeholder))
                {
                    text.Text = text.Text.Replace(placeholder, value);
                }
            }

            // Second pass: handle placeholders split across multiple runs
            var paragraphs = element.Descendants<Paragraph>().ToList();
            foreach (var paragraph in paragraphs)
            {
                var fullText = string.Join("", paragraph.Descendants<Text>().Select(t => t.Text));
                
                if (fullText.Contains(placeholder))
                {
                    // Clear all text runs
                    var textElements = paragraph.Descendants<Text>().ToList();
                    foreach (var text in textElements.Skip(1))
                    {
                        text.Remove();
                    }
                    
                    // Replace in the first text element
                    var firstText = paragraph.Descendants<Text>().FirstOrDefault();
                    if (firstText != null)
                    {
                        firstText.Text = fullText.Replace(placeholder, value);
                    }
                }
            }
        }

        private async Task ReplaceLogoPlaceholderWithImage(WordprocessingDocument wordDoc, string imageUrl)
        {
            try
            {
                // Download image from Cloudinary
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"logo_{Guid.NewGuid()}.png");
                await File.WriteAllBytesAsync(tempImagePath, imageBytes);

                var mainPart = wordDoc.MainDocumentPart;
                if (mainPart == null) return;

                // Get image format
                var extension = Path.GetExtension(imageUrl).ToLower();
                var partType = extension switch
                {
                    ".png" => ImagePartType.Png,
                    ".jpg" or ".jpeg" => ImagePartType.Jpeg,
                    ".gif" => ImagePartType.Gif,
                    ".bmp" => ImagePartType.Bmp,
                    _ => ImagePartType.Png
                };

                // Add the image to the document
                ImagePart imagePart = mainPart.AddImagePart(partType);
                using (FileStream stream = new FileStream(tempImagePath, FileMode.Open))
                {
                    imagePart.FeedData(stream);
                }

                // Get the relationship ID
                string relationshipId = mainPart.GetIdOfPart(imagePart);

                // Find all paragraphs containing <<LOGO>>
                var paragraphs = mainPart.Document.Body.Descendants<Paragraph>().ToList();
                foreach (var paragraph in paragraphs)
                {
                    var fullText = string.Join("", paragraph.Descendants<Text>().Select(t => t.Text));
                    
                    if (fullText.Contains("<<LOGO>>"))
                    {
                        // Remove all existing runs in the paragraph
                        paragraph.RemoveAllChildren<Run>();

                        // Create a new run with the image
                        var run = paragraph.AppendChild(new Run());
                        
                        // Create drawing element with 1.5" x 1.5" dimensions (1.5 inch = 1371600 EMUs)
                        const long emusPerInch = 914400L;
                        const double sizeInInches = 1.5;
                        long imageSize = (long)(sizeInInches * emusPerInch);

                        var element = new Drawing(
                            new DW.Inline(
                                new DW.Extent() { Cx = imageSize, Cy = imageSize },
                                new DW.EffectExtent() { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                                new DW.DocProperties() { Id = 1U, Name = "Barangay Logo" },
                                new DW.NonVisualGraphicFrameDrawingProperties(
                                    new A.GraphicFrameLocks() { NoChangeAspect = true }),
                                new A.Graphic(
                                    new A.GraphicData(
                                        new PIC.Picture(
                                            new PIC.NonVisualPictureProperties(
                                                new PIC.NonVisualDrawingProperties() { Id = 0U, Name = "Logo.png" },
                                                new PIC.NonVisualPictureDrawingProperties()),
                                            new PIC.BlipFill(
                                                new A.Blip() { Embed = relationshipId },
                                                new A.Stretch(new A.FillRectangle())),
                                            new PIC.ShapeProperties(
                                                new A.Transform2D(
                                                    new A.Offset() { X = 0L, Y = 0L },
                                                    new A.Extents() { Cx = imageSize, Cy = imageSize }),
                                                new A.PresetGeometry(new A.AdjustValueList()) { Preset = A.ShapeTypeValues.Rectangle }))
                                    ) { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                            ) 
                            { 
                                DistanceFromTop = 0U, 
                                DistanceFromBottom = 0U, 
                                DistanceFromLeft = 0U, 
                                DistanceFromRight = 0U 
                            });

                        run.AppendChild(element);
                        
                        _logger.LogInformation("Successfully replaced <<LOGO>> with image");
                        break; // Only replace the first occurrence
                    }
                }

                File.Delete(tempImagePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error replacing <<LOGO>> with image");
                // Continue without logo if image replacement fails
            }
        }

        private async Task ReplaceImageInDocument(WordprocessingDocument wordDoc, string imageUrl, string relationshipId)
        {
            try
            {
                // Download image from Cloudinary
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var tempImagePath = Path.Combine(Path.GetTempPath(), $"logo_{Guid.NewGuid()}.png");
                await File.WriteAllBytesAsync(tempImagePath, imageBytes);

                var mainPart = wordDoc.MainDocumentPart;
                if (mainPart == null) return;

                // Find the image part by relationship ID
                var imagePart = mainPart.ImageParts.FirstOrDefault(ip => 
                    mainPart.GetIdOfPart(ip) == relationshipId);

                if (imagePart != null)
                {
                    // Simply replace the image data without changing the dimensions
                    // The template already has the size set (1.5" x 1.5"), so we just update the data
                    using (FileStream stream = new FileStream(tempImagePath, FileMode.Open, FileAccess.Read))
                    {
                        imagePart.FeedData(stream);
                    }

                    _logger.LogInformation("Successfully replaced image at {RelationshipId}", relationshipId);
                }
                else
                {
                    _logger.LogWarning("Image relationship {RelationshipId} not found in template. Available IDs: {AvailableIds}", 
                        relationshipId, 
                        string.Join(", ", mainPart.ImageParts.Select(ip => mainPart.GetIdOfPart(ip))));
                }

                File.Delete(tempImagePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error replacing image in document");
                // Continue without logo if image replacement fails
            }
        }

        private int CalculateAge(string dateOfBirth)
        {
            if (DateTime.TryParse(dateOfBirth, out var dob))
            {
                var today = DateTime.Today;
                var age = today.Year - dob.Year;
                if (dob.Date > today.AddYears(-age)) age--;
                return age;
            }
            return 0;
        }

        private async Task<string> GenerateORNumberAsync()
        {
            var year = DateTime.Now.Year;
            var prefix = $"OR-{year}-";

            // Get the last OR number for this year
            var documentRequestCollection = _context.GetCollection<DocumentRequest>("documentRequests");
            var lastRequest = await documentRequestCollection
                .Find(dr => dr.GeneratedDocumentUrl != null && dr.GeneratedAt != null)
                .SortByDescending(dr => dr.GeneratedAt)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (lastRequest != null && !string.IsNullOrEmpty(lastRequest.TrackingNumber ?? ""))
            {
                // Extract number from last tracking number and increment
                var match = Regex.Match(lastRequest.TrackingNumber ?? "", @"-(\d+)$");
                if (match.Success && int.TryParse(match.Groups[1].Value, out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"{prefix}{nextNumber:D5}";
        }

        private void CleanupTempFiles(params string[] paths)
        {
            foreach (var path in paths)
            {
                try
                {
                    if (!string.IsNullOrEmpty(path) && File.Exists(path))
                    {
                        File.Delete(path);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to cleanup temp file: {Path}", path);
                }
            }
        }
    }
}
