profile = "jonasdp-aws-main--aws-cli"

resource_tags = {
  "user:Application" = "yougov-football"
  "user:Stack" = "Dev"
  "user:Owner" = "jonas"
}

bucket_db_name = "yougov-football-db"

bucket_acl_db = "public-read-write"

object_db_source = "../data/yougov-football-data.json"

record_api_zone_id = "Z098233249CFE83KID7Z"

api_domain_name_name = "api.yougov.codeautomata.com"

domain_certificate_arn = "arn:aws:acm:eu-west-1:006847063875:certificate/28c327ff-098b-4985-a35e-0d66d7e9e2b6"

api_name = "yougov-football-api"

api_template_path = "../api/yougov-football-api.json"

api_template_vars = {
    region = "eu-west-1"
  }

table_name = "yougovFootballTeams"

table_read_capacity = 1

table_write_capacity = 1

table_key = "name"