#####################################
# Terraform State Settings
#####################################

terraform {
  backend "s3" {
    bucket = "agleader-terraform-review"
    key    = "terraform.tfstate.aws"
    region = "ap-northeast-1"
  }
}
