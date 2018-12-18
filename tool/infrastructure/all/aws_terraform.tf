#####################################
# Terraform State Settings
#####################################

terraform {
  backend "s3" {
    bucket = "kevd-terraform"
    key    = "terraform.tfstate.aws"
    region = "ap-northeast-1"
  }
}
