using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using server.Services;

namespace server.Services
{
    public class FileStorageService
    {
        private readonly IGridFSBucket _gridFSBucket;

        public FileStorageService(MongoDBContext context)
        {
            var database = context.Database;
            _gridFSBucket = new GridFSBucket(database, new GridFSBucketOptions
            {
                BucketName = "uploads",
                ChunkSizeBytes = 1048576 // 1MB chunks
            });
        }

        // Upload file to GridFS
        public async Task<string> UploadFileAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var options = new GridFSUploadOptions
                {
                    Metadata = new BsonDocument
                    {
                        { "contentType", file.ContentType },
                        { "originalFileName", file.FileName },
                        { "uploadDate", DateTime.UtcNow }
                    }
                };

                var fileId = await _gridFSBucket.UploadFromStreamAsync(
                    file.FileName,
                    stream,
                    options
                );

                return fileId.ToString();
            }
        }

        // Download file from GridFS
        public async Task<(Stream? stream, string contentType, string fileName)> DownloadFileAsync(string fileId)
        {
            try
            {
                var objectId = ObjectId.Parse(fileId);
                var fileInfo = await _gridFSBucket.Find(
                    Builders<GridFSFileInfo>.Filter.Eq("_id", objectId)
                ).FirstOrDefaultAsync();

                if (fileInfo == null)
                    return (null, string.Empty, string.Empty);

                var stream = await _gridFSBucket.OpenDownloadStreamAsync(objectId);

                var contentType = fileInfo.Metadata.Contains("contentType")
                    ? fileInfo.Metadata["contentType"].AsString
                    : "application/octet-stream";

                var fileName = fileInfo.Metadata.Contains("originalFileName")
                    ? fileInfo.Metadata["originalFileName"].AsString
                    : fileInfo.Filename;

                return (stream, contentType, fileName);
            }
            catch (Exception)
            {
                return (null, string.Empty, string.Empty);
            }
        }

        // Delete file from GridFS
        public async Task DeleteFileAsync(string fileId)
        {
            var objectId = ObjectId.Parse(fileId);
            await _gridFSBucket.DeleteAsync(objectId);
        }

        // Get file info
        public async Task<GridFSFileInfo?> GetFileInfoAsync(string fileId)
        {
            try
            {
                var objectId = ObjectId.Parse(fileId);
                return await _gridFSBucket.Find(
                    Builders<GridFSFileInfo>.Filter.Eq("_id", objectId)
                ).FirstOrDefaultAsync();
            }
            catch
            {
                return null;
            }
        }
    }
}
