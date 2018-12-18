#####################################
# Elastic Container Repository for Docker images
#####################################

resource "aws_ecr_repository" "aws_container_repository" {
  name = "${var.app_name}"
}

resource "aws_ecr_lifecycle_policy" "expiration_policy" {
  repository = "${aws_ecr_repository.aws_container_repository.name}"

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire images older than 4 generations",
            "selection": {
                "tagStatus": "tagged",
                "countType": "imageCountMoreThan",
                "countNumber": 3,
                "tagPrefixList": [
                     "staging"
                ]
            },
            "action": {
                "type": "expire"
            }
        },
                {
            "rulePriority": 2,
            "description": "Expire images older than 4 generations",
            "selection": {
                "tagStatus": "tagged",
                "countType": "imageCountMoreThan",
                "countNumber": 3,
                "tagPrefixList": [
                     "review"
                ]
            },
            "action": {
                "type": "expire"
            }
        },
                {
            "rulePriority": 3,
            "description": "Expire images older than 4 generations",
            "selection": {
                "tagStatus": "tagged",
                "countType": "imageCountMoreThan",
                "countNumber": 3,
                "tagPrefixList": [
                     "demo"
                ]
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
