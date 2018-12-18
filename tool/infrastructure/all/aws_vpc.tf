#####################################
# VPC Settings
#####################################
resource "aws_vpc" "vpc_main" {
  cidr_block           = "${var.vpc_main_cidr}"
  enable_dns_hostnames = true

  tags {
    Name = "${var.app_name}"
  }
}

#####################################
# Internet Gateway Settings
#####################################
resource "aws_internet_gateway" "vpc_main_igw" {
  vpc_id = "${aws_vpc.vpc_main.id}"

  tags {
    Name = "${var.app_name} igw"
  }
}

#####################################
# Public Subnets Settings
#####################################
resource "aws_subnet" "vpc_main_public_subnet1" {
  vpc_id                  = "${aws_vpc.vpc_main.id}"
  cidr_block              = "${var.vpc_main_cidr_public1}"
  availability_zone       = "${var.az1}"
  map_public_ip_on_launch = true

  tags {
    Name = "${var.app_name} public-subnet1"
  }
}

resource "aws_subnet" "vpc_main_public_subnet2" {
  vpc_id                  = "${aws_vpc.vpc_main.id}"
  cidr_block              = "${var.vpc_main_cidr_public2}"
  availability_zone       = "${var.az2}"
  map_public_ip_on_launch = true

  tags {
    Name = "${var.app_name} public-subnet2"
  }
}

#####################################
# Private DB Subnets Settings
#####################################
resource "aws_subnet" "vpc_main_private_db_subnet1" {
  vpc_id            = "${aws_vpc.vpc_main.id}"
  cidr_block        = "${var.vpc_main_cidr_db1}"
  availability_zone = "${var.az1}"

  tags {
    Name = "${var.app_name} private-db-subnet1"
  }
}

resource "aws_subnet" "vpc_main_private_db_subnet2" {
  vpc_id            = "${aws_vpc.vpc_main.id}"
  cidr_block        = "${var.vpc_main_cidr_db2}"
  availability_zone = "${var.az2}"

  tags {
    Name = "${var.app_name} private-db-subnet2"
  }
}

resource "aws_db_subnet_group" "vpc_main_db_subnet_group" {
  name       = "vpc_main_db_subnet_group"
  subnet_ids = ["${aws_subnet.vpc_main_private_db_subnet1.id}", "${aws_subnet.vpc_main_private_db_subnet2.id}"]

  tags {
    Name = "${var.app_name} DB subnet group"
  }
}

#####################################
# Security Group for DB
#####################################
resource "aws_security_group" "db_security_group" {
  vpc_id = "${aws_vpc.vpc_main.id}"
  name   = "db_security_group"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["${var.vpc_main_cidr}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  description = "DB only"
}

#####################################
# Security Group for ElasticBeanstalk Instance
#####################################
resource "aws_security_group" "sg_eb" {
  vpc_id = "${aws_vpc.vpc_main.id}"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["${var.ip_whitelist_for_sg}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "SG for ElasticBeanstalk LoadBalancer"
  }
}

resource "aws_security_group" "sg_eb_full_access" {
  vpc_id = "${aws_vpc.vpc_main.id}"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "Full Access SG for ElasticBeanstalk LoadBalancer"
  }
}

resource "aws_security_group" "sg_eb_instance" {
  vpc_id = "${aws_vpc.vpc_main.id}"

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.sg_eb.id}"]
  }

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.sg_eb_full_access.id}"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = "${var.ip_whitelist_for_sg}"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "SG for Instance"
  }
}

#####################################
# Routes Table Settings
#####################################
resource "aws_route_table" "vpc_main_public_rt" {
  vpc_id = "${aws_vpc.vpc_main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.vpc_main_igw.id}"
  }

  tags {
    Name = "${var.app_name} public-rt"
  }
}

#####################################
# Routing
#####################################
resource "aws_route_table_association" "vpc_main_rta1" {
  subnet_id      = "${aws_subnet.vpc_main_public_subnet1.id}"
  route_table_id = "${aws_route_table.vpc_main_public_rt.id}"
}

resource "aws_route_table_association" "vpc_main_rta2" {
  subnet_id      = "${aws_subnet.vpc_main_public_subnet2.id}"
  route_table_id = "${aws_route_table.vpc_main_public_rt.id}"
}
