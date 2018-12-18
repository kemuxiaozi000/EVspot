resource "aws_elastic_beanstalk_application" "aws_eb_web_app" {
  name        = "${var.app_name}"
  description = "${var.app_name} of beanstalk deployment"
}

