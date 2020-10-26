# output "bucket_arn" {
#   value = aws_s3_bucket.bucket_db.arn
# }

output "api_id" {
  value = aws_api_gateway_rest_api.rest_api.id
}

output "api_name" {
  value = var.api_name
}

# output "api_stage" {
#   value = aws_api_gateway_stage._.stage_name
# }