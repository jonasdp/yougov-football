# Create the bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "yougov-football"
  acl    = "public"
}

# Upload the JSON data
resource "aws_s3_bucket_object" "object" {
  bucket = aws_s3_bucket.bucket.id
  key    = "football"
  acl    = "public"
  source = "../data/football.json"
  etag   = filemd5("../data/football.json")
}
