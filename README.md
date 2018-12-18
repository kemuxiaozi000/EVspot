![K-EVD](https://bitbucket.org/s3c_kevd/kevd/raw/d3bb6600ddfaf2c273761565ae1e651a58d636de/kevd-logo.png)

[![CircleCI](https://circleci.com/bb/s3c_kevd/kevd/tree/master.svg?style=svg&circle-token=4f60e7ae231bbfb33e7c235506e255e090f91f8f)](https://circleci.com/bb/s3c_kevd/kevd/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ba47ac4b8a9771b2362e/maintainability)](https://codeclimate.com/repos/5be40a5b0ac93902a30013ec/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ba47ac4b8a9771b2362e/test_coverage)](https://codeclimate.com/repos/5be40a5b0ac93902a30013ec/test_coverage)

* 開発環境: http://localhost:3000/

* Review環境 [![CircleCI](https://circleci.com/bb/s3c_kevd/kevd/tree/review.svg?style=svg&circle-token=4f60e7ae231bbfb33e7c235506e255e090f91f8f)](https://circleci.com/bb/s3c_kevd/kevd/tree/review) (BASIC Authentication, no IP address restriction): https://kevd-review.agile-dev.work/

* Staging環境 [![CircleCI](https://circleci.com/bb/s3c_kevd/kevd/tree/staging.svg?style=svg&circle-token=4f60e7ae231bbfb33e7c235506e255e090f91f8f)](https://circleci.com/bb/s3c_kevd/kevd/tree/staging) (BASIC Authentication, no IP address restriction): https://kevd-staging.agile-dev.work/

## 開発環境ガイド

### 必要な道具

- git
- ruby
- gem
- [Docker](https://www.docker.com/get-started)
- [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/installing.html) (任意)

### ローカルでアプリケーションを起動させる

`bash script/start_local.sh ${BRANCH_NAME}`

### 静的コード解析ツールを一括で実行する

`bash script/overcommit.sh`

## インフラ編（AWS、ElasticbeansTalk、Terraform）

### インフラの構築・変更反映

`bash tool/infrastructure/all/build.sh`

### アプリの手動デプロイ

`bash tool/deploy/deploy.sh`

### デプロイ後のログ確認

`eb logs --stream`

### EC2インスタンスの一覧取得（環境ごと）

`aws ec2 describe-instances | jq ".Reservations[].Instances[] | { instances: .PublicDnsName, tags: ( .Tags[] | select( .Key == \"elasticbeanstalk:environment-name\") )}"`
