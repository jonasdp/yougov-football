provider "aws" {
  profile = var.profile
  region  = var.region
}

data "api_template" "_" {
  filename = file(var.api_template_path)
  vars     = {
    region = var.region
  }
}

# Create the bucket that host the data
resource "aws_s3_bucket" "bucket_db" {
  bucket = var.bucket_db_name
  acl    = var.bucket_acl_db
  tags   = var.resource_tags
}

# Upload the JSON data
resource "aws_s3_bucket_object" "object_db" {
  bucket = aws_s3_bucket.bucket_db.id
  key    = "db"
  acl    = var.bucket_acl_db
  source = var.object_db_source
  etag   = filemd5(var.object_db_source)
  tags   = var.resource_tags
}


# Create the API record
resource "aws_api_gateway_domain_name" "api_domain_name" {
  domain_name              = var.api_domain_name_name
  regional_certificate_arn = var.domain_certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.resource_tags
}

# Create the DNS record using Route53.
resource "aws_route53_record" "record_api" {
  name    = aws_api_gateway_domain_name.api_domain_name.domain_name
  type    = "A"
  zone_id = var.record_api_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_api_gateway_domain_name.api_domain_name.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_domain_name.regional_zone_id
  }

  tags = var.resource_tags
}

resource "aws_api_gateway_rest_api" "api_rest" {
  name = var.api_name
  body = data.api_template._.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.resource_tags
}