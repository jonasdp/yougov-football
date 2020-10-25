# -----------------------------------------------------------------------------
# Variables: General
# -----------------------------------------------------------------------------

variable "region" {
  default = "eu-west-1"
  description = "The region where the infrastructure will be created"
}

variable "profile" {
  description = "AWS profile to use"
}

variable "resource_tags" {
  description = "Resource tags mainly for cost tracking"
  type = map
}

# -----------------------------------------------------------------------------
# Variables: S3
# -----------------------------------------------------------------------------

variable "bucket_db_name" {
  description = "Name of the data bucket"  
}

variable "bucket_acl_db" {
  description = "Permissions for the data bucket"  
}

variable "object_db_source" {
  description = "Data source file"  
}

variable "record_api_zone_id" {
  description = "Route53 zone id"
}

variable "api_domain_name_name" {
  description = "API domain name"
}

variable "domain_certificate_arn" {
  description = "Domain certificate"
}

variable "api_name" {
  description = "API Gateway name"
}

variable "api_template_path" {
  description = "API template file"
}

variable "api_template_vars" {
  description = "Variables required in the OpenAPI template file"
  type        = map
}

variable "table_name" {
  description = "DynamoDB name"
}

variable "table_read_capacity" {
  description = "DynamoDB read cap."
}

variable "table_write_capacity" {
  description = "DynamoDB write cap."
}

variable "table_key" {
  description = "DynamoDB hash key"
}