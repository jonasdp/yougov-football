provider "aws" {
  profile = var.profile
  region  = var.region
}

# Create the bucket that host the data
# resource "aws_s3_bucket" "bucket_db" {
#   bucket = var.bucket_db_name
#   acl    = var.bucket_acl_db
#   tags   = var.resource_tags
# }

# # Upload the JSON data
# resource "aws_s3_bucket_object" "object_db" {
#   bucket = aws_s3_bucket.bucket_db.id
#   key    = "db"
#   acl    = var.bucket_acl_db
#   source = var.object_db_source
#   etag   = filemd5(var.object_db_source)
#   tags   = var.resource_tags
# }

# Create database table in DynamoDB
resource "aws_dynamodb_table" "table" {
  name           = var.table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = var.table_read_capacity
  write_capacity = var.table_write_capacity
  hash_key       = var.table_key

  attribute {
    name = var.table_key
    type = "S"
  }

  # ttl {
  #   attribute_name = "TimeToExist"
  #   enabled        = false
  # }

  tags = var.resource_tags
}

# Lambda IAM permissions
data "aws_iam_policy_document" "lambda_invoke_permission" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]

    principals {
      identifiers = [
        "lambda.amazonaws.com",
      ]

      type = "Service"
    }
  }
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
    ]

    resources = [
      "*",
    ]
  }

  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "*"
    ]
  }

  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeTable",
      "dynamodb:GetItem"
    ]

    resources = [
      "*",
    ]
  }
}

resource "aws_iam_policy" "lambda_policy" {
  policy = data.aws_iam_policy_document.lambda_policy_document.json
  name   = "LambdaDynamoPolicy"
}

resource "aws_iam_role" "lambda_role" {
  name               = "LambdaDynamoRole"
  description        = "Use for lambdas that need no other access"
  assume_role_policy = data.aws_iam_policy_document.lambda_invoke_permission.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_policy.arn
  role       = aws_iam_role.lambda_role.name
}

# Lambda
resource "aws_lambda_function" "lambda" {
  filename         = var.lambda_path
  function_name    = "YougovFootballService"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  description      = "YouGov Football Service"
  source_code_hash = filebase64sha256(var.lambda_path)
  runtime          = var.lambda_runtime
  publish          = true
  timeout          = 5
  memory_size      = 128

  environment {
    variables = {
      TABLE_NAME = var.table_name
    }
  }
}

# OpenAPI 3.0 Spec
data "template_file" "_" {
   template = file(var.api_template_path)
   vars = var.api_template_vars
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

# Create the DNS record using Route53
resource "aws_route53_record" "record_api" {
  name    = aws_api_gateway_domain_name.api_domain_name.domain_name
  type    = "A"
  zone_id = var.record_api_zone_id

  alias {
    evaluate_target_health = false
    name                   = aws_api_gateway_domain_name.api_domain_name.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_domain_name.regional_zone_id
  }
}

# Create the API
resource "aws_api_gateway_rest_api" "rest_api" {
  name = var.api_name
  #body = data.template_file._.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = var.resource_tags
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "teams"
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [aws_api_gateway_integration.integration]

  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "v1"

  lifecycle {
    create_before_destroy = true
  }
}