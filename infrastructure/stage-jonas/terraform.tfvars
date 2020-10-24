profile = "jonasdp-aws-main--aws-cli"

resource_tags = {
  "user:Application" = "yougov-football"
  "user:Stack" = "Dev"
  "user:Owner" = "jonas"
}

bucket_db_name = "db.yougov.codeautomata.com"

bucket_acl_db = "public-read-write"

object_db_source = "../data/yougov-football-data.json"

record_api_zone_id = "Z098233249CFE83KID7Z"

api_domain_name_name = "api.yougov.codeautomata.com"

domain_certificate_arn = "arn:aws:acm:eu-west-1:006847063875:certificate/4a9ff130-d50e-440a-bc8c-fdce9d06d3f6"

api_name = "yougov-football-api"

api_template_path = "../openapi/yougov-football-api.json"